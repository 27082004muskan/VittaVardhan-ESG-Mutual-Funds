from typing import Any, Dict, List

import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from scipy.stats import rankdata
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import uvicorn


DATA_PATH = "c:/Project/Vittavardhan/kaggle.csv"
SAMPLE_SIZE = 20000


class RecommendRequest(BaseModel):
    age: int
    monthlyIncome: float
    monthlyInvestment: float
    riskProfile: str
    investmentHorizonYears: int
    goal: str


class AELM:
    def __init__(self, lr: float = 0.01, epochs: int = 700):
        self.lr = lr
        self.epochs = epochs
        self.w1 = None
        self.w2 = None
        self.b = 0.0

    def fit(self, x: np.ndarray, y_rank: np.ndarray):
        n, d = x.shape
        self.w1 = np.random.randn(d) * 0.1
        self.w2 = np.random.randn(d) * 0.1
        self.b = 0.0

        for _ in range(self.epochs):
            linear = x.dot(self.w1)
            nonlinear = np.tanh(x.dot(self.w2))
            pred = linear + nonlinear + self.b
            error = pred - y_rank

            grad_w1 = x.T.dot(error) / n
            grad_w2 = x.T.dot(error) / n
            grad_b = np.mean(error)

            self.w1 -= self.lr * grad_w1
            self.w2 -= self.lr * grad_w2
            self.b -= self.lr * grad_b

    def predict(self, x: np.ndarray) -> np.ndarray:
        return x.dot(self.w1) + np.tanh(x.dot(self.w2)) + self.b


app = FastAPI(title="Mutual Fund ML Service", version="1.0.0")

# Global artifacts initialized at startup
MODEL: AELM = None
SCALER: StandardScaler = None
DF_SOURCE: pd.DataFrame = None
DF_TEST: pd.DataFrame = None
FEATURES: List[str] = []
FUND_COLS: List[str] = []
BASE_RANKED: pd.DataFrame = None


def _safe_mean(df: pd.DataFrame, cols: List[str]) -> pd.Series:
    if len(cols) == 0:
        return pd.Series(0, index=df.index)
    return df[cols].mean(axis=1)


def _build_features(df_numeric: pd.DataFrame) -> pd.DataFrame:
    fossil_cols = [c for c in df_numeric.columns if "fossil" in c.lower()]
    coal_cols = [c for c in df_numeric.columns if "coal" in c.lower()]
    oil_cols = [c for c in df_numeric.columns if ("oil" in c.lower() or "gas" in c.lower())]
    carbon_cols = [c for c in df_numeric.columns if "carbon" in c.lower()]

    engineered = df_numeric.copy()
    engineered["fossil_score"] = _safe_mean(engineered, fossil_cols)
    engineered["coal_score"] = _safe_mean(engineered, coal_cols)
    engineered["oil_gas_score"] = _safe_mean(engineered, oil_cols)
    engineered["carbon_score"] = _safe_mean(engineered, carbon_cols)

    engineered["interaction_1"] = np.sin(engineered["fossil_score"] * engineered["carbon_score"])
    engineered["interaction_2"] = np.log1p(engineered["coal_score"] ** 2)
    engineered["interaction_3"] = np.sqrt(np.abs(engineered["oil_gas_score"]) + 1)
    return engineered


def _train_pipeline():
    global MODEL, SCALER, DF_SOURCE, DF_TEST, FEATURES, FUND_COLS, BASE_RANKED

    np.random.seed(42)
    df_original = pd.read_csv(DATA_PATH, low_memory=False)
    if len(df_original) > SAMPLE_SIZE:
        df_original = df_original.sample(n=SAMPLE_SIZE, random_state=42)
    df_original = df_original.reset_index(drop=True)
    DF_SOURCE = df_original

    # Numeric preprocessing
    df_num = df_original.select_dtypes(include=[np.number]).copy()
    df_num = df_num.loc[:, df_num.isnull().mean() < 0.8]
    df_num = df_num.fillna(df_num.median(numeric_only=True))

    # Feature engineering
    df_eng = _build_features(df_num)
    FEATURES = [
        "fossil_score",
        "coal_score",
        "oil_gas_score",
        "carbon_score",
        "interaction_1",
        "interaction_2",
        "interaction_3",
    ]
    x = df_eng[FEATURES].values

    # Target construction from your notebook approach
    y = (
        df_eng["interaction_1"]
        + df_eng["interaction_2"]
        + df_eng["interaction_3"]
        - (df_eng["carbon_score"] ** 2)
    )
    y = y + np.random.normal(0, 0.3, len(y))
    y = (y - y.mean()) / (y.std() + 1e-8)

    x_train, x_test, y_train, _y_test, train_idx, test_idx = train_test_split(
        x, y.values, df_original.index, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    x_train_scaled = scaler.fit_transform(x_train)
    x_test_scaled = scaler.transform(x_test)
    y_rank = rankdata(y_train) / len(y_train)

    model = AELM()
    model.fit(x_train_scaled, y_rank)
    preds = model.predict(x_test_scaled)

    df_test = df_original.loc[test_idx].copy()
    df_test["AELM_score"] = preds
    DF_TEST = df_test

    FUND_COLS = [c for c in df_test.columns if ("fund" in c.lower() or "ticker" in c.lower())]
    BASE_RANKED = df_test.sort_values("AELM_score", ascending=False).reset_index(drop=True)

    MODEL = model
    SCALER = scaler


def _to_recommendations(req: RecommendRequest, top_k: int = 10) -> List[Dict[str, Any]]:
    if BASE_RANKED is None:
        return []

    # Personalized re-ranking layer
    personalized = BASE_RANKED.copy()
    boost = np.zeros(len(personalized))

    # Normalize base score so profile signals have stronger impact
    score_std = np.std(personalized["AELM_score"]) + 1e-8
    score_norm = (personalized["AELM_score"] - np.mean(personalized["AELM_score"])) / score_std

    # Risk-based weighting (stronger than before)
    if req.riskProfile.lower() == "low":
        boost -= np.abs(score_norm) * 0.55
    elif req.riskProfile.lower() == "high":
        boost += np.abs(score_norm) * 0.55
    else:  # moderate
        boost += np.abs(score_norm) * 0.10

    # Horizon-based weighting
    if req.investmentHorizonYears >= 7:
        boost += np.abs(score_norm) * 0.30
    elif req.investmentHorizonYears <= 3:
        boost -= np.abs(score_norm) * 0.30

    # Age + income + investment capacity modifiers
    if req.age <= 30:
        boost += np.abs(score_norm) * 0.18
    elif req.age >= 50:
        boost -= np.abs(score_norm) * 0.18

    invest_ratio = req.monthlyInvestment / max(req.monthlyIncome, 1.0)
    if invest_ratio >= 0.35:
        boost += 0.08
    elif invest_ratio <= 0.08:
        boost -= 0.05

    if req.monthlyInvestment >= 15000:
        boost += 0.10
    elif req.monthlyInvestment < 3000:
        boost -= 0.08

    # Goal preferences
    goal = (req.goal or "").lower()
    if goal in {"retirement", "child_education", "wealth_creation"}:
        boost += np.abs(score_norm) * 0.12
    elif goal in {"tax_saving", "house_purchase"}:
        boost -= np.abs(score_norm) * 0.06

    # Deterministic profile-specific diversification:
    # ensures different users don't get identical top-N every time.
    profile_key = (
        f"{req.age}|{req.monthlyIncome}|{req.monthlyInvestment}|"
        f"{req.riskProfile}|{req.investmentHorizonYears}|{req.goal}"
    )
    profile_seed = abs(hash(profile_key)) % (2**32)
    rng = np.random.default_rng(profile_seed)
    boost += rng.normal(0, 0.02, len(personalized))

    personalized["final_score"] = personalized["AELM_score"] + boost
    top = personalized.sort_values("final_score", ascending=False).head(top_k)

    recs: List[Dict[str, Any]] = []
    for _, row in top.iterrows():
        if len(FUND_COLS) >= 2:
            fund_name = str(row[FUND_COLS[0]])
            ticker = str(row[FUND_COLS[1]])
        elif len(FUND_COLS) == 1:
            fund_name = str(row[FUND_COLS[0]])
            ticker = "N/A"
        else:
            fund_name = f"Fund_{int(row.name) + 1}"
            ticker = "N/A"

        recs.append(
            {
                "fundName": fund_name,
                "ticker": ticker,
                "score": float(round(row["final_score"], 4)),
                "reason": (
                    f"Matched for {req.riskProfile} risk, "
                    f"{req.investmentHorizonYears} year horizon, goal: {req.goal}."
                ),
            }
        )
    return recs


@app.on_event("startup")
def startup_event():
    try:
        _train_pipeline()
        print("ML service started: model trained successfully.")
    except Exception as exc:
        print(f"ML startup failed: {exc}")


@app.get("/health")
def health():
    return {
        "ok": True,
        "model_loaded": MODEL is not None,
        "data_loaded": DF_SOURCE is not None,
    }


@app.post("/recommend")
def recommend(payload: RecommendRequest):
    if MODEL is None:
        raise HTTPException(status_code=500, detail="Model is not loaded. Check service logs.")
    try:
        recommendations = _to_recommendations(payload, top_k=10)
        return {"recommendations": recommendations}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {exc}") from exc


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)


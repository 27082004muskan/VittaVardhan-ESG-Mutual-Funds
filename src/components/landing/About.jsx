import image from "../../assets/esg.jpg";

const AboutUs = () => {
  return (
    <section className="bg-gray-800 text-gray-200 py-16 px-6 md:px-12 lg:px-24">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-green-400 mb-6">
            About Us 🌱💡
          </h2>
          <p className="text-base md:text-lg text-gray-400 mb-6">
            At <span className="text-green-400 font-semibold">GreenVest</span>
            , we believe that investing should not only generate financial
            returns but also contribute to a sustainable future. Our platform
            encourages individuals to invest at least 1% of their income in
            green mutual funds and ESG
          </p>
          <p className="text-base md:text-lg text-gray-400 mb-6">
            Green investing allows you to grow your wealth while promoting
            clean energy, ethical labor practices, and responsible governance.
            Unlike traditional investments, ESG funds focus on companies that
            are making a positive environmental and social impact.
          </p>
          <p className="text-base md:text-lg text-green-400 font-semibold">
            We aim to create a movement where every small contribution leads
            to a big impact. By investing in ESG funds, you are not just
            securing your financial future but also contributing to a
            healthier planet. Join GreenVest today and be a part of the
            change! 🌍
          </p>
        </div>

        {/* Right Side - Responsive Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg">
            <img
              src={image}
              alt="Sustainable Investment"
              className="w-full h-64 sm:h-72 md:h-80 lg:h-96 
                         object-cover object-center rounded-2xl shadow-2xl 
                         hover:shadow-green-500/20 transition-shadow duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;

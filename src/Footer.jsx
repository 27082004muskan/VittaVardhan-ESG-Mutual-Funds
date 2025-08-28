// import React from 'react'

// const Footer = () => {
//   return (
//     <footer className="bg-gray-800 py-12">
//     <div className="container mx-auto px-4">
//       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//         <div>
//           <h3 className="text-xl font-bold mb-4">About Us</h3>
//           <p className="text-gray-400">Making sustainable investing accessible and impactful for everyone.</p>
//         </div>
//         <div>
//           <h3 className="text-xl font-bold mb-4">Quick Links</h3>
//           <ul className="space-y-2 text-gray-400">
//             <li><a href="#" className="hover:text-green-500 transition">About</a></li>
//             <li><a href="#" className="hover:text-green-500 transition">Contact</a></li>
//             <li><a href="#" className="hover:text-green-500 transition">Privacy Policy</a></li>
//           </ul>
//         </div>
//         <div>
//           <h3 className="text-xl font-bold mb-4">Contact</h3>
//           <p className="text-gray-400">info@greeninvest.com</p>
//         </div>
//         <div>
//           <h3 className="text-xl font-bold mb-4">Follow Us</h3>
//           <div className="flex space-x-4">
//             <a href="#" className="text-gray-400 hover:text-green-500 transition">
//               <Twitter className="w-6 h-6" />
//             </a>
//             <a href="#" className="text-gray-400 hover:text-green-500 transition">
//               <Facebook className="w-6 h-6" />
//             </a>
//             <a href="#" className="text-gray-400 hover:text-green-500 transition">
//               <Instagram className="w-6 h-6" />
//             </a>
//             <a href="#" className="text-gray-400 hover:text-green-500 transition">
//               <LinkedinIcon className="w-6 h-6" />
//             </a>
//           </div>
//         </div>
//       </div>
//       <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
//         <p>&copy; 2025 Green Investment Platform. All rights reserved.</p>
//       </div>
//     </div>
//   </footer>
//   )
// }

// export default Footer
import React from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa6"; // Use fa6 for FontAwesome 6

const Footer = () => {
  return (
    <footer className="bg-gray-800 py-12 mx-auto items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About Us</h3>
            <p className="text-gray-400">
              Making sustainable investing accessible and impactful for everyone.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-500 transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Contact</h3>
            <p className="text-gray-400">info@greeninvest.com</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Green Investment Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

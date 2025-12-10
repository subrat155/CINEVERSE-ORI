import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-theme-footer pt-12 pb-8 border-t border-theme transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white">C</div>
               <span className="text-xl font-bold text-theme-main">CineVerse</span>
            </div>
            <p className="text-theme-secondary text-sm leading-relaxed">
              Experience movies like never before. The best seat in the house is just a click away.
            </p>
          </div>

          <div>
            <h3 className="text-theme-main font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-theme-secondary text-sm">
              <li className="hover:text-[#007BFF] cursor-pointer transition">About Us</li>
              <li className="hover:text-[#007BFF] cursor-pointer transition">Movies</li>
              <li className="hover:text-[#007BFF] cursor-pointer transition">My Bookings</li>
              <li className="hover:text-[#007BFF] cursor-pointer transition">Privacy Policy</li>
            </ul>
          </div>

          <div>
             <h3 className="text-theme-main font-semibold mb-4">Support</h3>
             <ul className="space-y-2 text-theme-secondary text-sm">
              <li className="hover:text-[#007BFF] cursor-pointer transition">Help Center</li>
              <li className="hover:text-[#007BFF] cursor-pointer transition">Terms of Service</li>
              <li className="hover:text-[#007BFF] cursor-pointer transition">Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="text-theme-main font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-theme-secondary text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>123 Cinema St, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>support@cineverse.com</span>
              </div>
              <div className="flex gap-4 mt-4">
                <Facebook className="hover:text-[#007BFF] cursor-pointer transition" size={20} />
                <Twitter className="hover:text-[#007BFF] cursor-pointer transition" size={20} />
                <Instagram className="hover:text-[#007BFF] cursor-pointer transition" size={20} />
              </div>
            </div>
          </div>

        </div>
         <div className="mt-12 pt-8 border-t border-theme text-center text-theme-secondary text-sm flex flex-col gap-2">
          <span>&copy; {new Date().getFullYear()} CineVerse. All rights reserved.</span>
          <span className="font-semibold opacity-70">Developed By GEC GRP</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
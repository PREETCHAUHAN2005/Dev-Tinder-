import React from "react";

const Footer = () => {
  return (
    <footer className="footer flex flex-col md:flex-row justify-between items-center py-6 px-8 bg-[#0b0c10] border-t border-slate-800/40 text-slate-400 text-sm mt-12 w-full">
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <span className="font-extrabold tracking-tight bg-tinder-gradient bg-clip-text text-transparent">
          🔥 DevTinder
        </span>
        <span>© {new Date().getFullYear()} - All rights reserved</span>
      </div>
      
      <div className="flex gap-6 items-center">
        <a href="#" className="hover:text-pink-500 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-pink-500 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-pink-500 transition-colors">Support</a>
      </div>

      <div className="flex gap-4">
        <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/40 hover:bg-tinder-gradient text-slate-300 hover:text-white transition-all duration-300 shadow-md">
          <svg className="fill-current w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </a>
        <a href="#" className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-800/40 hover:bg-tinder-gradient text-slate-300 hover:text-white transition-all duration-300 shadow-md">
          <svg className="fill-current w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 8c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm-3 9c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm11-1.5c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5zm-3-7.5c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z"/>
          </svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;

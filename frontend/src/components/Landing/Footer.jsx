import { Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Conv<span className="text-indigo-500">BI</span>
            </h2>
            <p className="text-slate-400 leading-relaxed">
              Empowering teams to make data-driven decisions through the power of AI and conversational intelligence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Github size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4">
              {['Home', 'Features', 'Pricing', 'About Us', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Resources</h3>
            <ul className="space-y-4">
              {['Documentation', 'API Reference', 'Case Studies', 'Blog', 'Support'].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-indigo-500 mt-1 shrink-0" />
                <span>123 Data Avenue, Insight City, <br />Tech State 54321</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-indigo-500 shrink-0" />
                <span>+1 (555) 000-1111</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-indigo-500 shrink-0" />
                <span>hello@convbi.ai</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} ConvBI Technologies. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



import { 
  FacebookIcon, 
  InstagramIcon, 
  TwitterIcon, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Truck, 
  RefreshCcw 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-300 border-t border-gray-800">
      {/* Top Features Section - eCom Highlight */}
      <div className="">
        <div className="max-w-7xl border-b border-gray-800 mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <Truck className="text-blue-500" size={24} />
            <h4 className="text-white font-medium">Free Shipping</h4>
            <p className="text-xs text-gray-500">Free Shipping on based on oder amount</p>
          </div>          
          <div className="flex flex-col items-center space-y-2">
            <RefreshCcw className="text-blue-500" size={24} />
            <h4 className="text-white font-medium">7 Days Return</h4>
            <p className="text-xs text-gray-500">Easy Return Policy</p>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <CreditCard className="text-blue-500" size={24} />
            <h4 className="text-white font-medium">Secure Payment</h4>
            <p className="text-xs text-gray-500">100% Secure Payment System</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & About */}
          <div className="space-y-6">
            <h2 className="text-white text-2xl font-bold tracking-tighter">
              UNITY<span className="text-blue-500">-SHOP</span>
            </h2>
            <p className="text-sm leading-relaxed text-gray-400">
              Your one-stop online shop for the latest trends in fashion, electronics, and home essentials. Experience seamless shopping with unbeatable prices and fast delivery.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-blue-600 transition-all text-white"><FacebookIcon size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-pink-600 transition-all text-white"><InstagramIcon size={18} /></a>
              <a href="#" className="p-2 bg-gray-900 rounded-full hover:bg-sky-500 transition-all text-white"><TwitterIcon size={18} /></a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-6">Categories</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Men`s Fashion</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Women`s Fashion</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Electronics</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Home & Gadgets</a></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white font-semibold mb-6">Customer Care</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6">Get In Touch</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin size={20} className="text-blue-500 shrink-0" />
                <span>Dhaka, Bangladesh -1207</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>+880 1234 567 890</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span>support@unityshop.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Payment Methods & Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-xs">
          <p>© {new Date().getFullYear()} <span className="text-white font-medium">Unity-Shop</span>. All rights reserved.</p>
          
          {/* Mock Payment Icons */}
          <div className="flex items-center space-x-4 grayscale opacity-70">
            <span className="text-gray-500">Payment Methods:</span>
            <div className="h-6 w-10 bg-white rounded-sm flex items-center justify-center text-[8px] text-black font-bold italic">VISA</div>
            <div className="h-6 w-10 bg-white rounded-sm flex items-center justify-center text-[8px] text-black font-bold italic">bkash</div>
            <div className="h-6 w-10 bg-white rounded-sm flex items-center justify-center text-[8px] text-black font-bold italic">NAGAD</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
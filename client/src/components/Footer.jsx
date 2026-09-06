import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiMapPin, FiPhone, FiMail } from 'react-icons/fi';
import Motif from './Motif';

export default function Footer() {
  return (
    <footer className="bg-forest text-ivory mt-24">
      <div className="container-content py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="col-span-1">
          <span className="font-display text-2xl tracking-widest">VIMASHO</span>
          <p className="text-ivory/60 text-sm mt-4 leading-relaxed max-w-xs">
            Tailored sherwanis, bandhgalas and festive menswear, crafted for the moments that matter.
          </p>
          <p className="flex items-start gap-2 text-ivory/70 text-sm mt-4">
            <FiMapPin className="mt-0.5 shrink-0 text-gold" />
            Gurugram, Sector 10 A
          </p>
          <div className="space-y-2 mt-4 text-sm text-ivory/70">
            <a href="tel:9211864168" className="flex items-center gap-2 hover:text-ivory">
              <FiPhone className="shrink-0 text-gold" /> 9211864168
            </a>
            <a href="mailto:vimasho@gmail.com" className="flex items-center gap-2 hover:text-ivory break-all">
              <FiMail className="shrink-0 text-gold" /> vimasho@gmail.com
            </a>
          </div>
          <div className="flex gap-4 mt-6 text-lg">
            <a href="https://instagram.com/vimasho01" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-gold transition-colors"><FiInstagram /></a>
            <a href="#" aria-label="Facebook" className="hover:text-gold transition-colors"><FiFacebook /></a>
            <a href="#" aria-label="Twitter" className="hover:text-gold transition-colors"><FiTwitter /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sm tracking-widest text-gold mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/products?parent=Wedding" className="hover:text-ivory">Wedding</Link></li>
            <li><Link to="/products?parent=Clothing" className="hover:text-ivory">Clothing</Link></li>
            <li><Link to="/products?parent=Accessories" className="hover:text-ivory">Accessories</Link></li>
            <li><Link to="/products?newArrival=true" className="hover:text-ivory">New Arrivals</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm tracking-widest text-gold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><Link to="/orders" className="hover:text-ivory">Track Orders</Link></li>
            <li><Link to="/account" className="hover:text-ivory">My Account</Link></li>
            <li><a href="#" className="hover:text-ivory">Size Guide</a></li>
            <li><a href="#" className="hover:text-ivory">Contact Us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm tracking-widest text-gold mb-4">Company</h4>
          <ul className="space-y-2 text-sm text-ivory/70">
            <li><a href="#" className="hover:text-ivory">Our Story</a></li>
            <li><a href="#" className="hover:text-ivory">Store Locator</a></li>
            <li><a href="#" className="hover:text-ivory">Terms of Service</a></li>
            <li><a href="#" className="hover:text-ivory">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="sm:col-span-2 lg:col-span-1">
          <h4 className="text-sm tracking-widest text-gold mb-4">Find Us</h4>
          <div className="overflow-hidden border border-ivory/10 h-40">
            <iframe
              title="VIMASHO location"
              src="https://www.google.com/maps?q=Gurugram+Sector+10A&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Gurugram+Sector+10A"
            target="_blank"
            rel="noreferrer"
            className="inline-block text-xs text-ivory/60 mt-2 hover:text-ivory"
          >
            Open in Google Maps
          </a>
        </div>
      </div>

      <div className="border-t border-ivory/10 py-6">
        <div className="container-content flex flex-col md:flex-row items-center justify-between gap-3">
          <Motif />
          <p className="text-xs text-ivory/50 tracking-wide">© {new Date().getFullYear()} VIMASHO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

import { FaFacebook, FaInstagram, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer id="contact" className="py-16 bg-[#111111] text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <img 
              src="/logo-small.webp" 
              alt="Adèle Délice Logo" 
              className="w-32 mb-6"
            />
            <p className="text-gray-300 mb-4">
              "Mangez comme si vous êtes à la maison."
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaFacebook />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaInstagram />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                <FaWhatsapp />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt />
                <span>123 Rue des Délices, Dakar, Sénégal</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone />
                <a href="tel:+22112345678" className="hover:text-white transition-colors">+221 12 345 6789</a>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope />
                <a href="mailto:contact@adeledelice.com" className="hover:text-white transition-colors">contact@adeledelice.com</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6">Horaires</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <FaClock />
                <span>Lundi - Vendredi: 11h00 - 22h00</span>
              </li>
              <li className="flex items-center gap-3">
                <FaClock />
                <span>Samedi: 10h00 - 23h00</span>
              </li>
              <li className="flex items-center gap-3">
                <FaClock />
                <span>Dimanche: 10h00 - 21h00</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Adèle Délice. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
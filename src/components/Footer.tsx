import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-gray-900 mb-4">quarterends</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Timeless pieces, thoughtfully curated.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3">
              <li><Link to="/shop?category=women" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Women</Link></li>
              <li><Link to="/shop?category=men" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Men</Link></li>
              <li><Link to="/shop?category=accessories" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Accessories</Link></li>
              <li><Link to="/shop?category=new" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">Help</h4>
            <ul className="space-y-3">
              <li><Link to="/contact" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Contact</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Shipping</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">FAQ</Link></li>
              <li><Link to="/size-guide" className="text-sm text-gray-400 hover:text-gray-900 transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-4">Updates on new arrivals and exclusives.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
              />
              <button className="px-4 py-2 bg-gray-900 text-white text-sm rounded-r-md hover:bg-gray-800 transition-colors">
                →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-300">© 2026 quarterends. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-gray-300 hover:text-gray-900 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-xs text-gray-300 hover:text-gray-900 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

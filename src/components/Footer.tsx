import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from './3d/ScrollReveal'
import Marquee from './3d/Marquee'
import MagneticButton from './3d/MagneticButton'

const footerLinks = {
  shop: [
    { label: 'Women', to: '/shop?category=women' },
    { label: 'Men', to: '/shop?category=men' },
    { label: 'Accessories', to: '/shop?category=accessories' },
    { label: 'New Arrivals', to: '/shop?category=new' },
  ],
  help: [
    { label: 'Contact', to: '/contact' },
    { label: 'Shipping', to: '/shipping' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Size Guide', to: '/size-guide' },
  ],
}

const linkVariants = {
  rest: { x: 0 },
  hover: { x: 4 },
}

const columnVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="border-t border-gray-100 mt-24 bg-white">
      {/* Top marquee */}
      <div className="py-4 border-b border-gray-100">
        <Marquee
          text="QUARTERENDS · TIMELESS FASHION · CURATED WITH CARE · LESS IS MORE"
          speed={40}
          className="text-xs font-medium tracking-widest text-gray-300 uppercase"
        />
      </div>

      {/* Main footer content */}
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand */}
            <motion.div
              custom={0}
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-sm font-semibold tracking-tight text-gray-900 mb-4">
                quarterends
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Timeless pieces, thoughtfully curated.
              </p>
            </motion.div>

            {/* Shop */}
            <motion.div
              custom={1}
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">
                Shop
              </h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.to}>
                    <motion.div
                      variants={linkVariants}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Help */}
            <motion.div
              custom={2}
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">
                Help
              </h4>
              <ul className="space-y-3">
                {footerLinks.help.map((link) => (
                  <li key={link.to}>
                    <motion.div
                      variants={linkVariants}
                      initial="rest"
                      whileHover="hover"
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <Link
                        to={link.to}
                        className="text-sm text-gray-400 hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              custom={3}
              variants={columnVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h4 className="text-xs font-medium text-gray-900 uppercase tracking-wider mb-4">
                Newsletter
              </h4>
              <p className="text-sm text-gray-400 mb-4">
                Updates on new arrivals and exclusives.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email address"
                  className="flex-1 text-sm px-3 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-gray-900 transition-colors bg-transparent"
                />
                <MagneticButton
                  className="px-4 py-2 bg-gray-900 text-white text-sm rounded-r-md hover:bg-gray-800 transition-colors"
                >
                  →
                </MagneticButton>
              </div>
            </motion.div>
          </div>

          {/* Bottom bar */}
          <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-300">
              © 2026 quarterends. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="text-xs text-gray-300 hover:text-gray-900 transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="text-xs text-gray-300 hover:text-gray-900 transition-colors"
              >
                Terms
              </Link>

              <motion.button
                onClick={scrollToTop}
                className="text-xs text-gray-300 hover:text-gray-900 transition-colors flex items-center gap-1"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
                transition={{ duration: 0.2 }}
              >
                Back to top
                <span aria-hidden="true">↑</span>
              </motion.button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </footer>
  )
}

export default Footer

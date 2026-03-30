import { motion } from 'framer-motion'
import AnimatedText from '../components/3d/AnimatedText'
import ScrollReveal from '../components/3d/ScrollReveal'
import MagneticButton from '../components/3d/MagneticButton'

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const Contact = () => {
  return (
    <div className="pt-24 max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <AnimatedText
          text="Contact"
          as="h1"
          className="text-2xl font-medium tracking-tight text-gray-900"
        />
        <motion.p
          className="mt-1 text-sm text-gray-400"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          We'd love to hear from you
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <ScrollReveal direction="left">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Send a message</p>
            <motion.form
              className="space-y-4"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp}>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
                <motion.input
                  type="text"
                  className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors"
                  whileFocus={{ scale: 1.01, borderColor: '#111' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
                <motion.input
                  type="email"
                  className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors"
                  whileFocus={{ scale: 1.01, borderColor: '#111' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
                <motion.input
                  type="text"
                  className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors"
                  whileFocus={{ scale: 1.01, borderColor: '#111' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
                <motion.textarea
                  rows={5}
                  className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors resize-none"
                  whileFocus={{ scale: 1.01, borderColor: '#111' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <MagneticButton className="w-full bg-gray-900 text-white py-2.5 text-sm hover:bg-gray-800 transition-colors">
                  Send Message
                </MagneticButton>
              </motion.div>
            </motion.form>
          </div>
        </ScrollReveal>

        {/* Contact Info */}
        <ScrollReveal direction="right">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Get in touch</p>

            <motion.div
              className="space-y-6"
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={fadeUp}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                <p className="text-sm text-gray-600">support@quarterends.com</p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Address</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  123 Fashion Avenue<br />
                  New York, NY 10001<br />
                  United States
                </p>
              </motion.div>

              <motion.div variants={fadeUp}>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Hours</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Mon – Fri: 9:00 AM – 6:00 PM EST<br />
                  Sat: 10:00 AM – 4:00 PM EST<br />
                  Sun: Closed
                </p>
              </motion.div>

              <motion.div variants={fadeUp} className="border-t border-gray-100 pt-6">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Follow</p>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                    <motion.a
                      key={social}
                      href="#"
                      className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                      whileHover={{ x: 4 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      {social}
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

export default Contact

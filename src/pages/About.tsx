import { motion } from 'framer-motion'
import AnimatedText from '../components/3d/AnimatedText'
import ScrollReveal from '../components/3d/ScrollReveal'
import GradientBlob from '../components/3d/GradientBlob'
import Counter from '../components/3d/Counter'

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

const About = () => {
  return (
    <div className="bg-white pt-24 overflow-hidden">
      {/* Hero */}
      <section className="relative max-w-2xl mx-auto px-6 py-16 text-center">
        <GradientBlob className="-top-40 left-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <AnimatedText
            text="About Quarterends"
            as="h1"
            className="text-3xl font-medium tracking-tight text-gray-900"
          />
          <motion.p
            className="mt-3 text-sm text-gray-400"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Timeless fashion, thoughtfully curated
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <motion.div
        className="border-t border-gray-100"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Story */}
      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-16">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Our Story</p>
          <motion.div
            className="space-y-4 text-sm text-gray-500 leading-relaxed"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.p variants={fadeUp}>
              Founded in 2020, Quarterends emerged from a simple belief: that luxury fashion
              should be timeless, sustainable, and accessible to those who appreciate quality craftsmanship.
            </motion.p>
            <motion.p variants={fadeUp}>
              We carefully curate each piece in our collection, working directly with artisans
              and manufacturers who share our commitment to excellence. From the finest cashmere
              to ethically sourced materials, every garment tells a story of dedication and skill.
            </motion.p>
            <motion.p variants={fadeUp}>
              Our name, "Quarterends," reflects our philosophy of celebrating life's moments—the
              changing seasons, personal milestones, and the everyday occasions that deserve to
              be marked with style and grace.
            </motion.p>
          </motion.div>
        </section>
      </ScrollReveal>

      {/* Divider */}
      <motion.div
        className="border-t border-gray-100"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: 'right' }}
      />

      {/* Stats Bar */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: 2020, label: 'Founded', prefix: '' },
            { value: 50, label: 'Happy Customers', suffix: 'K+' },
            { value: 15, label: 'Countries', suffix: '+' },
            { value: 100, label: 'Sustainable', suffix: '%' },
          ].map((stat) => (
            <div key={stat.label}>
              <Counter
                value={stat.value}
                suffix={stat.suffix ?? ''}
                prefix={stat.prefix ?? ''}
                className="text-2xl font-medium text-gray-900"
              />
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <motion.div
        className="border-t border-gray-100"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: 'left' }}
      />

      {/* Values */}
      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-16">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">Our Values</p>

          <motion.div
            className="grid md:grid-cols-3 gap-10"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[
              {
                title: 'Quality',
                desc: 'We never compromise on materials or craftsmanship. Every piece is made to last.',
              },
              {
                title: 'Sustainability',
                desc: 'We prioritize eco-friendly materials and ethical production practices.',
              },
              {
                title: 'Timelessness',
                desc: 'Our designs transcend trends, offering elegance that endures season after season.',
              },
            ].map((value) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <h3 className="text-sm font-medium text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </ScrollReveal>

      {/* Divider */}
      <motion.div
        className="border-t border-gray-100"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ transformOrigin: 'right' }}
      />

      {/* Team */}
      <ScrollReveal>
        <section className="max-w-2xl mx-auto px-6 py-16">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">Our Team</p>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {[1, 2, 3, 4].map((member) => (
              <motion.div key={member} className="text-center" variants={fadeUp}>
                <motion.div
                  className="w-16 h-16 bg-gray-100 rounded-full mb-3 mx-auto"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                />
                <p className="text-sm font-medium text-gray-900">Team Member {member}</p>
                <p className="text-xs text-gray-400 mt-0.5">Position</p>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </ScrollReveal>
    </div>
  )
}

export default About

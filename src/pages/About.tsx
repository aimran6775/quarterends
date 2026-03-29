const About = () => {
  return (
    <div className="bg-white pt-24">
      {/* Hero */}
      <section className="max-w-2xl mx-auto px-6 py-16 text-center">
        <h1 className="text-3xl font-medium tracking-tight text-gray-900">
          About Quarterends
        </h1>
        <p className="mt-3 text-sm text-gray-400">
          Timeless fashion, thoughtfully curated
        </p>
      </section>

      <div className="border-t border-gray-100" />

      {/* Story */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">Our Story</p>
        <div className="space-y-4 text-sm text-gray-500 leading-relaxed">
          <p>
            Founded in 2020, Quarterends emerged from a simple belief: that luxury fashion 
            should be timeless, sustainable, and accessible to those who appreciate quality craftsmanship.
          </p>
          <p>
            We carefully curate each piece in our collection, working directly with artisans 
            and manufacturers who share our commitment to excellence. From the finest cashmere 
            to ethically sourced materials, every garment tells a story of dedication and skill.
          </p>
          <p>
            Our name, "Quarterends," reflects our philosophy of celebrating life's moments—the 
            changing seasons, personal milestones, and the everyday occasions that deserve to 
            be marked with style and grace.
          </p>
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Values */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">Our Values</p>
        
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: 'Quality',
              desc: 'We never compromise on materials or craftsmanship. Every piece is made to last.'
            },
            {
              title: 'Sustainability',
              desc: 'We prioritize eco-friendly materials and ethical production practices.'
            },
            {
              title: 'Timelessness',
              desc: 'Our designs transcend trends, offering elegance that endures season after season.'
            }
          ].map((value) => (
            <div key={value.title}>
              <h3 className="text-sm font-medium text-gray-900 mb-2">{value.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100" />

      {/* Team */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-8">Our Team</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((member) => (
            <div key={member} className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full mb-3 mx-auto" />
              <p className="text-sm font-medium text-gray-900">Team Member {member}</p>
              <p className="text-xs text-gray-400 mt-0.5">Position</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About

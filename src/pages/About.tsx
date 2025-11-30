const About = () => {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-96 flex items-center justify-center">
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
          <p className="text-gray-400 text-sm">[About Hero Image: Studio or lifestyle shot]</p>
        </div>
        <h1 className="relative z-10 text-5xl md:text-6xl font-serif font-bold text-gray-900">
          About Quarterends
        </h1>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Our Story</h2>
        <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
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

      {/* Values */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
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
              <div key={value.title} className="bg-white rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-gray-700">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-12">Meet Our Team</h2>
        
        <div className="grid md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((member) => (
            <div key={member} className="text-center">
              <div className="aspect-square bg-gray-200 rounded-full mb-4 flex items-center justify-center mx-auto">
                <p className="text-gray-400 text-xs">[Team {member}]</p>
              </div>
              <h3 className="font-semibold text-lg mb-1">Team Member {member}</h3>
              <p className="text-gray-600 text-sm">Position</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default About

const Contact = () => {
  return (
    <div className="pt-24 max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-2xl font-medium tracking-tight text-gray-900">Contact</h1>
        <p className="mt-1 text-sm text-gray-400">We'd love to hear from you</p>
      </div>

      <div className="grid md:grid-cols-2 gap-16">
        {/* Contact Form */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Send a message</p>
          <form className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Name</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <input 
                type="email" 
                className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Subject</label>
              <input 
                type="text" 
                className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors" 
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-1.5">Message</label>
              <textarea 
                rows={5}
                className="w-full border border-gray-200 px-3 py-2.5 focus:border-gray-900 focus:outline-none text-sm transition-colors resize-none"
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white py-2.5 text-sm hover:bg-gray-800 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-6">Get in touch</p>
          
          <div className="space-y-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
              <p className="text-sm text-gray-600">support@quarterends.com</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Address</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                123 Fashion Avenue<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Hours</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Mon – Fri: 9:00 AM – 6:00 PM EST<br />
                Sat: 10:00 AM – 4:00 PM EST<br />
                Sun: Closed
              </p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Follow</p>
              <div className="flex gap-4">
                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Facebook</a>
                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Instagram</a>
                <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact

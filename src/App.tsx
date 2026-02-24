import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Phone, ArrowRight, Star, Shield, CheckCircle, MapPin, Menu, X, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

// --- Components ---

function Header({ onOpenQuote }: { onOpenQuote: () => void }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-serif italic">L</div>
          <span className="font-display font-bold text-xl tracking-tight">LUMINA</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#services" className="text-sm font-medium hover:text-accent transition-colors">Services</a>
          <a href="#pricing" className="text-sm font-medium hover:text-accent transition-colors">Pricing</a>
          <a href="#reviews" className="text-sm font-medium hover:text-accent transition-colors">Reviews</a>
          <a href="#areas" className="text-sm font-medium hover:text-accent transition-colors">Areas</a>
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <a href="tel:+15551234567" className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
            <Phone className="w-4 h-4" />
            <span>(555) 123-4567</span>
          </a>
          <button 
            onClick={onOpenQuote}
            className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Get a Free Quote
          </button>
        </div>

        <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 right-0 bg-white border-b border-black/5 p-6 md:hidden flex flex-col gap-4 shadow-xl"
          >
            <a href="#services" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Services</a>
            <a href="#pricing" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</a>
            <a href="#reviews" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Reviews</a>
            <a href="#areas" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Areas</a>
            <div className="h-px bg-black/5 my-2" />
            <a href="tel:+15551234567" className="flex items-center gap-2 text-lg font-medium">
              <Phone className="w-5 h-5" /> (555) 123-4567
            </a>
            <button 
              onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
              className="bg-black text-white w-full py-3 rounded-full text-lg font-medium"
            >
              Get a Free Quote
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ onOpenQuote }: { onOpenQuote: () => void }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop" 
          alt="Gleaming modern office space" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide mb-6">
            PREMIUM COMMERCIAL CLEANING
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 text-balance">
            Elevating Standards <br/> for Modern Workspaces
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            We serve elite offices, medical facilities, and luxury retail spaces in the greater metro area. Experience the difference of a team that takes pride in perfection.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onOpenQuote}
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              Get a Free Quote
            </button>
            <a href="tel:+15551234567" className="px-8 py-4 rounded-full text-lg font-medium text-white border border-white/30 hover:bg-white/10 transition-colors backdrop-blur-sm w-full sm:w-auto flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> (555) 123-4567
            </a>
          </div>
        </motion.div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20">
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/50"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadges() {
  return (
    <section className="py-12 border-b border-black/5 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2 font-semibold text-lg"><Shield className="w-6 h-6" /> Fully Insured</div>
          <div className="flex items-center gap-2 font-semibold text-lg"><CheckCircle className="w-6 h-6" /> OSHA Certified</div>
          <div className="flex items-center gap-2 font-semibold text-lg"><Star className="w-6 h-6" /> Top Rated 2025</div>
          <div className="flex items-center gap-2 font-semibold text-lg"><Shield className="w-6 h-6" /> Bonded</div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Corporate Offices",
      description: "Daily janitorial services tailored for high-traffic professional environments.",
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Medical Facilities",
      description: "Hospital-grade sanitation protocols for clinics, dental offices, and labs.",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop"
    },
    {
      title: "Luxury Retail",
      description: "Immaculate presentation for showrooms and boutiques where detail matters.",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">Meticulous Service.<br/>Unmatched Quality.</h2>
            <p className="text-gray-600 text-lg">We don't just clean; we curate environments that inspire productivity and confidence.</p>
          </div>
          <a href="#" className="group flex items-center gap-2 font-medium text-lg hover:text-accent transition-colors">
            View all services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group cursor-pointer"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 relative">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10" />
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2 group-hover:text-accent transition-colors">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ onOpenQuote }: { onOpenQuote: () => void }) {
  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">Transparent Pricing</h2>
          <p className="text-gray-600 text-lg">No hidden fees. No surprises. Just exceptional value for premium service.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { name: "Essential", price: "Custom", desc: "Perfect for small offices needing weekly maintenance.", features: ["Weekly Cleaning", "Trash Removal", "Restroom Sanitation", "Vacuuming & Mopping"] },
            { name: "Professional", price: "Custom", desc: "Our most popular plan for daily business operations.", features: ["Daily Cleaning", "Kitchen/Breakroom Detail", "High-Dusting", "Supply Restocking", "Window Spot Cleaning"], highlight: true },
            { name: "Executive", price: "Custom", desc: "Comprehensive care for high-end facilities.", features: ["Day Porter Services", "Deep Carpet Cleaning", "Floor Waxing/Buffing", "Upholstery Cleaning", "24/7 Emergency Response"] }
          ].map((plan, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-8 rounded-3xl border ${plan.highlight ? 'bg-black text-white border-black shadow-xl' : 'bg-white border-black/5'} flex flex-col`}
            >
              <div className="mb-8">
                <h3 className="font-display font-bold text-2xl mb-2">{plan.name}</h3>
                <p className={plan.highlight ? 'text-gray-400' : 'text-gray-500'}>{plan.desc}</p>
              </div>
              <div className="mb-8 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.highlight ? 'text-accent' : 'text-black'}`} />
                      <span className={plan.highlight ? 'text-gray-200' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button 
                onClick={onOpenQuote}
                className={`w-full py-4 rounded-full font-medium transition-colors ${plan.highlight ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-zinc-800'}`}
              >
                Request Quote
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-1 text-accent">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
          </div>
          <span className="text-2xl font-display font-bold">4.9/5 Average Rating</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: "Sarah Jenkins", role: "Office Manager, TechFlow", text: "Lumina transformed our workspace. The team is incredibly professional, punctual, and the attention to detail is unlike any other service we've used." },
            { name: "Michael Ross", role: "Director, Ross Medical Group", text: "In a medical setting, cleanliness is non-negotiable. Lumina consistently exceeds our strict sanitation standards. Highly recommended." },
            { name: "Elena Rodriguez", role: "Owner, Luxe Boutique", text: "Our showroom floors have never looked better. Clients constantly compliment the cleanliness of our store. It's a game changer for our brand image." }
          ].map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-surface p-8 rounded-2xl"
            >
              <div className="flex gap-1 text-accent mb-4">
                {[1,2,3,4,5].map(j => <Star key={j} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-lg leading-relaxed mb-6 font-medium">"{review.text}"</p>
              <div>
                <div className="font-bold">{review.name}</div>
                <div className="text-sm text-gray-500">{review.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Areas() {
  const areas = [
    "Downtown Metro", "North Hills", "Westside Business District", 
    "Tech Park", "Harbor Front", "South Bay", "Eastside Industrial", "Uptown"
  ];

  return (
    <section id="areas" className="py-24 bg-black text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">Serving the Greater Metro Area</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">
              Our teams are strategically positioned to provide rapid response and reliable daily service across the entire region.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {areas.map((area, i) => (
                <a key={i} href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="group-hover:translate-x-1 transition-transform">{area}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full h-[400px] bg-zinc-900 rounded-2xl flex items-center justify-center border border-white/10">
            <div className="text-center p-8">
              <MapPin className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Interactive Map</h3>
              <p className="text-gray-500">Map integration would load here.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
        
        <h2 className="font-display font-bold text-3xl mb-2">Get a Free Quote</h2>
        <p className="text-gray-500 mb-8">Tell us about your space and cleaning needs.</p>
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! We will contact you shortly."); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">First Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors" placeholder="Jane" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors" placeholder="Doe" required />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Work Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors" placeholder="jane@company.com" required />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Company Name</label>
            <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors" placeholder="Acme Corp" />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Service Needed</label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors bg-white">
              <option>Daily Janitorial</option>
              <option>Deep Cleaning</option>
              <option>Floor Care</option>
              <option>Post-Construction</option>
            </select>
          </div>
          
          <button type="submit" className="w-full bg-black text-white font-bold text-lg py-4 rounded-xl hover:bg-zinc-800 transition-colors mt-4">
            Submit Request
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black font-serif italic">L</div>
              <span className="font-display font-bold text-xl tracking-tight">LUMINA</span>
            </div>
            <p className="text-gray-400 max-w-md mb-8">
              Setting the gold standard for commercial cleaning. We bring clarity, hygiene, and professionalism to your business environment.
            </p>
            <div className="flex gap-4">
              {/* Social placeholders */}
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">IG</div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">LI</div>
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">FB</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing Plans</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Client Reviews</a></li>
              <li><a href="#areas" className="hover:text-white transition-colors">Service Areas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>123 Commerce Blvd, Suite 400<br/>Metro City, ST 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center">@</div>
                <span>hello@luminacleaning.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>&copy; 2026 Lumina Commercial Cleaning. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);

  return (
    <div className="font-sans text-primary bg-white selection:bg-black selection:text-white scroll-smooth">
      <Header onOpenQuote={() => setIsQuoteOpen(true)} />
      <main>
        <Hero onOpenQuote={() => setIsQuoteOpen(true)} />
        <TrustBadges />
        <Services />
        <Pricing onOpenQuote={() => setIsQuoteOpen(true)} />
        <Reviews />
        <Areas />
      </main>
      <Footer />
      
      <AnimatePresence>
        {isQuoteOpen && <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

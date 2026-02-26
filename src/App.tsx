import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Phone, ArrowRight, Star, Shield, CheckCircle, MapPin, Menu, X, ChevronRight, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import config from './configs';
import type { CompanyConfig } from './company_config';

// ============================================================
// WHITELABEL TEMPLATE — All values driven by company_config
// Zero hardcoded brand data below this line
// ============================================================

// --- HEADER ---
function Header({ onOpenQuote, cfg }: { onOpenQuote: () => void; cfg: CompanyConfig }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm">Skip to main content</a>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5 transition-all duration-300" role="banner">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2" aria-label={`${cfg.identity.companyNameFull} - Home`}>
            {cfg.identity.logoUrl ? (
              <img src={cfg.identity.logoUrl} alt={cfg.identity.companyNameFull} className="h-12 w-auto" />
            ) : (
              <>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-serif italic" style={{ backgroundColor: 'var(--color-primary)' }} aria-hidden="true">{cfg.identity.logoInitial}</div>
                <span className="font-display font-bold text-xl tracking-tight">{cfg.identity.companyName}</span>
              </>
            )}
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <a href="#services" className="text-sm font-medium hover:text-accent transition-colors">Services</a>
            <a href="#pricing" className="text-sm font-medium hover:text-accent transition-colors">Pricing</a>
            <a href="#reviews" className="text-sm font-medium hover:text-accent transition-colors">Reviews</a>
            <a href="#areas" className="text-sm font-medium hover:text-accent transition-colors">Areas</a>
          </nav>

          <div className="hidden md:flex items-center gap-6">
            <a href={`tel:${cfg.contact.phoneTel}`} className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity">
              <Phone className="w-4 h-4" />
              <span>{cfg.contact.phone}</span>
            </a>
            <button
              onClick={onOpenQuote}
              className="bg-[var(--color-primary)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {cfg.hero.ctaPrimary}
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-white border-b border-black/5 p-6 md:hidden flex flex-col gap-4 shadow-xl"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <a href="#services" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#pricing" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Pricing</a>
              <a href="#reviews" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Reviews</a>
              <a href="#areas" className="text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Areas</a>
              <div className="h-px bg-black/5 my-2" />
              <a href={`tel:${cfg.contact.phoneTel}`} className="flex items-center gap-2 text-lg font-medium">
                <Phone className="w-5 h-5" /> {cfg.contact.phone}
              </a>
              <button
                onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
                className="bg-[var(--color-primary)] text-white w-full py-3 rounded-full text-lg font-medium"
              >
                {cfg.hero.ctaPrimary}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

// --- HERO ---
function Hero({ onOpenQuote, cfg }: { onOpenQuote: () => void; cfg: CompanyConfig }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Split tagline on \n for line breaks
  const taglineParts = cfg.identity.tagline.split('\n');

  return (
    <section ref={ref} className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden" aria-label="Hero">
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/30 z-10" aria-hidden="true" />
        <img
          src={cfg.hero.backgroundImage}
          alt={cfg.hero.backgroundAlt}
          className="w-full h-full object-cover"
          loading="eager"
        />
      </motion.div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide mb-6">
            {cfg.identity.badgeText}
          </span>
          <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 text-balance">
            {taglineParts.map((part, i) => (
              <span key={i}>{part}{i < taglineParts.length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            {cfg.identity.subTagline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenQuote}
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-100 transition-colors w-full sm:w-auto"
            >
              {cfg.hero.ctaPrimary}
            </button>
            <a href={`tel:${cfg.contact.phoneTel}`} className="px-8 py-4 rounded-full text-lg font-medium text-white border border-white/30 hover:bg-white/10 transition-colors backdrop-blur-sm w-full sm:w-auto flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" /> {cfg.contact.phone}
            </a>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 flex justify-center z-20" aria-hidden="true">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/50 motion-reduce:animate-none"
        >
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}

// --- TRUST BADGES ---
function TrustBadges({ cfg }: { cfg: CompanyConfig }) {
  const icons = [Shield, CheckCircle, Star, Shield];
  return (
    <section className="py-12 border-b border-black/5 bg-surface" aria-label="Trust credentials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 hover:opacity-100 transition-all duration-500 text-gray-700">
          {cfg.trustBadges.map((badge, i) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="flex items-center gap-2 font-semibold text-lg">
                <Icon className="w-6 h-6" aria-hidden="true" /> {badge}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- SERVICES ---
function Services({ cfg }: { cfg: CompanyConfig }) {
  const titleParts = cfg.services.sectionTitle.split('\n');

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-gray-900">
              {titleParts.map((part, i) => (
                <span key={i}>{part}{i < titleParts.length - 1 && <br />}</span>
              ))}
            </h2>
            <p className="text-gray-600 text-lg">{cfg.services.sectionSubtitle}</p>
          </div>
          <a href="#" className="group flex items-center gap-2 font-medium text-lg hover:text-accent transition-colors">
            View all services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cfg.services.items.map((service, index) => (
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
                  alt={service.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display font-bold text-2xl mb-2 text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- PRICING ---
function Pricing({ onOpenQuote, cfg }: { onOpenQuote: () => void; cfg: CompanyConfig }) {
  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 text-gray-900">{cfg.pricing.sectionTitle}</h2>
          <p className="text-gray-600 text-lg">{cfg.pricing.sectionSubtitle}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {cfg.pricing.plans.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`p-8 rounded-3xl border ${plan.highlight ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-xl' : 'bg-white border-black/5'} flex flex-col`}
            >
              <div className="mb-8">
                <h3 className="font-display font-bold text-2xl mb-2">{plan.name}</h3>
                <p className={plan.highlight ? 'text-white/80' : 'text-gray-500'}>{plan.description}</p>
              </div>
              <div className="mb-8 flex-1">
                <ul className="space-y-4">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <CheckCircle className={`w-5 h-5 ${plan.highlight ? 'text-white/70' : 'text-[var(--color-primary)]'}`} />
                      <span className={plan.highlight ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={onOpenQuote}
                className={`w-full py-4 rounded-full font-medium transition-colors ${plan.highlight ? 'bg-white text-[var(--color-primary)] hover:bg-gray-100' : 'bg-[var(--color-primary)] text-white hover:opacity-90'}`}
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

// --- REVIEWS (handles arbitrary number via .map) ---
function Reviews({ cfg }: { cfg: CompanyConfig }) {
  return (
    <section id="reviews" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="flex items-center gap-1 text-accent">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 fill-current" />)}
          </div>
          <span className="text-2xl font-display font-bold text-gray-900">{cfg.reviews.averageRating} Average Rating</span>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cfg.reviews.items.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-surface p-8 rounded-2xl"
            >
              <div className="flex gap-1 text-accent mb-4">
                {Array.from({ length: review.rating }, (_, j) => (
                  <Star key={j} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-lg leading-relaxed mb-6 font-medium text-gray-700">"{review.text}"</p>
              <div>
                <div className="font-bold text-gray-900">{review.name}</div>
                <div className="text-sm text-gray-500">{review.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- SERVICE AREAS ---
function Areas({ cfg }: { cfg: CompanyConfig }) {
  return (
    <section id="areas" className="py-24 bg-[var(--color-primary)] text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <h2 className="font-display font-bold text-4xl md:text-5xl mb-6">{cfg.areas.sectionTitle}</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl">{cfg.areas.sectionSubtitle}</p>
            <div className="grid grid-cols-2 gap-4">
              {cfg.areas.locations.map((area, i) => (
                <a key={i} href="#" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors group">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="group-hover:translate-x-1 transition-transform">{area}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full h-[400px] bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
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

// --- QUOTE MODAL ---
function QuoteModal({ isOpen, onClose, cfg }: { isOpen: boolean; onClose: () => void; cfg: CompanyConfig }) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    setTimeout(() => modalRef.current?.focus(), 100);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4" role="dialog" aria-modal="true" aria-labelledby="quote-modal-title">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl outline-none"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close quote form">
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        <h2 id="quote-modal-title" className="font-display font-bold text-3xl mb-2">{cfg.hero.ctaPrimary}</h2>
        <p className="text-gray-500 mb-8">Tell us about your space and cleaning needs.</p>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thank you! We will contact you shortly."); onClose(); }}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="quote-first-name" className="text-sm font-medium text-gray-700">First Name</label>
              <input id="quote-first-name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-colors" placeholder="Jane" required autoComplete="given-name" />
            </div>
            <div className="space-y-1">
              <label htmlFor="quote-last-name" className="text-sm font-medium text-gray-700">Last Name</label>
              <input id="quote-last-name" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-colors" placeholder="Doe" required autoComplete="family-name" />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="quote-email" className="text-sm font-medium text-gray-700">Work Email</label>
            <input id="quote-email" type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-colors" placeholder="jane@company.com" required autoComplete="email" />
          </div>

          <div className="space-y-1">
            <label htmlFor="quote-company" className="text-sm font-medium text-gray-700">Company Name</label>
            <input id="quote-company" type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-colors" placeholder="Acme Corp" autoComplete="organization" />
          </div>

          <div className="space-y-1">
            <label htmlFor="quote-service" className="text-sm font-medium text-gray-700">Service Needed</label>
            <select id="quote-service" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-0 outline-none transition-colors bg-white">
              {cfg.services.items.map((s, i) => (
                <option key={i}>{s.title}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-[var(--color-primary)] text-white font-bold text-lg py-4 rounded-xl hover:opacity-90 transition-opacity mt-4">
            Submit Request
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// --- FOOTER ---
function Footer({ cfg }: { cfg: CompanyConfig }) {
  return (
    <footer className="bg-[var(--color-primary)] text-white pt-24 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              {cfg.identity.logoUrl ? (
                <img src={cfg.identity.logoUrl} alt={cfg.identity.companyNameFull} className="h-10 w-auto brightness-0 invert" />
              ) : (
                <>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-[var(--color-primary)] font-serif italic">{cfg.identity.logoInitial}</div>
                  <span className="font-display font-bold text-xl tracking-tight">{cfg.identity.companyName}</span>
                </>
              )}
            </div>
            <p className="text-gray-400 max-w-md mb-8">{cfg.footer.description}</p>
            <div className="flex gap-4" role="list" aria-label="Social media links">
              {cfg.contact.socialMedia.instagram && (
                <a href={cfg.contact.socialMedia.instagram} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Follow us on Instagram" role="listitem"><span aria-hidden="true">IG</span></a>
              )}
              {cfg.contact.socialMedia.linkedin && (
                <a href={cfg.contact.socialMedia.linkedin} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Connect on LinkedIn" role="listitem"><span aria-hidden="true">LI</span></a>
              )}
              {cfg.contact.socialMedia.facebook && (
                <a href={cfg.contact.socialMedia.facebook} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" aria-label="Like us on Facebook" role="listitem"><span aria-hidden="true">FB</span></a>
              )}
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
                <span>{cfg.contact.address}<br />{cfg.contact.addressLine2}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 shrink-0" />
                <a href={`tel:${cfg.contact.phoneTel}`} className="hover:text-white transition-colors">{cfg.contact.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 shrink-0" />
                <a href={`mailto:${cfg.contact.email}`} className="hover:text-white transition-colors">{cfg.contact.email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <div>{cfg.footer.copyright}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// THEME INJECTION — CSS Variables from config
// ============================================================
function ThemeInjector({ cfg }: { cfg: CompanyConfig }) {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', cfg.styling.primaryColor);
    root.style.setProperty('--color-accent', cfg.styling.accentColor);
    root.style.setProperty('--color-surface', cfg.styling.surfaceColor);
    root.style.setProperty('--font-sans', cfg.styling.fontSans);
    root.style.setProperty('--font-serif', cfg.styling.fontSerif);
    root.style.setProperty('--font-display', cfg.styling.fontDisplay);

    // Dynamically load Google Fonts for this config
    const fontLinkId = 'dynamic-google-fonts';
    let existing = document.getElementById(fontLinkId);
    if (existing) existing.remove();
    const link = document.createElement('link');
    link.id = fontLinkId;
    link.rel = 'stylesheet';
    link.href = cfg.styling.googleFontsImport;
    document.head.appendChild(link);

    // Update document title
    document.title = cfg.identity.metaTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', cfg.identity.metaDescription);
    }
  }, [cfg]);

  return null;
}

// ============================================================
// APP — Root component (config-driven)
// ============================================================
export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const cfg = config;

  return (
    <div className="font-sans text-gray-800 bg-white selection:bg-[var(--color-primary)] selection:text-white scroll-smooth">
      <ThemeInjector cfg={cfg} />
      <Header onOpenQuote={() => setIsQuoteOpen(true)} cfg={cfg} />
      <main id="main-content">
        <Hero onOpenQuote={() => setIsQuoteOpen(true)} cfg={cfg} />
        <TrustBadges cfg={cfg} />
        <Services cfg={cfg} />
        <Pricing onOpenQuote={() => setIsQuoteOpen(true)} cfg={cfg} />
        <Reviews cfg={cfg} />
        <Areas cfg={cfg} />
      </main>
      <Footer cfg={cfg} />

      <AnimatePresence>
        {isQuoteOpen && <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} cfg={cfg} />}
      </AnimatePresence>
    </div>
  );
}

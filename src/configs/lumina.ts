import type { CompanyConfig } from './company_config';

const luminaConfig: CompanyConfig = {
    // --- IDENTITY ---
    identity: {
        companyName: "LUMINA",
        companyNameFull: "Lumina Commercial Cleaning",
        logoInitial: "L",
        tagline: "Elevating Standards\nfor Modern Workspaces",
        subTagline: "We serve elite offices, medical facilities, and luxury retail spaces in the greater metro area. Experience the difference of a team that takes pride in perfection.",
        badgeText: "PREMIUM COMMERCIAL CLEANING",
        metaTitle: "Lumina Commercial Cleaning | Premium Janitorial Services",
        metaDescription: "Lumina Premium Commercial Cleaning — Elevating standards for modern workspaces. Professional janitorial services for offices, medical facilities, and luxury retail. Fully insured, OSHA certified. Get a free quote today.",
    },

    // --- STYLING ---
    styling: {
        primaryColor: "#0f172a",
        accentColor: "#c0a062",
        surfaceColor: "#f8fafc",
        fontSans: '"Inter", ui-sans-serif, system-ui, sans-serif',
        fontSerif: '"Playfair Display", ui-serif, Georgia, serif',
        fontDisplay: '"Space Grotesk", ui-sans-serif, system-ui, sans-serif',
        googleFontsImport: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Space+Grotesk:wght@300;400;500;600&display=swap",
    },

    // --- CONTACT ---
    contact: {
        phone: "(555) 123-4567",
        phoneTel: "+15551234567",
        email: "hello@luminacleaning.com",
        address: "123 Commerce Blvd, Suite 400",
        addressLine2: "Metro City, ST 12345",
        socialMedia: {
            instagram: "#",
            linkedin: "#",
            facebook: "#",
        },
    },

    // --- HERO ---
    hero: {
        backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
        backgroundAlt: "Pristine modern office corridor with glass walls and polished floors, showcasing professional commercial cleaning standards",
        ctaPrimary: "Get a Free Quote",
        ctaSecondary: "Call Us Now",
    },

    // --- SERVICES ---
    services: {
        sectionTitle: "Meticulous Service.\nUnmatched Quality.",
        sectionSubtitle: "We don't just clean; we curate environments that inspire productivity and confidence.",
        items: [
            {
                title: "Corporate Offices",
                description: "Daily janitorial services tailored for high-traffic professional environments.",
                image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
                alt: "Bright, sunlit corporate office workspace with clean desks and modern furnishings",
            },
            {
                title: "Medical Facilities",
                description: "Hospital-grade sanitation protocols for clinics, dental offices, and labs.",
                image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
                alt: "Spotless medical clinic reception area with sanitised surfaces and professional lighting",
            },
            {
                title: "Luxury Retail",
                description: "Immaculate presentation for showrooms and boutiques where detail matters.",
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
                alt: "High-end retail boutique showroom with gleaming display shelves and polished flooring",
            },
        ],
    },

    // --- PRICING ---
    pricing: {
        sectionTitle: "Transparent Pricing",
        sectionSubtitle: "No hidden fees. No surprises. Just exceptional value for premium service.",
        plans: [
            {
                name: "Essential",
                description: "Perfect for small offices needing weekly maintenance.",
                features: ["Weekly Cleaning", "Trash Removal", "Restroom Sanitation", "Vacuuming & Mopping"],
            },
            {
                name: "Professional",
                description: "Our most popular plan for daily business operations.",
                features: ["Daily Cleaning", "Kitchen/Breakroom Detail", "High-Dusting", "Supply Restocking", "Window Spot Cleaning"],
                highlight: true,
            },
            {
                name: "Executive",
                description: "Comprehensive care for high-end facilities.",
                features: ["Day Porter Services", "Deep Carpet Cleaning", "Floor Waxing/Buffing", "Upholstery Cleaning", "24/7 Emergency Response"],
            },
        ],
    },

    // --- REVIEWS ---
    reviews: {
        averageRating: "4.9/5",
        items: [
            { name: "Sarah Jenkins", role: "Office Manager, TechFlow", text: "Lumina transformed our workspace. The team is incredibly professional, punctual, and the attention to detail is unlike any other service we've used.", rating: 5 },
            { name: "Michael Ross", role: "Director, Ross Medical Group", text: "In a medical setting, cleanliness is non-negotiable. Lumina consistently exceeds our strict sanitation standards. Highly recommended.", rating: 5 },
            { name: "Elena Rodriguez", role: "Owner, Luxe Boutique", text: "Our showroom floors have never looked better. Clients constantly compliment the cleanliness of our store. It's a game changer for our brand image.", rating: 5 },
        ],
    },

    // --- SERVICE AREAS ---
    areas: {
        sectionTitle: "Serving the Greater Metro Area",
        sectionSubtitle: "Our teams are strategically positioned to provide rapid response and reliable daily service across the entire region.",
        locations: [
            "Downtown Metro", "North Hills", "Westside Business District",
            "Tech Park", "Harbor Front", "South Bay", "Eastside Industrial", "Uptown",
        ],
    },

    // --- FOOTER ---
    footer: {
        description: "Setting the gold standard for commercial cleaning. We bring clarity, hygiene, and professionalism to your business environment.",
        copyright: "© 2026 Lumina Commercial Cleaning. All rights reserved.",
    },

    // --- TRUST BADGES ---
    trustBadges: ["Fully Insured", "OSHA Certified", "Top Rated 2025", "Bonded"],
};

export default luminaConfig;

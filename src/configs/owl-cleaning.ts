import type { CompanyConfig } from '../company_config';

// ============================================================
// OWL CLEANING SERVICES
// ============================================================
// Source: https://owlcleaningservices.co.uk/ (scraped 2026-02-26)
// Source: Google Maps (4.1★, 15 reviews)
// Source: Enriched CSV lead data
// ============================================================

const owlCleaningConfig: CompanyConfig = {
    identity: {
        companyName: "OWL CLEANING",
        companyNameFull: "Owl Cleaning Services",
        logoInitial: "O",
        logoUrl: "https://owlcleaningservices.co.uk/wp-content/uploads/2021/09/header-logo-1.png",
        tagline: "Your Commercial Cleaning\nCompany in London",
        subTagline: "Premium-quality professional cleaning solutions for commercial premises throughout London. From shops and offices to schools and healthcare providers, we help you maintain a clean, safe and hygienic environment.",
        badgeText: "PROFESSIONAL COMMERCIAL CLEANING",
        metaTitle: "Owl Cleaning Services | Commercial Cleaning Company London UK",
        metaDescription: "Owl Cleaning Services provide premium-quality professional cleaning solutions for commercial premises throughout London. We are your trusted cleaning partner.",
    },

    styling: {
        primaryColor: "#0088C2",
        accentColor: "#E8A817",
        surfaceColor: "#f0f6fa",
        fontSans: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
        fontSerif: '"Playfair Display", ui-serif, Georgia, serif',
        fontDisplay: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
        googleFontsImport: "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;1,700&display=swap",
    },

    contact: {
        phone: "01895 625 855",
        phoneTel: "+441895625855",
        email: "info@owlcleaningservices.co.uk",
        address: "94b Glebe Ave, Ickenham",
        addressLine2: "Uxbridge UB10 8PD",
        socialMedia: {
            linkedin: "https://www.linkedin.com/company/owl-cleaning-services",
        },
    },

    hero: {
        backgroundImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
        backgroundAlt: "Modern commercial office building with clean glass facade and professional environment",
        ctaPrimary: "Get a Free Quote",
        ctaSecondary: "Call Us Today",
    },

    services: {
        sectionTitle: "Our Services",
        sectionSubtitle: "From regular contract cleaning to specialised deep cleans, we deliver premium cleaning solutions across multiple industries.",
        items: [
            {
                title: "Office Cleaning",
                description: "Looking for professional, flexible and high-quality cleaning services for your workplace? We provide comprehensive annual cleaning plans for London businesses, combining day-to-day cleaning with intense, periodic cleaning throughout the year.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
                alt: "Professional modern office space with clean desks and natural lighting",
            },
            {
                title: "Retail Cleaning",
                description: "Your venue is a reflection of your brand. We'll help you maintain a fresh, inviting environment your staff and customers love to be in. Our retail cleaning services ensure every corner of your store is spotless.",
                image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
                alt: "Clean and well-maintained retail store interior with bright lighting",
            },
            {
                title: "Medical Cleaning",
                description: "Protect the health of your patients and staff with specialist medical cleaning solutions. We use industry-approved products and procedures to maintain the highest standards of hygiene in healthcare environments.",
                image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop",
                alt: "Spotless medical facility corridor with clean floors and bright lighting",
            },
        ],
    },

    pricing: {
        sectionTitle: "Pricing",
        sectionSubtitle: "We don't give unrealistic quotes. Book a free consultation for an accurate and bespoke price tailored to your premises.",
        plans: [
            {
                name: "Regular Contract",
                description: "Ongoing scheduled cleaning",
                features: [
                    "Daily or weekly cleaning schedule",
                    "Dedicated cleaning team assigned",
                    "All products and equipment included",
                    "Flexible day or night service",
                ],
            },
            {
                name: "Bespoke Package",
                description: "Tailored to your needs",
                features: [
                    "Custom cleaning plan for your venue",
                    "Periodic deep cleans included",
                    "DBS-checked & vetted staff",
                    "Quality inspections guaranteed",
                ],
                highlight: true,
            },
            {
                name: "One-Off Deep Clean",
                description: "Intensive single-session clean",
                features: [
                    "Full premises deep clean",
                    "Industrial-grade equipment",
                    "Eco-friendly products used",
                    "Weekend & out-of-hours available",
                ],
            },
        ],
    },

    reviews: {
        averageRating: "4.1/5",
        items: [
            {
                name: "Lana Argyle",
                role: "Residential Client",
                text: "I found out about Owl Cleaning Services through a friend who used their services for his business premises and was absolutely delighted with the work they did. I was offered very good value for money compared to the quotes we'd had from the big cleaning companies. The team arrived on time and was very easy to deal with, the service was exceptional and very professional!",
                rating: 5,
            },
            {
                name: "Valeriya Dzhevala",
                role: "Office Client",
                text: "Really good service! I've noticed a significant difference in how clean our offices became in the past 2 months since we switched to Owl Cleaning Services. They have really friendly, hardworking and reliable staff and offer all cleaning services you can wish for! Highly recommend!",
                rating: 5,
            },
            {
                name: "Allan Bertram",
                role: "Corporate Client",
                text: "We recently hired them to clean our office building on a weekly basis and have been so impressed with their professional service. We would definitely recommend.",
                rating: 5,
            },
            {
                name: "Krystian Ratajczak",
                role: "Business Client",
                text: "Good, honest, customer focused service which is hard to come by these days. Highly recommend.",
                rating: 5,
            },
        ],
    },

    areas: {
        sectionTitle: "Areas We Cover",
        sectionSubtitle: "Providing premium commercial cleaning services across London and the surrounding areas.",
        locations: [
            "Central London",
            "West London",
            "Uxbridge",
            "Ickenham",
            "Hillingdon",
            "Harrow",
            "Ealing",
        ],
    },

    footer: {
        description: "Owl Cleaning Services provide premium-quality professional cleaning solutions for commercial premises throughout London. All our staff are fully vetted, DBS and security checked — for your complete peace of mind.",
        copyright: "© 2025 Owl Cleaning Services | All Rights Reserved.",
    },

    trustBadges: [
        "Ethical Products",
        "Attention To Detail",
        "10+ Years Experience",
        "Flexible Service",
    ],
};

export default owlCleaningConfig;

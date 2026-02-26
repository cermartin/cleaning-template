import type { CompanyConfig } from '../company_config';

// ============================================================
// ALB SHINING CLEANING SERVICES LTD
// ============================================================
// Source: https://albshining.co.uk/ (scraped 2026-02-26)
// Source: Google Maps (4.9★, 99 reviews)
// Source: CSV lead data
// ============================================================

const albShiningConfig: CompanyConfig = {
    // --- IDENTITY ---
    identity: {
        companyName: "ALB SHINING",
        companyNameFull: "Alb Shining Cleaning Services Ltd",
        logoInitial: "A",
        logoUrl: "https://albshining.co.uk/wp-content/uploads/2023/09/Alb_Shining_Cleaning_Web_Logo-01.svg",
        tagline: "Uxbridge's Top Choice for Professional\nDomestic & Commercial Cleaning Services",
        subTagline: "We are more than just a cleaning company – we are your dedicated partners in creating a clean, comfortable, and welcoming home environment. We take pride in being an active part of the Uxbridge community.",
        badgeText: "PROFESSIONAL CLEANING SERVICES",
        metaTitle: "Alb Shining | Uxbridge's Top Choice for Professional Domestic Cleaning Services",
        metaDescription: "We are committed to provide top-notch domestic cleaning services in Uxbridge, Hillingdon, West Drayton, Ickenham, Hayes Denham, Harefield etc.",
    },

    // --- STYLING (scraped from albshining.co.uk computed styles) ---
    styling: {
        primaryColor: "#D45544",          // Real brand red/coral — from nav, logo, icons, pricing
        accentColor: "#D45544",           // Same red used for star icons and highlights
        surfaceColor: "#f0f4f8",          // Light blue-grey background from pricing section
        fontSans: '"Ubuntu", ui-sans-serif, system-ui, sans-serif',      // Real font from site
        fontSerif: '"Playfair Display", ui-serif, Georgia, serif',
        fontDisplay: '"Ubuntu", ui-sans-serif, system-ui, sans-serif',   // Ubuntu used for headings too
        googleFontsImport: "https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap",
    },

    // --- CONTACT (from website footer + CSV) ---
    contact: {
        phone: "07456 045853",
        phoneTel: "+447456045853",
        email: "info@albshining.co.uk",
        address: "28 Denham Lodge, Oxford Rd",
        addressLine2: "Denham, Uxbridge UB9 4AB",
        socialMedia: {
            instagram: "https://www.instagram.com/alb_shining_cleaning/",
            facebook: "https://www.facebook.com/profile.php?id=100092952756532",
            // Note: They also have TikTok at https://www.tiktok.com/@alb_shining_cleaning19
        },
    },

    // --- HERO ---
    hero: {
        backgroundImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2070&auto=format&fit=crop",
        backgroundAlt: "Professional cleaner wiping surfaces in a bright domestic setting, representing Alb Shining's high standards",
        ctaPrimary: "Get In Touch",         // Their actual CTA text from the hero
        ctaSecondary: "Call Us Now",
    },

    // --- SERVICES (from albshining.co.uk — their 3 main highlighted services) ---
    services: {
        sectionTitle: "Main Services",
        sectionSubtitle: "From regular domestic cleans to commercial spaces and end-of-tenancy turnarounds, we deliver spotless results every time.",
        items: [
            {
                title: "Commercial Cleaning",
                description: "The Commercial Cleaning Services we offer are designed for those who value the comfort of a spotlessly clean working environment. For those in Uxbridge and the towns nearby, there is no better cleaning agency to choose than ALB Shining.",
                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2301&auto=format&fit=crop",
                alt: "Pristine corporate office space with gleaming floors and spotless workstations",
            },
            {
                title: "Domestic Cleaning",
                description: "ALB Shining Cleaning is a leading local company offering Domestic Cleaning Services. Our team thoroughly deep clean your entire home and make sure it looks spotless. Our hire cost will be nothing compared to the time and money you might spend elsewhere.",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?q=80&w=2070&auto=format&fit=crop",
                alt: "Immaculately clean modern living room with polished surfaces and natural light",
            },
            {
                title: "End of Tenancy",
                description: "We realise every premise is different and you may have individual cleaning requirements. For that reason, we offer customisable cleaning packages and always take into account the instructions our clients provide.",
                image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop",
                alt: "Empty apartment freshly cleaned with spotless kitchen and sparkling windows ready for checkout",
            },
        ],
    },

    // --- PRICING (EXACT from albshining.co.uk — real prices scraped) ---
    pricing: {
        sectionTitle: "Pricing",
        sectionSubtitle: "Transparent hourly rates. Cleaning products excluded. No hidden fees.",
        plans: [
            {
                name: "Weekly Cleaning",
                description: "£18.00 per hour (min. 3 hrs)",
                features: [
                    "Weekly scheduled cleaning",
                    "£18.00 per hour rate",
                    "Minimum 3 hours per visit",
                    "Cleaning products excluded",
                ],
            },
            {
                name: "Fortnightly Cleaning",
                description: "£19.50 per hour (min. 3 hrs)",
                features: [
                    "Fortnightly scheduled cleaning",
                    "£19.50 per hour rate",
                    "Minimum 3 hours per visit",
                    "Cleaning products excluded",
                ],
                highlight: true,
            },
            {
                name: "One Off",
                description: "£25.00 per hour (min. 4 hrs)",
                features: [
                    "One-off deep clean",
                    "£25.00 per hour rate",
                    "Minimum 4 hours per visit",
                    "Cleaning products excluded",
                ],
            },
        ],
    },

    // --- REVIEWS (REAL reviews from albshining.co.uk testimonials section) ---
    reviews: {
        averageRating: "4.9/5",
        items: [
            {
                name: "Meli Meli",
                role: "Posted January 2025",
                text: "Excellent service 👏 Ermelinta and her team did great job. Many thanks",
                rating: 5,
            },
            {
                name: "Léa FRAIOLI",
                role: "Posted January 2025",
                text: "Great job from Ermelinta and her team. Super nice and flexible for the date of the cleaning! I was happy with the service provided :) Thank you again so much!!",
                rating: 5,
            },
            {
                name: "Mandeep Kaur",
                role: "Posted December 2024",
                text: "I am very pleased with cleaning service by ALB Shining. They are very efficient and responsible team. I highly recommend their cleaning services.",
                rating: 5,
            },
            {
                name: "Martyna Woszczyło",
                role: "Posted December 2024",
                text: "We've had a fantastic experience with this cleaning company. They do an excellent job and their attention to detail is impressive. Communication is incredibly easy and smooth. We've been working mostly with Jas, and we couldn't be happier. Highly recommended!",
                rating: 5,
            },
            {
                name: "Vistar Sharma",
                role: "Posted November 2024",
                text: "ALB Shining Cleaning did an excellent job! They were professional, punctual, and left my home looking spotless. The team paid attention to detail and made sure every area was cleaned to a high standard. Booking was easy, and they were very friendly and efficient throughout.",
                rating: 5,
            },
            {
                name: "Sarah Dexter",
                role: "Posted November 2024",
                text: "Had an amazing experience. The cleaner was lovely and my house looks sparkling clean.",
                rating: 5,
            },
        ],
    },

    // --- SERVICE AREAS (EXACT from albshining.co.uk "Areas We Cover") ---
    areas: {
        sectionTitle: "Areas We Cover",
        sectionSubtitle: "Our dedicated team is committed to providing top-notch cleaning solutions, ensuring that homes in the following areas shine with cleanliness and brilliance.",
        locations: [
            "Uxbridge", "Hillingdon", "West Drayton", "Ickenham",
            "Hayes", "Denham", "Harefield",
        ],
    },

    // --- FOOTER (from albshining.co.uk) ---
    footer: {
        description: "At ALB Shining, we are more than just a cleaning company – we are your dedicated partners in creating a clean, comfortable, and welcoming home environment. We are insured for the service we provide so your property is in safe hands.",
        copyright: "© 2023 ALB Shining Cleaning | All Rights Reserved.",
    },

    // --- TRUST BADGES (from "Why Choose Us?" section) ---
    trustBadges: ["Expert Team", "Reliability", "Customer Satisfaction", "Exceptional Quality"],
};

export default albShiningConfig;

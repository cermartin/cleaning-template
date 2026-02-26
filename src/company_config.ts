// ============================================================
// WHITELABEL TEMPLATE — Company Configuration Schema
// ============================================================
// This file defines the structure of a company_config.
// Swap the active config to re-skin the entire website instantly.
// ============================================================

export interface CompanyConfig {
    // --- IDENTITY ---
    identity: {
        companyName: string;           // Display name (e.g., "Lumina")
        companyNameFull: string;       // Full legal name (e.g., "Lumina Commercial Cleaning")
        logoInitial: string;           // Single letter for logo circle fallback (e.g., "L")
        logoUrl?: string;              // Optional: URL to company logo (SVG/PNG). If set, replaces the letter circle.
        tagline: string;               // Hero headline
        subTagline: string;            // Hero subtext
        badgeText: string;             // Badge label above headline
        metaTitle: string;             // Browser tab title
        metaDescription: string;       // SEO meta description
    };

    // --- STYLING ---
    styling: {
        primaryColor: string;          // Hex - main brand color (text, nav)
        accentColor: string;           // Hex - CTA highlights, stars, icons
        surfaceColor: string;          // Hex - light background sections
        fontSans: string;              // Body font family
        fontSerif: string;             // Serif accent font
        fontDisplay: string;           // Heading display font
        googleFontsImport: string;     // Full Google Fonts @import URL
    };

    // --- CONTACT ---
    contact: {
        phone: string;                 // Display format: "(555) 123-4567"
        phoneTel: string;              // tel: format: "+15551234567"
        email: string;
        address: string;               // Street address line 1
        addressLine2: string;          // City, State, Zip
        socialMedia: {
            instagram?: string;
            linkedin?: string;
            facebook?: string;
        };
    };

    // --- HERO ---
    hero: {
        backgroundImage: string;       // URL to hero background
        backgroundAlt: string;         // Alt text for hero image
        ctaPrimary: string;            // Primary CTA button text
        ctaSecondary: string;          // Secondary CTA text (usually phone)
    };

    // --- SERVICES ---
    services: {
        sectionTitle: string;
        sectionSubtitle: string;
        items: Array<{
            title: string;
            description: string;
            image: string;
            alt: string;
        }>;
    };

    // --- PRICING ---
    pricing: {
        sectionTitle: string;
        sectionSubtitle: string;
        plans: Array<{
            name: string;
            description: string;
            features: string[];
            highlight?: boolean;         // True = featured/recommended plan
        }>;
    };

    // --- REVIEWS ---
    reviews: {
        averageRating: string;         // e.g., "4.9/5"
        items: Array<{
            name: string;
            role: string;
            text: string;
            rating: number;              // 1-5
        }>;
    };

    // --- SERVICE AREAS ---
    areas: {
        sectionTitle: string;
        sectionSubtitle: string;
        locations: string[];
    };

    // --- FOOTER ---
    footer: {
        description: string;           // About blurb in footer
        copyright: string;             // "© 2026 Company. All rights reserved."
    };

    // --- TRUST BADGES ---
    trustBadges: string[];            // e.g., ["Fully Insured", "OSHA Certified", ...]
}

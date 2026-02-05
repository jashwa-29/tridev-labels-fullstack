const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('colors');
const Service = require('./models/Service');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: './.env' });

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI);

const servicesData = [
  {
    "title": "Thermal Transfer Labels",
    "subtitle": "Precision Printing for High-Durability Applications",
    "description": "Engineered for longevity and clarity, our thermal transfer solutions ensure your barcodes, text, and graphics remain legible even in the harshest industrial environments.",
    "heroImage": "https://images.unsplash.com/photo-1626222851888-2af3066345bc?q=80&w=2600&auto=format&fit=crop",
    "subProducts": [
      { "title": "Barcode Labels", "desc": "High-precision scannable labels for global inventory and asset tracking.", "image": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80" },
      { "title": "E-Commerce Labels", "desc": "Optimized for high-speed logistics and shipping workflows.", "image": "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80" },
      { "title": "Direct Thermal Labels", "desc": "Heat-sensitive labels for rapid, ribbon-less printing applications.", "image": "https://images.unsplash.com/photo-1626222851888-2af3066345bc?auto=format&fit=crop&q=80" },
      { "title": "Jewelry Tags / Jewelry Labels", "desc": "Elegant, high-durability tags designed for the luxury retail sector.", "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80" },
      { "title": "Piggy Back Labels", "desc": "Multi-layer labels for record keeping and administrative tracking.", "image": "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80" },
      { "title": "QC Labels", "desc": "Quality control indicators for manufacturing and industrial processing.", "image": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" },
      { "title": "TTR Ribbons", "desc": "Premium Wax, Wax/Resin, and Resin ribbons for superior transfer quality.", "image": "https://images.unsplash.com/photo-1606963032953-f7614e5f7374?auto=format&fit=crop&q=80" }
    ],
    "specs": [
      { "label": "Durability", "value": "Chemical & Heat Resistant" },
      { "label": "Printing Tech", "value": "300-600 DPI Precision" },
      { "label": "Adhesive", "value": "High-Tack / Permanent" },
      { "label": "Compliance", "value": "UL, CSA, RoHS" }
    ],
    "applications": ["Logistics", "Inventory", "Retail", "Manufacturing"],
    "sections": [
      {
        "heading": "Engineered for Extreme Environments",
        "content": "<p>Thermal transfer labels are the gold standard for long-term durability. Unlike direct thermal labels, which are sensitive to heat and light, our thermal transfer solutions utilize a ribbon to melt ink onto the label surface. This results in a print that is impervious to moisture, chemicals, and abrasion.</p><p>We offer a range of face stocks including paper, polyester, and polypropylene, paired with high-performance adhesives that ensure your labels stay attached to everything from corrugated cardboard to rough industrial drums.</p>",
        "image": "https://images.unsplash.com/photo-1596496181966-267924e39b92?auto=format&fit=crop&q=80",
        "imageAlt": "Industrial thermal transfer printing process"
      }
    ],
    "faqs": [
      {
        "question": "What is the difference between Direct Thermal and Thermal Transfer?",
        "answer": "Direct Thermal uses heat-sensitive paper and no ribbon, making it ideal for short-term use (shipping labels). Thermal Transfer uses a ribbon to melt ink onto the label, providing a permanent, durable image suitable for long-term storage and harsh environments."
      },
      {
        "question": "Which ribbon should I use for my labels?",
        "answer": "Use Wax ribbons for standard paper labels, Wax/Resin for smudge resistance on coated paper/synthetics, and full Resin ribbons for extreme durability on synthetic materials (polyester/polypropylene)."
      }
    ],
    "slug": "thermal-transfer-labels",
    "order": 1
  },
  {
    "title": "Specialty Labels",
    "subtitle": "Custom Engineering for Unique Branding Challenges",
    "description": "Beyond standard labeling, our specialty division creates bespoke solutions that combine advanced material science with innovative design for functional excellence.",
    "heroImage": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2600&auto=format&fit=crop",
    "subProducts": [
      { "title": "Reverse Side Printed Labels", "desc": "Graphics protected under the surface for extreme abrasion resistance.", "image": "https://images.unsplash.com/photo-1626606650460-d2506c8914f6?auto=format&fit=crop&q=80" },
      { "title": "Polycarbonate Labels & Overlays", "desc": "Durable overlays for control panels and industrial instrumentation.", "image": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80" },
      { "title": "Water Detection Labels", "desc": "Chemical indicators that trigger visibility upon moisture contact.", "image": "https://images.unsplash.com/photo-1533035353720-f1c6a75cd8ab?auto=format&fit=crop&q=80" },
      { "title": "Dome Labels Solutions", "desc": "3D resin-coated labels for a premium, tactile brand presence.", "image": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80" },
      { "title": "Wire and Cable Flags", "desc": "Engineered for electrical identification with high flame retardancy.", "image": "https://images.unsplash.com/photo-1558484633-9144fae6f21c?auto=format&fit=crop&q=80" },
      { "title": "Variable Data Labels", "desc": "Seamless integration of unique codes, names, and identifiers.", "image": "https://images.unsplash.com/photo-1606914501449-1a96e8121ebc?auto=format&fit=crop&q=80" },
      { "title": "Laminated Barcode Labels", "desc": "Over-laminated protection for labels in heavy-washdown zones.", "image": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80" }
    ],
    "specs": [
      { "label": "Materials", "value": "Polycarbonate, Polyester, PVC" },
      { "label": "Tactile", "value": "3D Domed / Embossed" },
      { "label": "Security", "value": "Tamper-Proof / Water Reactive" },
      { "label": "Lifecycle", "value": "10+ years Outdoor Life" }
    ],
    "applications": ["Electronics", "Instrumentation", "Electrical", "Marine"],
    "sections": [
      {
        "heading": "Custom Solutions for Complex Challenges",
        "content": "<p>When standard labels fail, our Specialty Labels division steps in. We engineer solutions for unique challenges such as extreme temperatures, chemical exposure, and difficult-to-adhere surfaces. Our polycarbonate overlays and reverse-printed labels offer superior protection for control panels, ensuring that critical instructional text remains legible for the lifetime of the equipment.</p>",
        "image": "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80",
        "imageAlt": "Advanced industrial control panel with durable overlay"
      }
    ],
    "faqs": [
      {
        "question": "What are reverse printed labels?",
        "answer": "Reverse printing involves printing the graphics on the back side of a transparent material (like polycarbonate). This means the ink is protected by the thickness of the material itself, making it impossible to scratch off from the surface."
      },
      {
        "question": "Can you make labels that withstand outdoor exposure?",
        "answer": "Yes, we use UV-stabilized inks and high-grade synthetic materials (like polyester and vinyl) that are tested to withstand 5-10 years of outdoor exposure without fading or peeling."
      }
    ],
    "slug": "specialty-labels",
    "order": 2
  },
  {
    "title": "Automotive, Industrial + Durable Goods Labels",
    "subtitle": "Engineered to Outlast the Lifecycle",
    "description": "Labels that withstand the rigors of the automotive industry—heat, oil, grime, and time. Ensure critical information stays attached for the life of the part.",
    "heroImage": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2600&auto=format&fit=crop",
    "subProducts": [
      { "title": "Tyre Labels", "desc": "Aggressive adhesives designed to stick to rough rubber surfaces." },
      { "title": "Asset Tracking Labels", "desc": "Heavy-duty tracking for machinery and industrial assets." },
      { "title": "Drum / Barrel Labels", "desc": "BS5609 certified for chemical transport in harsh marine environments." },
      { "title": "High Temperature Labels", "desc": "Withstands engine heat and industrial curing processes." },
      { "title": "Lubricant Oil Labels", "desc": "Oil and grease resistant branding for the petrochemical sector." },
      { "title": "OEM Part & Automotive Labels", "desc": "Compliant with international automotive parts identification standards." }
    ],
    "specs": [
      { "label": "Temperatures", "value": "Up to 300°C" },
      { "label": "Resistance", "value": "Oil, Grime, UV, Salt water" },
      { "label": "Certification", "value": "IATF 16949 / BS5609" },
      { "label": "Adhesive", "value": "Vulcanizing Rubber-based" }
    ],
    "applications": ["Automotive Engines", "Chemical Drums", "Asset Management", "Heavy Machinery"],
    "sections": [
      {
        "heading": "Labels That Drive Industry",
        "content": "<p>The automotive and heavy industrial sectors demand zero failure. Our labels are designed to meet rigorous standards such as GHS and IATF 16949. Whether it's a tyre label that must stick to rough rubber treads or a drum label that needs to survive a trans-oceanic voyage, our adhesive technologies are up to the task.</p>",
        "image": "https://images.unsplash.com/photo-1532187643603-ba119cdd7512?auto=format&fit=crop&q=80",
        "imageAlt": "Automotive engine parts with identification labels"
      }
    ],
    "faqs": [
      {
        "question": "Do your drum labels meet BS5609 standards?",
        "answer": "Yes, our chemical drum labels are BS5609 certified, ensuring they remain adhesive and legible even after three months of immersion in seawater, a requirement for international chemical shipping."
      },
      {
        "question": "What sort of heat resistance can I expect?",
        "answer": "Our high-temperature polyimide labels can withstand temperatures up to 300°C, making them suitable for PCB manufacturing and under-the-hood automotive applications."
      }
    ],
    "slug": "automotive-industrial-durable-goods-labels",
    "order": 3
  },
  {
    "title": "Labels for Beauty, Home + Personal Care Products",
    "subtitle": "Aesthetics Meets Durability",
    "description": "Premium labeling solutions designed to enhance shelf appeal while resisting water, oils, and daily handling.",
    "heroImage": "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80",
    "subProducts": [
      { "title": "Cosmetic Labels", "desc": "Elegant and durable labels for creams, lotions, and makeup packaging." },
      { "title": "Wet Wipes Labels", "desc": "Resealable and moisture-resistant labels for wet wipe packaging." }
    ],
    "specs": [
      { "label": "Finish", "value": "Matte, Gloss, Soft-Touch" },
      { "label": "Resistance", "value": "Water, Oil, Humidity" }
    ],
    "applications": ["Cosmetics", "Personal Care", "Home Products"],
    "sections": [
      {
        "heading": "Luxury You Can Feel",
        "content": "<p>In the beauty industry, the package is as important as the product. We offer a variety of premium finishes including soft-touch matte, high-gloss, and metallic foils that elevate your brand's presence. Crucially, these labels are water and oil resistant, ensuring they maintain their pristine look in a steamy bathroom environment.</p>",
        "image": "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&q=80",
        "imageAlt": "Premium cosmetic bottles with elegant labeling"
      }
    ],
    "faqs": [
      {
        "question": "Can you match my brand's specific color?",
        "answer": "Absolutely. We use a Pantone matching system to ensure that your brand colors are reproduced consistently across every print run."
      },
      {
        "question": "Are the labels waterproof?",
        "answer": "Yes, for personal care products, we typically recommend polypropylene (PP) or polyethylene (PE) films which are waterproof and squeeze-conformable."
      }
    ],
    "slug": "labels-for-beauty-home-personal-care-products",
    "order": 4
  },
  {
    "title": "Food + Beverage & Liquor Labels",
    "subtitle": "Tasteful Branding for Consumables",
    "description": "High-quality labels that withstand cold, moisture, and handling while ensuring your product stands out on the shelf.",
    "heroImage": "https://images.unsplash.com/photo-1594488518001-57626c84c7d7?auto=format&fit=crop&q=80",
    "subProducts": [
      { "title": "Freezer Proof Labels", "desc": "Adhesives that perform reliably in sub-zero storage conditions." },
      { "title": "Juice Bottle Labels", "desc": "Vibrant, moisture-resistant labels for juice and beverage bottles." },
      { "title": "Milk Bottle Labels", "desc": "Durable labels designed to withstand condensation and cold chain logistics." }
    ],
    "specs": [
      { "label": "Temp Range", "value": "-40°C to Ambient" },
      { "label": "Safety", "value": "Food Grade Compliant" }
    ],
    "applications": ["Frozen Food", "Beverages", "Dairy"],
    "sections": [
      {
        "heading": "Freshness Sealed, Safety Assured",
        "content": "<p>From the freezer aisle to the dinner table, our food and beverage labels perform. We use FDA-approved adhesives that are safe for indirect food contact. Our specialized 'freezer-grade' adhesives can be applied at sub-zero temperatures and will not flag or fall off in cold storage.</p>",
        "image": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80",
        "imageAlt": "Juice bottles in a cooler with vibrant labels"
      }
    ],
    "faqs": [
      {
        "question": "Do you offer 'No-Label' look labels?",
        "answer": "Yes, we offer ultra-clear synthetic labels that vanish when applied to glass or clear plastic bottles, giving the appearance of direct printing."
      },
      {
        "question": "Are your inks safe for food packaging?",
        "answer": "We use low-migration inks and varnishes that comply with global food safety standards for outer packaging."
      }
    ],
    "slug": "food-beverage-liquor-labels",
    "order": 5
  },
  {
    "title": "Pharmaceutical Labels + Packaging Solutions",
    "subtitle": "Compliance, Safety, and Clarity",
    "description": "Critical labeling solutions for the pharmaceutical industry, ensuring legibility, compliance, and security.",
    "heroImage": "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80",
    "subProducts": [
      { "title": "Double Sided Printed Labels", "desc": "Maximize information space with printing on both sides of the label." },
      { "title": "Autoclave Resistant Labels", "desc": "Labels that survive high-pressure steam sterilization processes." }
    ],
    "specs": [
      { "label": "Compliance", "value": "FDA / Pharma Guidelines" },
      { "label": "Sterilization", "value": "Autoclave Compatible" }
    ],
    "applications": ["Pharma Vials", "Medical Devices", "Clinical Trials"],
    "sections": [
      {
        "heading": "Critical Accuracy for Healthcare",
        "content": "<p>In healthcare, a label can be a matter of life and death. Our pharmaceutical labeling solutions prioritize legibility, security, and traceability. We offer multi-layer labels for extended text (like dosage instructions) and autoclave-resistant materials that survive sterilization cycles.</p>",
        "image": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80",
        "imageAlt": "Pharmaceutical vials with precise tracking labels"
      }
    ],
    "faqs": [
      {
        "question": "Do you support serialization for track and trace?",
        "answer": "Yes, we can print unique serial numbers, barcodes, and 2D datamatrix codes on every label for full supply chain traceability."
      },
      {
        "question": "Can labels withstand steam sterilization?",
        "answer": "Our autoclave-resistant labels are engineered to withstand the high heat, pressure, and moisture of steam sterilization without peeling or turning black."
      }
    ],
    "slug": "pharmaceutical-labels-packaging-solutions",
    "order": 6
  },
  {
    "title": "Tamper-evident labels",
    "subtitle": "Security and Authenticity Assurance",
    "description": "Protect your brand and products with advanced tamper-evident and security labeling solutions.",
    "heroImage": "https://images.unsplash.com/photo-1614064641938-3e858a915f32?auto=format&fit=crop&q=80",
    "subProducts": [
      { "title": "Silver Void Labels", "desc": "Leaves a visible 'VOID' pattern when removed to indicate tampering." },
      { "title": "UDV Labels", "desc": "Ultra-Destructible Vinyl labels that fragment upon removal attempts." },
      { "title": "Smartphone Camera Security Labels (CAM Block)", "desc": "Prevents unauthorized photography in sensitive areas." },
      { "title": "Frangible Security Seal Labels", "desc": "Seals that break easily upon opening, proving package integrity." }
    ],
    "specs": [
      { "label": "Mechanism", "value": "Void / Destruct / Frangible" },
      { "label": "Application", "value": "Warranty Seals, Asset Protection" }
    ],
    "applications": ["Electronics Warranty", "Secure Facilities", "Product Authenticity"],
    "sections": [
      {
        "heading": "Protecting Integrity, Ensuring Trust",
        "content": "<p>Security labels act as a first line of defense against tampering and counterfeiting. Our 'VOID' labels leave an irreversible message on the surface if removed, while our destructible vinyls fragment into tiny pieces, making impossible to peel off in one piece. These are essential for warranty seals, asset tags, and sealing sensitive enclosures.</p>",
        "image": "https://images.unsplash.com/photo-1614064641938-3e858a915f32?auto=format&fit=crop&q=80",
        "imageAlt": "Security void label showing tampering evidence"
      }
    ],
    "faqs": [
      {
        "question": "What is a 'VOID' label?",
        "answer": "A VOID label is a tamper-evident security seal. If someone attempts to remove it, the adhesive separates from the face stock, leaving the word 'VOID' or a pattern on specific surface, alerting you to the breach."
      },
      {
        "question": "What are CAM Block labels?",
        "answer": "CAM Block labels are used to cover smartphone cameras in secure facilities. They are designed to be removed without leaving residue on the lens, but will show 'VOID' on the label itself if peeled back, indicating unauthorized photography attempts."
      }
    ],
    "slug": "tamper-evident-labels",
    "order": 7
  },
  {
    "title": "Barcode Label Printers",
    "subtitle": "Reliable Printing Solutions",
    "description": "High-performance barcode label printers for all your industrial and commercial labeling needs.",
    "heroImage": "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80",
    "subProducts": [],
    "specs": [
      { "label": "Type", "value": "Desktop / Industrial" },
      { "label": "Resolution", "value": "203 / 300 / 600 DPI" }
    ],
    "applications": ["Warehousing", "Retail", "Healthcare"],
    "sections": [
      {
        "heading": "Powering Your In-House Operations",
        "content": "<p>We don't just supply the labels; we supply the systems to print them. Our range of industrial and desktop barcode printers are selected for their reliability and ease of integration. Whether you need a compact printer for a retail counter or a rugged industrial engine for a 24/7 warehouse, we have the hardware to match your volume.</p>",
        "image": "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80",
        "imageAlt": "Industrial barcode printer in operation"
      }
    ],
    "faqs": [
      {
        "question": "Do I need a thermal transfer or direct thermal printer?",
        "answer": "It depends on your application. If your labels need to last a long time (hospitals, inventory), choose Thermal Transfer. If they are short-lived (shipping labels), Direct Thermal is more cost-effective as it requires no ribbon."
      },
      {
        "question": "Do you provide maintenance for these printers?",
        "answer": "Yes, we offer service contracts and can supply all necessary spare parts like print heads and platen rollers."
      }
    ],
    "slug": "barcode-label-printers",
    "order": 8
  }
];

const importData = async () => {
  try {
    await Service.deleteMany();
    await Service.insertMany(servicesData);
    console.log('Full Services Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(`${err}`.red.inverse);
    process.exit(1);
  }
};

importData();

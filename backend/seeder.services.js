const mongoose = require('mongoose');
const dotenv = require('dotenv');
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
      { "title": "Jewelry Tags / Labels", "desc": "Elegant, high-durability tags designed for the luxury retail sector.", "image": "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80" },
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
    "order": 1
  },
  {
    "title": "Specialty Labels",
    "subtitle": "Custom Engineering for Unique Branding Challenges",
    "description": "Beyond standard labeling, our specialty division creates bespoke solutions that combine advanced material science with innovative design for functional excellence.",
    "heroImage": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2600&auto=format&fit=crop",
    "subProducts": [
      { "title": "Reverse Printed Labels", "desc": "Graphics protected under the surface for extreme abrasion resistance.", "image": "https://images.unsplash.com/photo-1626606650460-d2506c8914f6?auto=format&fit=crop&q=80" },
      { "title": "Polycarbonate Overlays", "desc": "Durable overlays for control panels and industrial instrumentation.", "image": "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80" },
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
    "order": 2
  },
  {
    "title": "Automotive & Durable Goods",
    "subtitle": "Engineered to Outlast the Lifecycle",
    "description": "Labels that withstand the rigors of the automotive industry—heat, oil, grime, and time. Ensure critical information stays attached for the life of the part.",
    "heroImage": "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2600&auto=format&fit=crop",
    "subProducts": [
      { "title": "Tyre Labels", "desc": "Aggressive adhesives designed to stick to rough rubber surfaces." },
      { "title": "Asset Tracking Labels", "desc": "Heavy-duty tracking for machinery and industrial assets." },
      { "title": "Drum / Barrel Labels", "desc": "BS5609 certified for chemical transport in harsh marine environments." },
      { "title": "High Temperature Labels", "desc": "Withstands engine heat and industrial curing processes." },
      { "title": "Lubricant Oil Labels", "desc": "Oil and grease resistant branding for the petrochemical sector." },
      { "title": "OEM Automotive Labels", "desc": "Compliant with international automotive parts identification standards." }
    ],
    "specs": [
      { "label": "Temperatures", "value": "Up to 300°C" },
      { "label": "Resistance", "value": "Oil, Grime, UV, Salt water" },
      { "label": "Certification", "value": "IATF 16949 / BS5609" },
      { "label": "Adhesive", "value": "Vulcanizing Rubber-based" }
    ],
    "applications": ["Automotive Engines", "Chemical Drums", "Asset Management", "Heavy Machinery"],
    "order": 3
  }
];

const importData = async () => {
  try {
    await Service.deleteMany();
    await Service.insertMany(servicesData);
    console.log('Services Sample Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

importData();

/**
 * POWERRENT - GENERATOR FLEET DATA & UTILITIES (generator.js)
 * Full fleet specifications for all capacity tiers
 */

const GENERATOR_FLEET = [
  {
    id: "gen-10kva",
    name: "VoltMaster 10kVA Inverter Generator",
    model: "VM-10i-Ultra",
    capacity: 10,
    category: "5-20",
    categoryLabel: "5–20 kVA",
    fuelType: "Ultra-Clean Diesel",
    powerOutput: "8.0 kW / 10 kVA Prime",
    fuelConsumption: "2.1 L/hr @ 75% Load",
    noiseLevel: "58 dB(A) @ 7m (Super Silent)",
    voltage: "230V / 400V 3-Phase",
    frequency: "50/60 Hz Switchable",
    tankCapacity: "45 Liters",
    dimensions: "1,150 x 720 x 890 mm",
    weight: "285 kg",
    dailyPrice: 65,
    weeklyPrice: 390,
    monthlyPrice: 1450,
    securityDeposit: 300,
    deliveryFee: 45,
    status: "Available",
    shortDesc: "Compact, whisper-quiet portable diesel generator engineered for outdoor events, film productions, and residential backup.",
    longDesc: "The VoltMaster 10kVA is the pinnacle of whisper-quiet portable power. Housed in a sound-attenuated acoustic canopy with multi-density sound baffles, it delivers pure sine wave power suitable for sensitive electronic equipment, broadcast gear, and delicate domestic appliances.",
    features: [
      "Pure sine wave inverter output (THD < 2.5%)",
      "Acoustic weather-proof canopy with sound dampening",
      "Electric key start and ATS auto-start ready",
      "Integrated heavy-duty transport wheel kit",
      "Digital multi-meter (Voltage, Frequency, Hours)"
    ],
    technicalSpecs: {
      "Engine": "Yanmar 2TNV70-H Liquid-Cooled Diesel",
      "Alternator": "Stamford Brushless Synchro",
      "Cooling": "Closed Water Cooled with Radiator",
      "Governor": "Electronic Isochronous",
      "Emissions": "EPA Tier 4 Final / EU Stage V"
    },
    primaryImage: "assets/images/generators/gen-5-20-1.jpg",
    gallery: [
      "assets/images/generators/gen-5-20-1.jpg",
      "assets/images/generators/gen-5-20-2.jpg",
      "assets/images/hero/hero-home-1.jpg"
    ]
  },
  {
    id: "gen-18kva",
    name: "EcoPower 18kVA Canopy Diesel",
    model: "EP-18D-Canopy",
    capacity: 18,
    category: "5-20",
    categoryLabel: "5–20 kVA",
    fuelType: "Diesel / HVO Ready",
    powerOutput: "14.4 kW / 18 kVA Standby",
    fuelConsumption: "3.4 L/hr @ 75% Load",
    noiseLevel: "62 dB(A) @ 7m",
    voltage: "400V / 230V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "65 Liters",
    dimensions: "1,450 x 850 x 1,050 mm",
    weight: "490 kg",
    dailyPrice: 95,
    weeklyPrice: 570,
    monthlyPrice: 2100,
    securityDeposit: 400,
    deliveryFee: 55,
    status: "Available",
    shortDesc: "Rugged canopy diesel generator ideal for small construction sites, commercial workshops, and telecom tower backup.",
    longDesc: "Engineered for unyielding reliability in harsh environments. Features an industrial grade powder-coated steel enclosure with fork pockets and single-point lifting eye for easy deployment across construction sites and urban utility works.",
    features: [
      "Deep Sea Electronics (DSE) digital controller",
      "Lockable fuel filler cap and emergency stop button",
      "110% bunded base prevents site fluid contamination",
      "Low oil pressure and high coolant temperature protection"
    ],
    technicalSpecs: {
      "Engine": "Perkins 403D-15G Diesel",
      "Alternator": "Leroy Somer TAL-A40-C",
      "Cooling": "Heavy Duty Tropical Radiator",
      "Governor": "Mechanical +/- 1.5%",
      "Emissions": "EU Stage III-A"
    },
    primaryImage: "assets/images/generators/gen-5-20-2.jpg",
    gallery: [
      "assets/images/generators/gen-5-20-2.jpg",
      "assets/images/generators/gen-5-20-1.jpg"
    ]
  },
  {
    id: "gen-35kva",
    name: "TitanPower 35kVA Commercial Silent",
    model: "TP-35CS-Pro",
    capacity: 35,
    category: "25-50",
    categoryLabel: "25–50 kVA",
    fuelType: "Ultra-Low Sulfur Diesel",
    powerOutput: "28 kW / 35 kVA Prime",
    fuelConsumption: "5.8 L/hr @ 75% Load",
    noiseLevel: "64 dB(A) @ 7m",
    voltage: "415V / 240V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "120 Liters (24hr Base Tank)",
    dimensions: "1,850 x 950 x 1,220 mm",
    weight: "880 kg",
    dailyPrice: 140,
    weeklyPrice: 840,
    monthlyPrice: 2950,
    securityDeposit: 600,
    deliveryFee: 75,
    status: "Available",
    shortDesc: "Robust standby generator with 24-hour continuous run base tank for commercial centers, clinics, and medium construction sites.",
    longDesc: "TitanPower 35CS delivers uninterrupted continuous duty performance. Equipped with a high-capacity internal fuel tank allowing full 24-hour autonomy without refilling. Features comprehensive telemetry for remote fuel and load monitoring.",
    features: [
      "24-Hour continuous internal fuel reservoir",
      "Integrated automatic transfer switch (ATS) interface",
      "Galvanized anti-corrosion acoustic canopy",
      "Quick-connect power terminal board and CEE sockets"
    ],
    technicalSpecs: {
      "Engine": "Deutz F4M2011 4-Cylinder Air-Oil Cooled",
      "Alternator": "Mecc Alte ECP32-2S4",
      "Cooling": "Oil/Air Cooled",
      "Governor": "Electronic Precise",
      "Emissions": "Stage V Compliant"
    },
    primaryImage: "assets/images/generators/gen-25-50-1.jpg",
    gallery: [
      "assets/images/generators/gen-25-50-1.jpg",
      "assets/images/generators/gen-25-50-2.jpg"
    ]
  },
  {
    id: "gen-45kva",
    name: "Perkins 45kVA Heavy Standby Unit",
    model: "PK-45-Stnd",
    capacity: 45,
    category: "25-50",
    categoryLabel: "25–50 kVA",
    fuelType: "Industrial Diesel",
    powerOutput: "36 kW / 45 kVA Prime",
    fuelConsumption: "7.2 L/hr @ 75% Load",
    noiseLevel: "65 dB(A) @ 7m",
    voltage: "400V / 230V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "150 Liters",
    dimensions: "2,050 x 1,000 x 1,300 mm",
    weight: "1,050 kg",
    dailyPrice: 175,
    weeklyPrice: 1050,
    monthlyPrice: 3500,
    securityDeposit: 750,
    deliveryFee: 85,
    status: "Available",
    shortDesc: "High-torque Perkins-powered workhorse for cold storage warehouses, event lighting rigs, and emergency utility grids.",
    longDesc: "The Perkins 45kVA generator provides exceptional motor starting capabilities and rapid block-loading performance. Built to operate continuously under intense summer temperatures without thermal derating.",
    features: [
      "Genuine Perkins industrial 1100 series engine",
      "Automated engine pre-heater for instant sub-zero starting",
      "Full instrumentation with fault history logs",
      "Double access doors for rapid maintenance access"
    ],
    technicalSpecs: {
      "Engine": "Perkins 1103A-33TG1 Turbocharged",
      "Alternator": "Stamford PI144J",
      "Cooling": "Water cooled with 50°C radiator",
      "Governor": "Mechanical",
      "Emissions": "Tier 3 / Stage IIIA"
    },
    primaryImage: "assets/images/generators/gen-25-50-2.jpg",
    gallery: [
      "assets/images/generators/gen-25-50-2.jpg",
      "assets/images/generators/gen-25-50-1.jpg"
    ]
  },
  {
    id: "gen-80kva",
    name: "Cummins 80kVA Industrial Power",
    model: "C80-D5-Silent",
    capacity: 80,
    category: "60-100",
    categoryLabel: "60–100 kVA",
    fuelType: "Diesel / Bio-Diesel Blend",
    powerOutput: "64 kW / 80 kVA Prime",
    fuelConsumption: "13.2 L/hr @ 75% Load",
    noiseLevel: "66 dB(A) @ 7m",
    voltage: "415V / 240V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "240 Liters",
    dimensions: "2,450 x 1,080 x 1,520 mm",
    weight: "1,550 kg",
    dailyPrice: 240,
    weeklyPrice: 1440,
    monthlyPrice: 4800,
    securityDeposit: 1000,
    deliveryFee: 110,
    status: "Available",
    shortDesc: "Industry-standard Cummins prime power unit for heavy manufacturing lines, large concrete batching plants, and hospitals.",
    longDesc: "Powered by the globally celebrated Cummins 4BTA3.9 engine, this unit delivers rock-solid frequency stability and minimal harmonic distortion. Suitable for multi-story office buildings, shopping complexes, and industrial process lines.",
    features: [
      "Cummins PowerCommand 1.1 microprocessor controller",
      "Main line circuit breaker with overload trip protection",
      "Industrial residential exhaust silencer inside enclosure",
      "Automatic battery charger and heavy-duty starting batteries"
    ],
    technicalSpecs: {
      "Engine": "Cummins 4BTA3.9-G2 Turbo-intercooled",
      "Alternator": "Stamford UCI224F",
      "Cooling": "Tropical radiator 50°C ambient",
      "Governor": "Electronic GAC",
      "Emissions": "Stage IIIA"
    },
    primaryImage: "assets/images/generators/gen-60-100-1.jpg",
    gallery: [
      "assets/images/generators/gen-60-100-1.jpg",
      "assets/images/generators/gen-60-100-2.jpg"
    ]
  },
  {
    id: "gen-100kva",
    name: "Volvo Penta 100kVA Ultra-Quiet",
    model: "VP-100-Quiet",
    capacity: 100,
    category: "60-100",
    categoryLabel: "60–100 kVA",
    fuelType: "Ultra-Low Sulfur Diesel",
    powerOutput: "80 kW / 100 kVA Prime",
    fuelConsumption: "16.8 L/hr @ 75% Load",
    noiseLevel: "63 dB(A) @ 7m (Super Acoustic)",
    voltage: "400V / 230V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "310 Liters",
    dimensions: "2,650 x 1,120 x 1,600 mm",
    weight: "1,820 kg",
    dailyPrice: 290,
    weeklyPrice: 1740,
    monthlyPrice: 5600,
    securityDeposit: 1200,
    deliveryFee: 125,
    status: "Available",
    shortDesc: "Super-silent premium generator engineered specifically for sound-sensitive metropolitan events and outdoor film sets.",
    longDesc: "When low noise is non-negotiable, the Volvo Penta 100kVA sets the benchmark. Operating at just 63 dB(A) at 7 meters, it can sit adjacent to concert stages, film recording zones, or residential luxury estates without disruption.",
    features: [
      "Double sound insulation walls with acoustic rockwool",
      "Electronic Volvo EMS common-rail injection engine",
      "Low emission exhaust with optional particulate filter",
      "Multi-voltage distribution board with individual RCD breakers"
    ],
    technicalSpecs: {
      "Engine": "Volvo Penta TAD531GE",
      "Alternator": "Leroy Somer TAL044D",
      "Cooling": "Fan-driven high-capacity radiator",
      "Governor": "Volvo Electronic Engine Management",
      "Emissions": "EU Stage IIIA / EPA Tier 3"
    },
    primaryImage: "assets/images/generators/gen-60-100-2.jpg",
    gallery: [
      "assets/images/generators/gen-60-100-2.jpg",
      "assets/images/generators/gen-60-100-1.jpg"
    ]
  },
  {
    id: "gen-150kva",
    name: "CAT 150kVA Heavy Duty Diesel",
    model: "CAT-C7.1-150",
    capacity: 150,
    category: "125-250",
    categoryLabel: "125–250 kVA",
    fuelType: "Diesel / HVO",
    powerOutput: "120 kW / 150 kVA Prime",
    fuelConsumption: "24.5 L/hr @ 75% Load",
    noiseLevel: "68 dB(A) @ 7m",
    voltage: "415V / 240V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "400 Liters",
    dimensions: "3,100 x 1,180 x 1,750 mm",
    weight: "2,350 kg",
    dailyPrice: 380,
    weeklyPrice: 2280,
    monthlyPrice: 7200,
    securityDeposit: 1600,
    deliveryFee: 160,
    status: "Available",
    shortDesc: "Caterpillar heavy equipment standard for bridge construction, quarry sites, and infrastructure development projects.",
    longDesc: "The CAT C7.1 delivers legendary durability with high transient load pickup. Tailored for heavy inductive loads like tower cranes, large submersible dewatering pumps, and stone crushers.",
    features: [
      "EMCP 4.2B digital control and diagnostic suite",
      "Heavy gauge steel construction with corrosion-resistant finish",
      "Dual fuel filter with water separator sensors",
      "Externally accessible emergency stop and oil drain valves"
    ],
    technicalSpecs: {
      "Engine": "Caterpillar C7.1 ACERT Inline-6",
      "Alternator": "Cat LC3114F Brushless",
      "Cooling": "High ambient radiator system",
      "Governor": "ADEM A4 Electronic",
      "Emissions": "Tier 4 Interim / EU Stage IIIB"
    },
    primaryImage: "assets/images/generators/gen-125-250-1.jpg",
    gallery: [
      "assets/images/generators/gen-125-250-1.jpg",
      "assets/images/generators/gen-125-250-2.jpg"
    ]
  },
  {
    id: "gen-250kva",
    name: "Cummins 250kVA Prime Powerhouse",
    model: "C250-D5-Power",
    capacity: 250,
    category: "125-250",
    categoryLabel: "125–250 kVA",
    fuelType: "Industrial Diesel",
    powerOutput: "200 kW / 250 kVA Prime",
    fuelConsumption: "41.0 L/hr @ 75% Load",
    noiseLevel: "69 dB(A) @ 7m",
    voltage: "400V / 230V 3-Phase",
    frequency: "50/60 Hz Switchable",
    tankCapacity: "600 Liters",
    dimensions: "3,650 x 1,280 x 1,950 mm",
    weight: "3,400 kg",
    dailyPrice: 520,
    weeklyPrice: 3120,
    monthlyPrice: 9800,
    securityDeposit: 2200,
    deliveryFee: 200,
    status: "Available",
    shortDesc: "Prime power champion for large data centres, airport taxiway construction, and high-rise developments.",
    longDesc: "When a project demand exceeds standard commercial power, the Cummins 250kVA provides a continuous, highly stable source of electricity. Equipped with PowerCommand paralleling controller, this unit can effortlessly synchronize with other units.",
    features: [
      "Cummins PowerCommand 2.3 controller with auto-synchronization",
      "High capacity 600L double-wall bunded fuel cell",
      "Motorized 4-pole circuit breaker with shunt trip",
      "Integrated battery trickle charger and coolant pre-heating"
    ],
    technicalSpecs: {
      "Engine": "Cummins 6LTAA8.9-G2 Heavy 6-Cylinder",
      "Alternator": "Stamford UCDI274K",
      "Cooling": "Tropical radiator 50°C rating",
      "Governor": "Electronic Cummins ECM",
      "Emissions": "Stage IIIA / Tier 3"
    },
    primaryImage: "assets/images/generators/gen-125-250-2.jpg",
    gallery: [
      "assets/images/generators/gen-125-250-2.jpg",
      "assets/images/generators/gen-125-250-1.jpg"
    ]
  },
  {
    id: "gen-350kva",
    name: "Kohler 350kVA Synchronized System",
    model: "KD-350-Sync",
    capacity: 350,
    category: "300-500",
    categoryLabel: "300–500 kVA",
    fuelType: "Ultra-Clean Diesel",
    powerOutput: "280 kW / 350 kVA Prime",
    fuelConsumption: "56.5 L/hr @ 75% Load",
    noiseLevel: "71 dB(A) @ 7m",
    voltage: "415V / 240V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "850 Liters",
    dimensions: "4,200 x 1,450 x 2,150 mm",
    weight: "4,600 kg",
    dailyPrice: 720,
    weeklyPrice: 4320,
    monthlyPrice: 13500,
    securityDeposit: 3000,
    deliveryFee: 280,
    status: "Available",
    shortDesc: "High-spec synchronized standby system for regional hospitals, pharmaceutical plants, and industrial complexes.",
    longDesc: "Kohler KD-Series incorporates state-of-the-art French-engineered diesel technology with digital excitation control. Features parallel bus connections for building scalable multi-megawatt microgrids on demand.",
    features: [
      "Kohler APM802 12-inch color touchscreen controller",
      "Full load step acceptance within 10 seconds (NFPA 110)",
      "Redundant starting batteries and dual starter motors",
      "External fuel three-way valve for auxiliary bulk fuel farm"
    ],
    technicalSpecs: {
      "Engine": "Kohler KD12V15 Turbocharged & Intercooled",
      "Alternator": "Kohler Fast-Response II PMG",
      "Cooling": "Unit mounted radiator with fan drive",
      "Governor": "Electronic ECM",
      "Emissions": "Tier 4 Final Compliant"
    },
    primaryImage: "assets/images/generators/gen-300-500-1.jpg",
    gallery: [
      "assets/images/generators/gen-300-500-1.jpg",
      "assets/images/generators/gen-300-500-2.jpg"
    ]
  },
  {
    id: "gen-500kva",
    name: "CAT 500kVA Heavy Containerized",
    model: "CAT-C15-500",
    capacity: 500,
    category: "300-500",
    categoryLabel: "300–500 kVA",
    fuelType: "Heavy Diesel",
    powerOutput: "400 kW / 500 kVA Prime",
    fuelConsumption: "79.0 L/hr @ 75% Load",
    noiseLevel: "72 dB(A) @ 7m",
    voltage: "400V / 230V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "1,100 Liters",
    dimensions: "4,800 x 1,600 x 2,350 mm",
    weight: "5,800 kg",
    dailyPrice: 950,
    weeklyPrice: 5700,
    monthlyPrice: 17800,
    securityDeposit: 4000,
    deliveryFee: 350,
    status: "Rented",
    shortDesc: "Mega-scale power plant in a compact acoustic container for major tunnel excavations and municipal emergency support.",
    longDesc: "The Caterpillar C15 containerized generator represents industrial brute force combined with refined electronics. It provides instant block-load recovery for heavy mining, tunneling ventilation, and civil infrastructure.",
    features: [
      "ISO 20ft CSC plated acoustic container with motorized louvers",
      "Internal fire suppression system and gas detection",
      "Dual element air cleaners and heavy-duty fuel filtration",
      "Power lock camlock connection panels for rapid termination"
    ],
    technicalSpecs: {
      "Engine": "Cat C15 ATAAC Twin Turbocharged Diesel",
      "Alternator": "Cat SR4B Brushless",
      "Cooling": "Engine mounted radiator",
      "Governor": "Cat ADEM Electronic",
      "Emissions": "Stage IIIA / Tier 3"
    },
    primaryImage: "assets/images/generators/gen-300-500-2.jpg",
    gallery: [
      "assets/images/generators/gen-300-500-2.jpg",
      "assets/images/generators/gen-300-500-1.jpg"
    ]
  },
  {
    id: "gen-750kva",
    name: "MTU 750kVA MegaStation",
    model: "MTU-12V2000-750",
    capacity: 750,
    category: "above-500",
    categoryLabel: "Above 500 kVA",
    fuelType: "Ultra-Clean Diesel / HVO",
    powerOutput: "600 kW / 750 kVA Prime",
    fuelConsumption: "118.0 L/hr @ 75% Load",
    noiseLevel: "74 dB(A) @ 7m",
    voltage: "415V / 240V 3-Phase",
    frequency: "50 Hz",
    tankCapacity: "1,500 Liters",
    dimensions: "5,800 x 2,100 x 2,600 mm",
    weight: "7,900 kg",
    dailyPrice: 1350,
    weeklyPrice: 8100,
    monthlyPrice: 24500,
    securityDeposit: 5500,
    deliveryFee: 500,
    status: "Available",
    shortDesc: "Mission-critical sub-station replacement generator for financial hubs, tier-3/4 data centers, and oil & gas terminals.",
    longDesc: "Engineered by Rolls-Royce Power Systems, the MTU 12V2000 generator sets the world standard for mission-critical reliability. Built to operate indefinitely as an independent utility-grade power generation station.",
    features: [
      "Full digital ADEC engine management with smart diagnostics",
      "Permanent magnet generator (PMG) excitation for 300% short-circuit sustained current",
      "Custom acoustic acoustic container with CSC certification",
      "Multi-point motorized breakers and sync bus system"
    ],
    technicalSpecs: {
      "Engine": "MTU 12V2000G26F 12-Cylinder 90-degree Vee",
      "Alternator": "Leroy Somer LSA49.3",
      "Cooling": "Remote radiator with variable speed EC fans",
      "Governor": "ADEC Electronic",
      "Emissions": "EPA Tier 2 / Stage II"
    },
    primaryImage: "assets/images/generators/gen-above-500-1.jpg",
    gallery: [
      "assets/images/generators/gen-above-500-1.jpg",
      "assets/images/generators/gen-above-500-2.jpg"
    ]
  },
  {
    id: "gen-1250kva",
    name: "Cummins 1250kVA Grid Container Unit",
    model: "QSK50-G4-1250",
    capacity: 1250,
    category: "above-500",
    categoryLabel: "Above 500 kVA",
    fuelType: "Heavy Duty Diesel",
    powerOutput: "1,000 kW / 1,250 kVA Prime",
    fuelConsumption: "198.0 L/hr @ 75% Load",
    noiseLevel: "75 dB(A) @ 7m",
    voltage: "400V / 230V or Medium Voltage (11kV)",
    frequency: "50/60 Hz Switchable",
    tankCapacity: "2,200 Liters Base + Bulk Farm Feed",
    dimensions: "6,058 x 2,438 x 2,896 mm (20ft ISO)",
    weight: "11,500 kg",
    dailyPrice: 1950,
    weeklyPrice: 11700,
    monthlyPrice: 34500,
    securityDeposit: 8000,
    deliveryFee: 750,
    status: "Available",
    shortDesc: "Utility-scale containerized power plant capable of powering entire manufacturing complexes and emergency town grids.",
    longDesc: "The pinnacle of mobile power. Built within a standard 20ft heavy-duty ISO maritime container, this 1,250 kVA power plant delivers one megawatt of prime power wherever required on the planet. Fully equipped for parallel operation to form multi-megawatt power stations.",
    features: [
      "20-foot ISO CSC containerized package with heavy sound insulation",
      "Cummins PowerCommand 3.3 paralleling master control panel",
      "External fuel transfer pump and automated level sensors",
      "Dual redundant starter systems (electric and pneumatic options)"
    ],
    technicalSpecs: {
      "Engine": "Cummins QSK50-G4 16-Cylinder V-Configuration",
      "Alternator": "Stamford PI734C",
      "Cooling": "High-efficiency vertical roof-mounted radiator",
      "Governor": "Cummins Quantum Electronic Control",
      "Emissions": "EPA Tier 2 / Stage II"
    },
    primaryImage: "assets/images/generators/gen-above-500-2.jpg",
    gallery: [
      "assets/images/generators/gen-above-500-2.jpg",
      "assets/images/generators/gen-above-500-1.jpg"
    ]
  }
];

// Helper functions
function getAllGenerators() {
  return GENERATOR_FLEET;
}

function getGeneratorById(id) {
  if (!id) return GENERATOR_FLEET[0];
  return GENERATOR_FLEET.find(g => g.id === id) || GENERATOR_FLEET[0];
}

function getFeaturedGenerators(limit = 6) {
  return GENERATOR_FLEET.slice(0, limit);
}

function getGeneratorsByCategory(category) {
  if (!category || category === 'all') return GENERATOR_FLEET;
  return GENERATOR_FLEET.filter(g => g.category === category);
}

function getRelatedGenerators(currentId, limit = 3) {
  return GENERATOR_FLEET.filter(g => g.id !== currentId).slice(0, limit);
}

window.PowerRentFleet = {
  fleet: GENERATOR_FLEET,
  getAll: getAllGenerators,
  getById: getGeneratorById,
  getFeatured: getFeaturedGenerators,
  getByCategory: getGeneratorsByCategory,
  getRelated: getRelatedGenerators
};

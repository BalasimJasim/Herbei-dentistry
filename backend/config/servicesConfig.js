export const SPECIALIZATIONS = {
  CONSULTATION: 'consultation',
  OPERATIVE: 'operative',
  ORTHOPEDIC: 'orthopedic',
  ORTHODONTIC: 'orthodontic',
  PEDIATRIC: 'pediatric',
  SURGICAL: 'surgical'
}

export const SERVICES = [
  // Consultation Cabinet (1)
  {
    id: 'initial-consultation',
    name: 'Initial Consultation',
    price: 50,
    duration: 30,
    cabinetNumber: 1,
    specialization: SPECIALIZATIONS.CONSULTATION,
    description: 'Comprehensive first-time dental examination and treatment planning'
  },
  {
    id: 'emergency-consultation',
    name: 'Emergency Consultation',
    price: 75,
    duration: 30,
    cabinetNumber: 1,
    specialization: SPECIALIZATIONS.CONSULTATION,
    description: 'Urgent dental care for pain relief and emergency situations'
  },
  {
    id: 'followup-consultation',
    name: 'Follow-up Consultation',
    price: 40,
    duration: 20,
    cabinetNumber: 1,
    specialization: SPECIALIZATIONS.CONSULTATION,
    description: 'Follow-up visit to check treatment progress'
  },

  // Operative Dentistry (Cabinets 2 & 3)
  {
    id: 'root-canal-simple',
    name: 'Simple Root Canal Treatment',
    price: 300,
    duration: 90,
    cabinetNumber: 2,
    specialization: SPECIALIZATIONS.OPERATIVE,
    description: 'Root canal treatment for front teeth or premolars'
  },
  {
    id: 'composite-filling',
    name: 'Composite Filling',
    price: 120,
    duration: 60,
    cabinetNumber: 2,
    specialization: SPECIALIZATIONS.OPERATIVE,
    description: 'Tooth-colored filling for cavities'
  },
  {
    id: 'deep-cleaning',
    name: 'Deep Cleaning & Scaling',
    price: 150,
    duration: 60,
    cabinetNumber: 2,
    specialization: SPECIALIZATIONS.OPERATIVE,
    description: 'Deep cleaning and tartar removal'
  },

  // Orthopedic Services (Cabinet 4)
  {
    id: 'crown-preparation',
    name: 'Crown Preparation',
    price: 400,
    duration: 90,
    cabinetNumber: 4,
    specialization: SPECIALIZATIONS.ORTHOPEDIC,
    description: 'Preparation and temporary crown fitting'
  },
  {
    id: 'bridge-work',
    name: 'Dental Bridge',
    price: 800,
    duration: 120,
    cabinetNumber: 4,
    specialization: SPECIALIZATIONS.ORTHOPEDIC,
    description: 'Fixed bridge installation for missing teeth'
  },
  {
    id: 'dentures-fitting',
    name: 'Dentures Fitting',
    price: 600,
    duration: 90,
    cabinetNumber: 4,
    specialization: SPECIALIZATIONS.ORTHOPEDIC,
    description: 'Complete or partial dentures fitting and adjustment'
  },
  {
    id: 'crown-placement',
    name: 'Crown Placement',
    price: 300,
    duration: 60,
    cabinetNumber: 4,
    specialization: SPECIALIZATIONS.ORTHOPEDIC,
    description: 'Permanent crown placement and adjustment'
  },

  // Orthodontics & Pediatric (Cabinet 5)
  {
    id: 'orthodontic-consultation',
    name: 'Orthodontic Consultation',
    duration: 45,
    cabinetNumber: 5,
    specialization: SPECIALIZATIONS.ORTHODONTIC,
    description: 'Initial consultation for orthodontic treatment'
  },
  {
    id: 'braces-adjustment',
    name: 'Braces Adjustment',
    duration: 30,
    cabinetNumber: 5,
    specialization: SPECIALIZATIONS.ORTHODONTIC,
    description: 'Regular adjustment of braces'
  },
  {
    id: 'child-exam',
    name: 'Children\'s Dental Exam',
    price: 45,
    duration: 30,
    cabinetNumber: 5,
    specialization: SPECIALIZATIONS.PEDIATRIC,
    description: 'Gentle dental examination for children'
  },
  {
    id: 'child-cleaning',
    name: 'Children\'s Teeth Cleaning',
    price: 70,
    duration: 45,
    cabinetNumber: 5,
    specialization: SPECIALIZATIONS.PEDIATRIC,
    description: 'Professional cleaning and fluoride treatment for children'
  },
  {
    id: 'sealants',
    name: 'Dental Sealants',
    price: 40,
    duration: 30,
    cabinetNumber: 5,
    specialization: SPECIALIZATIONS.PEDIATRIC,
    description: 'Protective sealants for children\'s teeth'
  },
  {
    id: 'space-maintainer',
    name: 'Space Maintainer',
    price: 200,
    duration: 45,
    cabinetNumber: 5,
    specialization: SPECIALIZATIONS.PEDIATRIC,
    description: 'Space maintainer placement for premature tooth loss'
  },

  // Surgery Services (Cabinet 6)
  {
    id: 'tooth-extraction',
    name: 'Simple Tooth Extraction',
    price: 150,
    duration: 45,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Simple tooth extraction procedure'
  },
  {
    id: 'surgical-extraction',
    name: 'Surgical Extraction',
    price: 300,
    duration: 60,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Complex surgical tooth extraction'
  },
  {
    id: 'wisdom-teeth',
    name: 'Wisdom Teeth Removal',
    price: 350,
    duration: 90,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Surgical removal of wisdom teeth'
  },
  {
    id: 'dental-implant',
    name: 'Dental Implant',
    price: 1200,
    duration: 120,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Single tooth implant placement'
  },
  {
    id: 'dental-implant-consultation',
    name: 'Implant Consultation',
    duration: 45,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Initial consultation and planning for dental implants'
  },
  {
    id: 'single-implant',
    name: 'Single Dental Implant',
    duration: 120,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Single tooth implant placement surgery'
  },
  {
    id: 'multiple-implants',
    name: 'Multiple Dental Implants',
    duration: 180,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Multiple teeth implant placement surgery'
  },
  {
    id: 'full-arch-implants',
    name: 'Full Arch Dental Implants',
    duration: 240,
    cabinetNumber: 6,
    specialization: SPECIALIZATIONS.SURGICAL,
    description: 'Full arch implant-supported restoration'
  }
]

export const CABINETS = {
  1: { name: 'Consultation Room', category: 'consultation' },
  2: { name: 'Operative Dentistry 1', category: 'operative' },
  3: { name: 'Operative Dentistry 2', category: 'operative' },
  4: { name: 'Orthopedic Room', category: 'orthopedic' },
  5: { name: 'Orthodontics & Pediatric', category: 'orthodontic-pediatric' },
  6: { name: 'Surgery Room', category: 'surgery' }
}

export const SPECIALISTS = {
  "dr-smith": { name: "Dr. Smith", category: "consultation" },
  "dr-johnson": { name: "Dr. Johnson", category: "operative" },
  "dr-chen": { name: "Dr. Chen", category: "operative" },
  "dr-patel": { name: "Dr. Patel", category: "orthopedic" },
  "dr-kim": { name: "Dr. Kim", category: "orthodontic-pediatric" },
  "dr-garcia": { name: "Dr. Garcia", category: "surgery" },
}; 
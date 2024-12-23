export const SPECIALIZATIONS = {
  CONSULTATION: 'consultation',
  RESTORATIVE: 'restorative',
  PROSTHETIC: 'prosthetic',
  PEDIATRIC: 'pediatric',
  SURGERY: 'surgery'
};

export const CABINETS = [
  { number: 1, name: 'Consultation Room', specialization: SPECIALIZATIONS.CONSULTATION },
  { number: 2, name: 'Restorative Room 1', specialization: SPECIALIZATIONS.RESTORATIVE },
  { number: 3, name: 'Restorative Room 2', specialization: SPECIALIZATIONS.RESTORATIVE },
  { number: 4, name: 'Prosthetic Room', specialization: SPECIALIZATIONS.PROSTHETIC },
  { number: 5, name: 'Pediatric Room', specialization: SPECIALIZATIONS.PEDIATRIC },
  { number: 6, name: 'Surgery Room', specialization: SPECIALIZATIONS.SURGERY }
];

export const SERVICES = [
  {
    id: 'consultation',
    name: 'Dental Consultation',
    duration: 30,
    specialization: SPECIALIZATIONS.CONSULTATION
  },
  {
    id: 'cleaning',
    name: 'Dental Cleaning',
    duration: 60,
    specialization: SPECIALIZATIONS.RESTORATIVE
  },
  {
    id: 'filling',
    name: 'Dental Filling',
    duration: 60,
    specialization: SPECIALIZATIONS.RESTORATIVE
  },
  {
    id: 'crown',
    name: 'Crown Fitting',
    duration: 90,
    specialization: SPECIALIZATIONS.PROSTHETIC
  },
  {
    id: 'pediatric-checkup',
    name: 'Pediatric Checkup',
    duration: 45,
    specialization: SPECIALIZATIONS.PEDIATRIC
  },
  {
    id: 'tooth-extraction',
    name: 'Tooth Extraction',
    duration: 60,
    specialization: SPECIALIZATIONS.SURGERY
  }
]; 
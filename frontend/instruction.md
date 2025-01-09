# Cursor AI Instructions

Consider the following file structure and requirements for fixing styling issues in a dental clinic website:

## Project Context
- Project: Dental clinic website
- Stack: MERN
- Styling: Minimalistic design, no Tailwind/Bootstrap
- Issue: Styling not working in production for appointment-related components unless imported directly in Main.jsx

## File Structure Focus
Key files with styling issues:
```
frontend/
└── src/
    ├── components/
    │   ├── portal/
    │   │   ├── AppointmentManagement.jsx
    │   │   ├── AppointmentViewModal.jsx
    │   │   └── EditAppointmentModal.jsx
    ├── pages/
    │   └── Appointments.jsx
    ├── styles/
    │   ├── global.css
    │   ├── layout.css
    │   └── variables.css
    ├── App.jsx
    └── main.jsx
```
complete file structure:

HERBIE/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   ├── services.js
│   │   ├── servicesConfig.js
│   │   ├── specialists.js
│   │   ├── validateCredentials.js
│   │   └── validateEnv.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   └── serviceController.js
│   ├── middleware/
│   │   ├── adminAuth.js
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   ├── sanitize.js
│   │   ├── validate.js
│   │   ├── validateRequest.js
│   │   └── validateResults.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Cabinet.js
│   │   ├── Service.js
│   │   ├── Specialist.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── appointments.js
│   │   ├── auth.js
│   │   └── services.js
│   ├── scripts/
│   │   ├── createAdmin.js
│   │   ├── initCabinets.js
│   │   └── initSpecialists.js
│   ├── services/
│   │   ├── appointmentService.js
│   │   ├── clinicCardService.js
│   │   ├── mockClinicCardService.js
│   │   └── notificationService.js
│   ├── utils/
│   │   ├── email.js
│   │   ├── emailTemplates.js
│   │   ├── sendSMS.js
│   │   └── testTwilio.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── Procfile
│   └── server.js
│
└── frontend/
    ├── dist/
    │   ├── assets/
    │   ├── locales/
    │   └── index.html
    ├── public/
    │   └── locales/
    │       ├── en/
    │       │   └── translation.json
    │       └── uk/
    │           └── translation.json
    ├── src/
    │   ├── api/
    │   │   ├── config.js
    │   │   └── services.js
    │   ├── assets/
    │   │   └── images/
    │   │       ├── doc.jpeg
    │   │       ├── english.jpg
    │   │       ├── founder.jpeg
    │   │       ├── interior.jpeg
    │   │       ├── logo.jpeg
    │   │       └── ukraine.jpg
    │   ├── components/
    │   │   ├── portal/
    │   │   │   ├── AppointmentManagement.jsx
    │   │   │   ├── AppointmentViewModal.jsx
    │   │   │   └── EditAppointmentModal.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── AppointmentCalendar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── LanguageSwitcher.jsx
    │   │   ├── Navbar.jsx
    │   │   └── TeamMember.jsx
    │   ├── contexts/
    │   │   ├── AppointmentContext.jsx
    │   │   └── AuthContext.jsx
    │   ├── i18n/
    │   │   └── i18n.js
    │   ├── pages/
    │   │   ├── education/
    │   │   │   ├── AllOnX.jsx
    │   │   │   ├── DentalImplants.jsx
    │   │   │   └── OralHygiene.jsx
    │   │   ├── About.jsx
    │   │   ├── Appointments.jsx
    │   │   ├── Contact.jsx
    │   │   ├── Home.jsx
    │   │   └── Services.jsx
    │   ├── providers/
    │   │   └── LanguageProvider.jsx
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── layout.css
    │   │   ├── rtl.css
    │   │   └── variables.css
    │   ├── utils/
    │   │   ├── axios.js
    │   │   ├── dateUtils.js
    │   │   └── rtl.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .env.development
    ├── .env.production
    ├── .gitignore
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── vercel.json
    
## Task Requirements
1. Fix styling issues in:
   - Appointments.jsx
   - AppointmentManagement.jsx
   - AppointmentViewModal.jsx
   - EditAppointmentModal.jsx

2. Maintain existing file structure - no new files needed
3. Keep minimalistic dental clinic design aesthetic
4. Ensure styles work in production build
5. Follow proper component import practices (avoid direct Main.jsx imports)

## Style Requirements
- Use semantic class names related to dental/medical domain
- Maintain consistent color scheme using CSS variables
- Keep styling minimal and professional
- Ensure responsive design for all components
- Maintain proper component hierarchy in styling

## Investigation Steps
1. Check the component import pattern in App.jsx and main.jsx
2. Review style import statements in affected components
3. Verify CSS module usage and naming conventions
4. Inspect build configuration in vite.config.js
5. Review style application in component hierarchy

## Fix Implementation
1. Update style imports
2. Modify component class assignments
3. Adjust vite configuration if needed
4. Test in both development and production
5. Verify lazy loading works with styles

When providing solutions:
- Use existing file structure
- Keep current component names
- Maintain MERN stack architecture
- Follow minimalistic design principles
- Ensure production build compatibility
- Consider component reusability
- Implement proper error handling
- Add console warnings for style loading issues
- Keep dental clinic context in mind

Your goal is to fix the styling issues while maintaining the current project structure and following best practices for a dental clinic website.
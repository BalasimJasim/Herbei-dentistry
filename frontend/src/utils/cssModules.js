// Register all CSS modules here
const pageModules = [
  "PatientPortal",
  "Appointments",
  // Add new pages here
];

// Automatically import all page modules
pageModules.forEach((page) => {
  import(`../pages/${page}.module.css`);
});

export const registeredModules = pageModules;

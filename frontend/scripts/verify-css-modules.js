import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcPath = path.resolve(__dirname, "../src");

// Required CSS modules - keep in sync with vite.config.js
const cssModules = [
  "pages/PatientPortal.module.css",
  "pages/Appointments.module.css",
  "pages/Contact.module.css",
  "components/portal/AppointmentManagement.module.css",
  "components/portal/AppointmentViewModal.module.css",
  "components/portal/EditAppointmentModal.module.css",
  "components/AppointmentForm.module.css",
];

// CSS patterns that must be present in each module
const requiredPatterns = {
  pages: [".container", ".heroSection"],
  components: [".formGroup", ".button"],
};

console.log("Verifying CSS modules...");

let hasError = false;

cssModules.forEach((modulePath) => {
  const fullPath = path.join(srcPath, modulePath);
  try {
    // Check file existence
    if (!fs.existsSync(fullPath)) {
      console.error(`❌ CSS module not found: ${modulePath}`);
      console.error(`   Expected at: ${fullPath}`);
      hasError = true;
      return;
    }

    // Check file content
    const content = fs.readFileSync(fullPath, "utf8");
    if (!content.trim()) {
      console.error(`❌ CSS module is empty: ${modulePath}`);
      hasError = true;
      return;
    }

    // Validate CSS module patterns
    const isPageModule = modulePath.startsWith("pages/");
    const patterns = isPageModule
      ? requiredPatterns.pages
      : requiredPatterns.components;

    const missingPatterns = patterns.filter(
      (pattern) => !content.includes(pattern)
    );
    if (missingPatterns.length > 0) {
      console.warn(
        `⚠️  Warning: ${modulePath} is missing recommended patterns:`
      );
      missingPatterns.forEach((pattern) => {
        console.warn(`   - ${pattern}`);
      });
    }

    // Check for potential CSS module syntax errors
    if (content.includes("{") && !content.includes("}")) {
      console.error(`❌ CSS module has unmatched brackets: ${modulePath}`);
      hasError = true;
      return;
    }

    console.log(`✓ Verified ${modulePath}`);
  } catch (error) {
    console.error(`Error verifying ${modulePath}:`, error);
    hasError = true;
  }
});

if (hasError) {
  console.error("\nCSS module verification failed");
  console.error("Please fix the above errors before building");
  throw new Error("CSS module verification failed");
} else {
  console.log("\nAll CSS modules verified successfully");
  console.log("Ready to build!");
}

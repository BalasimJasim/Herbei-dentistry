import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if all CSS modules are properly registered
const verifyModules = () => {
  const pagesDir = path.join(__dirname, "../src/pages");
  const mainFile = path.join(__dirname, "../src/main.jsx");

  const cssModules = fs
    .readdirSync(pagesDir)
    .filter((file) => file.endsWith(".module.css"));

  const mainContent = fs.readFileSync(mainFile, "utf8");

  cssModules.forEach((module) => {
    if (!mainContent.includes(module)) {
      console.warn(`Warning: ${module} is not registered in main.jsx`);
    }
  });
};

verifyModules();

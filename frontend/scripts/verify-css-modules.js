const fs = require("fs");
const path = require("path");

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

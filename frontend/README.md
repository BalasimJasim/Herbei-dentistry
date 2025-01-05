# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## CSS Modules

### Adding a New Page with CSS Modules

1. Create your page component (e.g., `NewPage.jsx`)
2. Create the corresponding CSS module (e.g., `NewPage.module.css`)
3. Register the CSS module in one of two ways:
   - Add import to `main.jsx`
   - Add page name to `utils/cssModules.js`

### Best Practices

- Always test production builds locally before deployment
- Use consistent naming for CSS modules (PageName.module.css)
- Keep CSS modules scoped to their components
- Register all page-level CSS modules centrally

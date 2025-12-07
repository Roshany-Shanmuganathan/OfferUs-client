/**
 * Global type declarations for CSS and other asset imports
 * This file is automatically included by TypeScript
 */

// CSS file imports (side-effect imports)
declare module '*.css' {
  // Side-effect import - CSS files are imported for their side effects only
}

// CSS Module imports (with class names)
declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

// SCSS file imports
declare module '*.scss' {
  // Side-effect import
}

// SCSS Module imports
declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}


/**
 * Type declarations for CSS imports
 * This allows TypeScript to recognize CSS file imports as valid modules
 * For side-effect imports (import "./file.css"), we declare them as empty modules
 */

declare module '*.css' {
  // Side-effect import - no exports needed
}

declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  // Side-effect import - no exports needed
}

declare module '*.module.scss' {
  const content: { [className: string]: string };
  export default content;
}


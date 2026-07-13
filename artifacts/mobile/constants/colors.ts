/**
 * Semantic design tokens for the mobile app.
 *
 * Palette for "Kelime Bulmaca" — a warm, playful word-building game for
 * young children (4-7). Colors are bright and saturated but built on a
 * soft cream base so the screen feels cozy, not overstimulating.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#3B2F63',
    tint: '#FF6F59',

    // Core surfaces
    background: '#FFF8EC',
    foreground: '#3B2F63',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#3B2F63',

    // Primary action color (buttons, links, active states)
    primary: '#FF6F59',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#3AB0FF',
    secondaryForeground: '#FFFFFF',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#FFE8CF',
    mutedForeground: '#B9A9D6',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#FFC93C',
    accentForeground: '#3B2F63',

    // Destructive actions (delete, error states)
    destructive: '#FF5A5F',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#F1D9B5',
    input: '#F1D9B5',

    // Game-specific tokens
    success: '#4CD787',
    successForeground: '#1F8A55',
  },

  // Border radius (in px). Generously rounded for a soft, toy-like feel.
  radius: 22,
};

export default colors;

import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiTheme =
  | 'royal-junge'       // Junge (Mythic Classical Serif), 14px Arch, Amber Gold & Amethyst
  | 'cyber-matrix'     // JetBrains Mono, 0px Sharp Brutalist, Phosphor Emerald
  | 'synthwave-neon'    // Orbitron / Space Grotesk, 4px Tech Chamfer, Electric Magenta & Cyan
  | 'obsidian-luxe'     // Plus Jakarta Sans, 10px Precision Bevel, Titanium & Icy Sky Blue
  | 'nebula-violet'     // Outfit, 22px Ultra-Organic Pill, Aurora Violet & Cosmic Pink
  | 'midnight-amoled';  // Space Grotesk, 6px True OLED Pitch Black, Pure Cyan Laser

export type UiLayout = 'standard-3panel' | 'dual-split' | 'zen-focus';

export interface ThemeConfig {
  id: UiTheme;
  name: string;
  category: string;
  accentColor: string;
  secondaryAccent: string;
  bgPreview: string;
  cardPreview: string;
  monacoTheme: 'vs-dark' | 'hc-black';
  badge: string;
  typography: string;
  shape: string;
  fontFamily: string;
  borderRadius: string;
  description: string;
}

export const THEME_PRESETS: Record<UiTheme, ThemeConfig> = {
  'obsidian-luxe': {
    id: 'obsidian-luxe',
    name: 'Obsidian Luxe',
    category: 'Executive Dark',
    accentColor: '#38bdf8',
    secondaryAccent: '#818cf8',
    bgPreview: '#08090b',
    cardPreview: '#10141c',
    monacoTheme: 'vs-dark',
    badge: 'DEFAULT • EXECUTIVE LINEAR',
    typography: 'Plus Jakarta Sans (Modern Neo-Grotesque)',
    shape: '10px Refined Precision Bevels & Matte Glass',
    fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
    borderRadius: '10px',
    description: 'Polished graphite titanium with crisp Plus Jakarta Sans typography and refined 10px subtle bevels'
  },
  'royal-junge': {
    id: 'royal-junge',
    name: 'Royal Junge',
    category: 'Mythic Dark',
    accentColor: '#fbbf24',
    secondaryAccent: '#c084fc',
    bgPreview: '#0a080c',
    cardPreview: '#15101a',
    monacoTheme: 'vs-dark',
    badge: 'CLASSICAL JUNGE',
    typography: 'Junge (Mythic Classical Serif)',
    shape: '14px Soft Aristocratic Arch & Gold Borders',
    fontFamily: "'Junge', serif",
    borderRadius: '14px',
    description: 'Mythic velvet obsidian with authentic Junge typography, warm amber gold accents and literary grace'
  },
  'cyber-matrix': {
    id: 'cyber-matrix',
    name: 'Cyber Matrix',
    category: 'Brutalist Hacker',
    accentColor: '#10b981',
    secondaryAccent: '#22d3ee',
    bgPreview: '#030704',
    cardPreview: '#07160a',
    monacoTheme: 'hc-black',
    badge: 'BRUTALIST TERMINAL',
    typography: 'JetBrains Mono (Hacker Monospace)',
    shape: '0px Sharp Brutalist / Zero Radius Squared',
    fontFamily: "'JetBrains Mono', monospace",
    borderRadius: '0px',
    description: 'Hard 0px brutalist edges, pure monospace typography, glowing phosphor green CRT scanlines'
  },
  'synthwave-neon': {
    id: 'synthwave-neon',
    name: 'Synthwave Neon',
    category: 'Retro Cyberpunk',
    accentColor: '#ec4899',
    secondaryAccent: '#06b6d4',
    bgPreview: '#09040e',
    cardPreview: '#160a24',
    monacoTheme: 'vs-dark',
    badge: 'ELECTRIC 80S ARCADE',
    typography: 'Orbitron & Space Grotesk (Sci-Fi Futuristic)',
    shape: '4px Angular Tech Chamfer & Neon Glow',
    fontFamily: "'Space Grotesk', 'Orbitron', sans-serif",
    borderRadius: '4px',
    description: 'Futuristic sci-fi display typography, 4px tech chamfer edges, and dual magenta-cyan laser glow'
  },
  'nebula-violet': {
    id: 'nebula-violet',
    name: 'Nebula Violet',
    category: 'Cosmic Glass',
    accentColor: '#a78bfa',
    secondaryAccent: '#f472b6',
    bgPreview: '#070611',
    cardPreview: '#110d29',
    monacoTheme: 'vs-dark',
    badge: 'ORGANIC LIQUID GLASS',
    typography: 'Outfit (Geometric Display Neo-Modern)',
    shape: '22px Ultra-Organic Curved & Full Pill Floating Controls',
    fontFamily: "'Outfit', sans-serif",
    borderRadius: '22px',
    description: 'Ultra-organic 22px fluid curves, full pill controls, Outfit geometric display & celestial violet glow'
  },
  'midnight-amoled': {
    id: 'midnight-amoled',
    name: 'Midnight AMOLED',
    category: 'True OLED Black',
    accentColor: '#00f0ff',
    secondaryAccent: '#34d399',
    bgPreview: '#000000',
    cardPreview: '#080808',
    monacoTheme: 'hc-black',
    badge: 'TRUE PITCH OLED',
    typography: 'Space Grotesk (High-Density Technical Sans)',
    shape: '6px Hairline Razor Precision / Zero Glow Haze',
    fontFamily: "'Space Grotesk', sans-serif",
    borderRadius: '6px',
    description: '100% pitch-black OLED canvas with Space Grotesk technical typography and 6px razor hairline borders'
  }
};

export const normalizeTheme = (raw: string | null): UiTheme => {
  if (!raw) return 'obsidian-luxe';
  if (raw in THEME_PRESETS) return raw as UiTheme;
  if (raw === 'cyber-neon') return 'synthwave-neon';
  if (raw === 'enterprise-slate') return 'obsidian-luxe';
  if (raw === 'nordic-light') return 'obsidian-luxe';
  return 'obsidian-luxe';
};

export interface ThemeContextType {
  theme: UiTheme;
  setTheme: (theme: UiTheme) => void;
  layout: UiLayout;
  setLayout: (layout: UiLayout) => void;
  themeConfig: ThemeConfig;
  fontSize: number;
  setFontSize: (size: number) => void;
  toggleTheme: () => void;
  isSwitcherOpen: boolean;
  setIsSwitcherOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<UiTheme>(() => {
    const saved = localStorage.getItem('kodexis_ui_theme');
    return normalizeTheme(saved);
  });

  const [layout, setLayoutState] = useState<UiLayout>(() => {
    const saved = localStorage.getItem('kodexis_ui_layout');
    if (saved === 'standard-3panel' || saved === 'dual-split' || saved === 'zen-focus') return saved as UiLayout;
    return 'standard-3panel';
  });

  const [fontSize, setFontSizeState] = useState<number>(() => {
    const saved = localStorage.getItem('kodexis_editor_fontsize');
    return saved ? parseInt(saved, 10) : 13;
  });

  const [isSwitcherOpen, setIsSwitcherOpen] = useState<boolean>(false);

  const setTheme = (newTheme: UiTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('kodexis_ui_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const setLayout = (newLayout: UiLayout) => {
    setLayoutState(newLayout);
    localStorage.setItem('kodexis_ui_layout', newLayout);
  };

  const setFontSize = (size: number) => {
    setFontSizeState(size);
    localStorage.setItem('kodexis_editor_fontsize', size.toString());
  };

  const toggleTheme = () => {
    const themeKeys: UiTheme[] = [
      'obsidian-luxe',
      'royal-junge',
      'cyber-matrix',
      'synthwave-neon',
      'nebula-violet',
      'midnight-amoled'
    ];
    const nextIdx = (themeKeys.indexOf(theme) + 1) % themeKeys.length;
    setTheme(themeKeys[nextIdx]);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeConfig = THEME_PRESETS[theme] || THEME_PRESETS['obsidian-luxe'];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        layout,
        setLayout,
        themeConfig,
        fontSize,
        setFontSize,
        toggleTheme,
        isSwitcherOpen,
        setIsSwitcherOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

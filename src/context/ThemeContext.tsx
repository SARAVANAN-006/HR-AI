import React, { createContext, useContext, useState, useEffect } from 'react';

export type UiTheme = 'cyber-neon' | 'enterprise-slate' | 'nordic-light' | 'midnight-amoled';
export type UiLayout = 'standard-3panel' | 'dual-split' | 'zen-focus';

export interface ThemeConfig {
  id: UiTheme;
  name: string;
  category: 'Dark' | 'Light';
  accentColor: string;
  secondaryAccent: string;
  bgPreview: string;
  cardPreview: string;
  monacoTheme: 'vs-dark' | 'vs-light' | 'hc-black';
  badge: string;
  description: string;
}

export const THEME_PRESETS: Record<UiTheme, ThemeConfig> = {
  'cyber-neon': {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    category: 'Dark',
    accentColor: '#22d3ee',
    secondaryAccent: '#a78bfa',
    bgPreview: '#09090b',
    cardPreview: '#121215',
    monacoTheme: 'vs-dark',
    badge: 'KODEXIS SIGNATURE',
    description: 'Deep obsidian cockpit with electric cyan glow & synthwave violet accents'
  },
  'enterprise-slate': {
    id: 'enterprise-slate',
    name: 'Enterprise Slate',
    category: 'Dark',
    accentColor: '#38bdf8',
    secondaryAccent: '#818cf8',
    bgPreview: '#0b0f17',
    cardPreview: '#111827',
    monacoTheme: 'vs-dark',
    badge: 'LINEAR / VERCEL PRO',
    description: 'Matte graphite navy with crisp steel edges and precision corporate typography'
  },
  'nordic-light': {
    id: 'nordic-light',
    name: 'Nordic Studio',
    category: 'Light',
    accentColor: '#0284c7',
    secondaryAccent: '#6366f1',
    bgPreview: '#f8fafc',
    cardPreview: '#ffffff',
    monacoTheme: 'vs-light',
    badge: 'HIGH CONTRAST LIGHT',
    description: 'Snow-white daylight canvas with razor-sharp slate borders and deep sapphire'
  },
  'midnight-amoled': {
    id: 'midnight-amoled',
    name: 'Midnight AMOLED',
    category: 'Dark',
    accentColor: '#34d399',
    secondaryAccent: '#22d3ee',
    bgPreview: '#000000',
    cardPreview: '#080808',
    monacoTheme: 'hc-black',
    badge: 'TRUE BLACK OLED',
    description: 'Pitch-black AMOLED with emerald telemetry for zero distraction and zero glare'
  }
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
    if (saved && (saved in THEME_PRESETS)) return saved as UiTheme;
    return 'cyber-neon';
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
    const themeKeys: UiTheme[] = ['cyber-neon', 'enterprise-slate', 'nordic-light', 'midnight-amoled'];
    const nextIdx = (themeKeys.indexOf(theme) + 1) % themeKeys.length;
    setTheme(themeKeys[nextIdx]);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const themeConfig = THEME_PRESETS[theme];

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

"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme =
  | "dark"
  | "light";

export type AccentColor =
  | "orange"
  | "blue"
  | "purple"
  | "green"
  | "red"
  | "cyan";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  accentColor: AccentColor;
  setAccentColor: (
    color: AccentColor,
  ) => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(
    null,
  );

type ThemeProviderProps = {
  children: ReactNode;
};

const DEFAULT_THEME: Theme = "dark";
const DEFAULT_ACCENT: AccentColor =
  "orange";

const VALID_ACCENTS: AccentColor[] = [
  "orange",
  "blue",
  "purple",
  "green",
  "red",
  "cyan",
];

export default function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setThemeState] =
    useState<Theme>(DEFAULT_THEME);

  const [
    accentColor,
    setAccentColorState,
  ] = useState<AccentColor>(
    DEFAULT_ACCENT,
  );

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem(
        "playshelf-theme",
      ) as Theme | null;

    const savedAccent =
      window.localStorage.getItem(
        "playshelf-accent",
      ) as AccentColor | null;

    const nextTheme =
      savedTheme === "light"
        ? "light"
        : DEFAULT_THEME;

    const nextAccent =
      savedAccent &&
      VALID_ACCENTS.includes(
        savedAccent,
      )
        ? savedAccent
        : DEFAULT_ACCENT;

    setThemeState(nextTheme);
    setAccentColorState(nextAccent);

    document.documentElement.dataset.theme =
      nextTheme;

    document.documentElement.dataset.accent =
      nextAccent;
  }, []);

  function setTheme(theme: Theme) {
    setThemeState(theme);

    document.documentElement.dataset.theme =
      theme;

    window.localStorage.setItem(
      "playshelf-theme",
      theme,
    );
  }

  function setAccentColor(
    color: AccentColor,
  ) {
    setAccentColorState(color);

    document.documentElement.dataset.accent =
      color;

    window.localStorage.setItem(
      "playshelf-accent",
      color,
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider",
    );
  }

  return context;
}
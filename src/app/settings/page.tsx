"use client";

import {
  useRef,
  useState,
} from "react";

import { downloadOrShareBackup } from "@/lib/backup-export";

import {
  useTheme,
  type AccentColor,
  type Theme,
} from "@/components/ThemeProvider/ThemeProvider";

import {
  exportLibrary,
  importLibrary,
} from "@/lib/library";

import type { LibraryGame } from "@/types/library";

import styles from "./settings.module.css";

const GITHUB_URL =
  "https://github.com/";

const accentColors: {
  value: AccentColor;
  label: string;
}[] = [
  {
    value: "orange",
    label: "Orange",
  },
  {
    value: "blue",
    label: "Blue",
  },
  {
    value: "purple",
    label: "Purple",
  },
  {
    value: "green",
    label: "Green",
  },
  {
    value: "red",
    label: "Red",
  },
  {
    value: "cyan",
    label: "Cyan",
  },
];

export default function SettingsPage() {
  const {
    theme,
    setTheme,
    accentColor,
    setAccentColor,
  } = useTheme();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [dataMessage, setDataMessage] =
    useState("");

  const [isImporting, setIsImporting] =
    useState(false);

  function handleThemeChange(
    nextTheme: Theme,
  ) {
    setTheme(nextTheme);
  }

  async function handleExport() {
    setDataMessage("");

    try {
      const games = await exportLibrary();

      const backup = {
        app: "PlayShelf",
        version: 1,
        exportedAt: new Date().toISOString(),
        library: games,
      };

      await downloadOrShareBackup(backup);

      setDataMessage(`${games.length} games exported.`);
    } catch (error) {
      console.error("Failed to export library:", error);

      setDataMessage("Failed to export your library.");
    }
  }

  function handleImportClick() {
    fileInputRef.current?.click();
  }

  async function handleImport(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setDataMessage("");
    setIsImporting(true);

    try {
      const text =
        await file.text();

      const data: unknown =
        JSON.parse(text);

      if (
        !data ||
        typeof data !== "object" ||
        !("library" in data) ||
        !Array.isArray(
          data.library,
        )
      ) {
        throw new Error(
          "Invalid backup file",
        );
      }

      const games =
        data.library as LibraryGame[];

      const importedCount =
        await importLibrary(games);

      setDataMessage(
        `${importedCount} games imported.`,
      );
    } catch (error) {
      console.error(
        "Failed to import library:",
        error,
      );

      setDataMessage(
        "Invalid or corrupted backup file.",
      );
    } finally {
      setIsImporting(false);

      event.target.value = "";
    }
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>
          PLAY SHELF
        </p>

        <h1>Settings</h1>
      </header>

      <section className={styles.section}>
        <h2>Appearance</h2>

        <div className={styles.card}>
          <div className={styles.settingInfo}>
            <div className={styles.icon}>
              <i
                className={`bx ${
                  theme === "dark"
                    ? "bx-moon"
                    : "bx-sun"
                }`}
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>Theme</strong>

              <span>
                {theme === "dark"
                  ? "Dark"
                  : "Light"}
              </span>
            </div>
          </div>

          <div
            className={styles.themeButtons}
          >
            <button
              type="button"
              className={
                theme === "dark"
                  ? styles.selected
                  : ""
              }
              onClick={() =>
                handleThemeChange(
                  "dark",
                )
              }
            >
              <i
                className="bx bx-moon"
                aria-hidden="true"
              />

              Dark
            </button>

            <button
              type="button"
              className={
                theme === "light"
                  ? styles.selected
                  : ""
              }
              onClick={() =>
                handleThemeChange(
                  "light",
                )
              }
            >
              <i
                className="bx bx-sun"
                aria-hidden="true"
              />

              Light
            </button>
          </div>

          <div
            className={styles.settingInfo}
          >
            <div className={styles.icon}>
              <i
                className="bx bx-palette"
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>Accent Color</strong>

              <span>
                Customize PlayShelf
              </span>
            </div>
          </div>

          <div className={styles.colors}>
            {accentColors.map(
              (color) => (
                <button
                  key={color.value}
                  type="button"
                  className={`${
                    styles.colorButton
                  } ${
                    accentColor ===
                    color.value
                      ? styles.colorSelected
                      : ""
                  } ${
                    styles[
                      `color-${color.value}`
                    ]
                  }`}
                  onClick={() =>
                    setAccentColor(
                      color.value,
                    )
                  }
                  aria-label={`${color.label} accent`}
                  aria-pressed={
                    accentColor ===
                    color.value
                  }
                />
              ),
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Data</h2>

        <div className={styles.card}>
          <div
            className={
              styles.dataDescription
            }
          >
            <div className={styles.icon}>
              <i
                className="bx bx-data"
                aria-hidden="true"
              />
            </div>

            <div>
              <strong>
                Backup your library
              </strong>

              <span>
                Export your games and
                import them on another
                device.
              </span>
            </div>
          </div>

          <div className={styles.dataButtons}>
            <button
              type="button"
              onClick={handleExport}
            >
              <i
                className="bx bx-export"
                aria-hidden="true"
              />

              Export
            </button>

            <button
              type="button"
              onClick={handleImportClick}
              disabled={isImporting}
            >
              <i
                className="bx bx-import"
                aria-hidden="true"
              />

              {isImporting
                ? "Importing..."
                : "Import"}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className={styles.fileInput}
            onChange={handleImport}
          />

          {dataMessage && (
            <p className={styles.dataMessage}>
              {dataMessage}
            </p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2>About</h2>

        <div className={styles.card}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            <div
              className={styles.settingInfo}
            >
              <div className={styles.icon}>
                <i
                  className="bx bxl-github"
                  aria-hidden="true"
                />
              </div>

              <div>
                <strong>GitHub</strong>

                <span>
                  View the source code
                </span>
              </div>
            </div>

            <i
              className="bx bx-chevron-right"
              aria-hidden="true"
            />
          </a>

          <div
            className={styles.version}
          >
            <span>Version</span>

            <span>0.1.0</span>
          </div>
        </div>
      </section>
    </main>
  );
}
"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { downloadOrShareBackup } from "@/lib/backup-export";

import {
  getLibrarySearchEnabled,
  setLibrarySearchEnabled,
} from "@/lib/library-search-setting";

import {
  getRawgApiKey,
  removeRawgApiKey,
  saveRawgApiKey,
} from "@/lib/rawg-api-key";

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

  const [librarySearchEnabled, setLibrarySearchEnabledState] =
    useState(true);

  const [isImporting, setIsImporting] =
    useState(false);

    const [apiKey, setApiKey] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [apiKeyMessage, setApiKeyMessage] = useState("");

    useEffect(() => {
      setApiKey(getRawgApiKey());
      setLibrarySearchEnabledState(getLibrarySearchEnabled());
    }, []);

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

  function handleSaveApiKey() {
    try {
      saveRawgApiKey(apiKey);
      setApiKey(getRawgApiKey());
      setApiKeyMessage("RAWG API key saved on this device.");
    } catch {
      setApiKeyMessage("Enter your RAWG API key first.");
    }
  }

  function handleRemoveApiKey() {
    removeRawgApiKey();
    setApiKey("");
    setShowApiKey(false);
    setApiKeyMessage("RAWG API key removed.");
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
  <h2>Library</h2>

  <div className={styles.card}>
    <div className={styles.settingInfo}>
      <div className={styles.icon}>
        <i className="bx bx-search" aria-hidden="true" />
      </div>

      <div>
        <strong>Library Search</strong>
        <span>Show a search bar in your game library.</span>
      </div>
    </div>

    <label className={styles.settingToggle}>
      <span>{librarySearchEnabled ? "Enabled" : "Disabled"}</span>

      <input
        type="checkbox"
        checked={librarySearchEnabled}
        onChange={(event) => {
          const enabled = event.target.checked;

          setLibrarySearchEnabledState(enabled);
          setLibrarySearchEnabled(enabled);
        }}
        aria-label="Enable library search"
      />
    </label>
  </div>
</section>

  <section className={styles.section}>
    <h2>RAWG API</h2>

    <div className={styles.card}>
      <div className={styles.dataDescription}>
        <div className={styles.icon}>
          <i className="bx bx-key" aria-hidden="true" />
        </div>

        <div>
          <strong>RAWG API Key</strong>
          <span>
            Enter your own API key to search for games.
            It is stored locally on this device.
          </span>
        </div>
      </div>

      <div className={styles.apiKeyForm}>
        <label htmlFor="rawg-api-key">
          API key
        </label>

        <input
          id="rawg-api-key"
          type={showApiKey ? "text" : "password"}
          value={apiKey}
          onChange={(event) => {
            setApiKey(event.target.value);
            setApiKeyMessage("");
          }}
          placeholder="Enter your RAWG API key"
          autoComplete="off"
          spellCheck={false}
        />

        <label className={styles.apiKeyToggle}>
          <input
            type="checkbox"
            checked={showApiKey}
            onChange={(event) => setShowApiKey(event.target.checked)}
          />
          Show API key
        </label>
      </div>

      <div className={styles.dataButtons}>
        <button
          type="button"
          onClick={handleSaveApiKey}
          disabled={!apiKey.trim()}
        >
          <i className="bx bx-save" aria-hidden="true" />
          Save key
        </button>

        <button
          type="button"
          onClick={handleRemoveApiKey}
          disabled={!apiKey}
        >
          <i className="bx bx-trash" aria-hidden="true" />
          Remove key
        </button>
      </div>

      {apiKeyMessage && (
        <p className={styles.dataMessage} role="status">
          {apiKeyMessage}
        </p>
      )}
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
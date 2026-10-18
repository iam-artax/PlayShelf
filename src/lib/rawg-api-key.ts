const STORAGE_KEY = "playshelf-rawg-api-key";
const PBKDF2_ITERATIONS = 100_000;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveEncryptionKey(
  passphrase: string,
  salt: Uint8Array,
): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function getRawgApiKey(passphrase: string): Promise<string> {
  if (typeof window === "undefined") {
    return "";
  }

  const payload = localStorage.getItem(STORAGE_KEY)?.trim() ?? "";
  if (!payload) {
    return "";
  }

  if (!passphrase.trim()) {
    throw new Error("Passphrase is required to unlock the API key.");
  }

  const [saltB64, ivB64, cipherB64] = payload.split(".");
  if (!saltB64 || !ivB64 || !cipherB64) {
    throw new Error("Stored API key format is invalid.");
  }

  const salt = fromBase64(saltB64);
  const iv = fromBase64(ivB64);
  const ciphertext = fromBase64(cipherB64);
  const key = await deriveEncryptionKey(passphrase.trim(), salt);

  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext,
  );

  return new TextDecoder().decode(plaintext).trim();
}

export async function saveRawgApiKey(
  apiKey: string,
  passphrase: string,
): Promise<void> {
  if (typeof window === "undefined") {
    throw new Error("API key storage is unavailable.");
  }

  const normalizedKey = apiKey.trim();
  if (!normalizedKey) {
    throw new Error("Enter a valid RAWG API key.");
  }

  const normalizedPassphrase = passphrase.trim();
  if (!normalizedPassphrase) {
    throw new Error("Enter a passphrase to protect your API key.");
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(normalizedPassphrase, salt);

  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(normalizedKey),
  );

  const payload = `${toBase64(salt)}.${toBase64(iv)}.${toBase64(
    new Uint8Array(ciphertext),
  )}`;

  localStorage.setItem(STORAGE_KEY, payload);
}

export function removeRawgApiKey(): void {
  if (typeof window === "undefined") {
    throw new Error("API key storage is unavailable.");
  }

  localStorage.removeItem(STORAGE_KEY);
}
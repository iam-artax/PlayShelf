
# Security Policy

## Data and Privacy

PlayShelf is designed to keep your game library on your device. It does not use a PlayShelf-hosted backend, and the project does not intentionally collect or transmit personal data to its own servers.

- **Local storage:** Your game library and configured RAWG API key are stored locally on your device.
- **External requests:** When you search for games, PlayShelf sends requests to the RAWG API. Your API key is included in these requests, and RAWG may process request data according to its own privacy policy.
- **No analytics:** PlayShelf does not intentionally include analytics or telemetry to track your usage.
- **Backups:** Library backups are stored wherever you choose to save or share them. Keep backup files private if they contain information you do not want others to see.

PlayShelf cannot guarantee the security of a compromised device, third-party services, or files shared outside the application.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it privately through [GitHub Security Advisories](https://github.com/iam-artax/PlayShelf/security/advisories/new).

Include the affected version, steps to reproduce the issue, and its potential impact. Do not share API keys, personal information, or private backups in your report.

Please do not publish API keys, personal information, or private backup files in your report.

## Supported Versions

Security fixes are prioritized for the latest release. Older versions may not receive security updates.

## Keeping PlayShelf Secure

- Keep PlayShelf updated to the latest release.
- Keep your RAWG API key private.
- Only install APK files from sources you trust, preferably the official [GitHub Releases](https://github.com/iam-artax/PlayShelf/releases) page.
- Do not share backup files publicly unless you have checked their contents.

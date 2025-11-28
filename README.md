# My Website

Dies ist der Export deiner Website.

## Setup

1. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```

2. Füge deine Konfiguration hinzu:
   - Stelle sicher, dass deine Bilder korrekt konfiguriert sind.
   - Kopiere deine Konfigurationsdatei (`website-config.json`) nach `public/config.json` (oder benenne um).

3. Starten (Development):
   ```bash
   npm run dev
   ```

4. Live-Schalten (Production):
   Wenn du auf Vercel/Netlify hostest, setze die Environment Variable:
   `NEXT_PUBLIC_BUILD_MODE=standalone`

## Notiz zu Bildern
Die Bilder werden beim Export bereinigt. Stelle sicher, dass alle benötigten Bilder in `public/images/` vorhanden sind (hero.png, about.png, service-*.png).

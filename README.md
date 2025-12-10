# Remember the Magic ✨  
A cozy, Ghibli-inspired journaling prompt PWA.

Remember the Magic is a small web app for capturing everyday and travel memories through gentle writing prompts. It started as a Scriptable prototype and is now a standalone web app / PWA so it can be added to your home screen and used offline.

---

## ✨ What it does

- **Home (card stack)**
  - Fanned stack of three image-backed cards.
  - “Tap to shuffle” arrow with soft bounce animation.
  - Tapping the stack or the shuffle control enters the selection flow.

- **Card Selection**
  - Horizontally scrollable row of three prompt cards.
  - Each card has a tag pill (LIFE / TRIP / GHIBLI), gradient background, and short prompt.
  - Select by tapping or swiping up on a card to zoom + transition into viewing.

- **Card Viewing**
  - Full-screen “back of the card” layout.
  - Tag pill above the prompt.
  - “Swipe up to finish” button + swipe-up gesture anywhere on the card.
  - Finishing:
    - Plays a fly-out animation.
    - Adds the prompt to History with the current date.
    - Shows a toast: `prompt added to history ✨`.
    - Returns to Home.

- **History**
  - Reverse-chronological list of completed prompts.
  - Each entry: date, tag pill, prompt text, delete icon.
  - Actions:
    - Delete single prompt (with confirmation modal).
    - Clear all (only shows when there’s more than one entry).
    - Export → copies CSV (`Date, Tag, Prompt`) to clipboard and shows `Copied to Clipboard 📋`.

- **Offline-aware**
  - Uses `localStorage` for History.
  - Service worker caches the core shell + a limited pool of images/icons.
  - Offline mode uses a smaller image set so cards still show artwork.

---

## 🧱 Tech Stack

- HTML, CSS, vanilla JavaScript  
- `prompts.json` as a static prompt library  
- `localStorage` for history persistence  
- `manifest.json` + `sw.js` for PWA + offline behavior  

No frameworks or build tools required.

---

🧠 Prompt Schema (prompts.json)

The prompt library is a flat array of objects:

[
  {
    "id": 1,
    "tag": "Life",
    "tagKey": "life",
    "text": "Did anything small today grab your attention without really trying?",
    "zones": []
  },
  {
    "id": 42,
    "tag": "Ghibli",
    "tagKey": "ghibli",
    "text": "In Mononoke Village, what detail reminds you that people and the forest are still learning how to live together?",
    "zones": ["MONONOKE"]
  }
]

- id – numeric identifier.
- tag – category label (Life, Trip, Ghibli).
- tagKey – lowercase key used for styling/logic (life, trip, ghibli).
- text – the prompt. The UI is tuned for prompts ≤ 130 characters.
- zones – array of zone IDs for now/future features.

Currently supported zone IDs (must match ZONES in app.js):

- HILL_OF_YOUTH
- WAREHOUSE
- DONDOKO
- VALLEY_OF_WITCHES
- MONONOKE
- SPRINGTIME_HILL

⸻

## 🚀 Running Locally

**From the project root:**

python3 -m http.server 8080

**Then Open**

http://localhost:8080

You should be able to:

- Shuffle the card stack on Home.
- Pick a prompt in Card Selection.
- View and finish prompts via swipe/tap.
- See and manage History (including export to clipboard).
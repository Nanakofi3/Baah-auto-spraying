# Baah Auto Spraying — Website

Static five-page website (Home, Services, About, Gallery, Contact) for Baah Auto Spraying, a vehicle spraying and finishing workshop in Community 9, Tema.

## Project structure

```
baah-auto-spraying/
├── index.html                  Home (/): hero, services preview, process, stats, gallery preview
├── services.html               Services (/services): all seven services and the four-step process
├── about.html                  About (/about): numbered chapters, founder, values
├── gallery.html                Gallery (/gallery): Photos and Videos tabs
├── contact.html                Contact (/contact): phone, email, directions, map
├── vercel.json                 Vercel settings: short addresses and redirects from old links
├── assets/
│   ├── css/main.css            All site styles (mobile-first, responsive)
│   ├── css/fonts.css           @font-face rules for the self-hosted fonts
│   ├── fonts/                  Barlow and Barlow Condensed (woff2, latin + latin-ext)
│   ├── js/theme.js             Applies light/dark theme before the page renders
│   ├── js/main.js              Theme toggle, mobile menu, scroll reveals, stat counters, footer year, gallery tabs and lightbox
│   ├── images/                 Site images
│   └── gallery/                photo-NN.jpg, video-NN.mp4 and video-NN-poster.webp (numbered in page order)
└── README.md
```

## Page addresses

`vercel.json` turns on Vercel's Clean URLs, so each page is served without `.html`: `/`, `/services`, `/about`, `/gallery`, `/contact`. Links between pages use the file names (`services.html`) so the site also works when opened straight from disk; on Vercel those forward to the short addresses. Old addresses (`/home`, `/templates/pages/*.html`, `*.html`) redirect to the short ones.

## Pages

| Page         | Contents |
|--------------|----------|
| `index.html`    | Hero, first four services, four-step process, stats, gallery preview, contact strip |
| `services.html` | All seven services, four-step process, contact strip |
| `gallery.html`  | Two tabs, Photos and Videos ("In motion"); `/gallery#videos` opens the Videos tab. Items open in a lightbox (videos play there), then a call to action |
| `about.html`   | Wordmark hero, then numbered chapters 01–09: about, founder, story, why choose us, vision, mission, numbers, values, visit |
| `contact.html` | "Let's talk" hero, phone, email, directions and map |

## Previewing locally

Double-click `index.html` to open the site in a browser; the menu links work from there. For live reloading, use the VS Code *Live Server* extension (right-click `index.html` → *Open with Live Server*).

## Editing notes

- Page content is in the five `.html` files in the project root. Each page loads styles, scripts and images from `assets/`. The header and footer are repeated in each page, so update every page when changing them.
- Gallery media lives in `assets/gallery/`, named in the order it appears on the page: `photo-NN.jpg`, `video-NN.mp4`, and `video-NN-poster.webp` (a still frame of `video-NN.mp4` shown on its tile, so the video only downloads when opened in the lightbox). Don't add the same video twice.
- Videos are stored without sound and compressed for the web. To add one: `ffmpeg -i input.mp4 -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart video-NN.mp4`, then save a frame from it as `video-NN-poster.webp`.
- Moving between pages cross-fades using CSS view transitions (`@view-transition` in `main.css`). Browsers only run it on a hosted site or a local server such as Live Server, not when a file is opened directly, and it is turned off for visitors who prefer reduced motion.

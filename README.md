# Baah Auto Spraying — Website

Static five-page website (Home, Services, About, Gallery, Contact) for Baah Auto Spraying, a vehicle spraying and finishing workshop in Community 9, Tema.

## Project structure

```
baah-auto-spraying/
├── index.html                  Entry point, redirects to templates/pages/home.html
├── vercel.json                 Vercel settings: keeps .html page addresses (no redirect to clean URLs)
├── templates/
│   └── pages/
│       ├── home.html           Home: hero, services preview, process, stats, gallery preview
│       ├── services.html       Services: all seven services and the four-step process
│       ├── about.html          About: numbered story, vision, mission, values, founder
│       ├── gallery.html        Gallery: Photos and Videos tabs
│       └── contact.html        Contact: phone, email, directions, map
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

The root `index.html` exists only because web hosts load `index.html` by default; it forwards visitors to `templates/pages/home.html`.

## Pages

| Page         | Contents |
|--------------|----------|
| `home.html`     | Hero, scrolling services strip, first four services, four-step process, stats, gallery preview, contact strip |
| `services.html` | All seven services, four-step process, contact strip |
| `gallery.html`  | Two tabs, Photos and Videos ("In motion"); `gallery.html#videos` opens the Videos tab. Items open in a lightbox (videos play there), then a call to action |
| `about.html`   | Wordmark hero, then numbered chapters 01–09: about, founder, story, why choose us, vision, mission, numbers, values, visit |
| `contact.html` | "Let's talk" hero, phone, email, directions and map |

## Previewing locally

Open `index.html` in a browser, or for live reloading use the VS Code *Live Server* extension (right-click `index.html` → *Open with Live Server*).

## Editing notes

- Page content is in `templates/pages/*.html`. Each page loads styles and scripts from `../../assets/`. The header and footer are repeated in each page, so update every page when changing them.
- Gallery media lives in `assets/gallery/`, named in the order it appears on the page: `photo-NN.jpg`, `video-NN.mp4`, and `video-NN-poster.webp` (a still frame of `video-NN.mp4` shown on its tile, so the video only downloads when opened in the lightbox). Don't add the same video twice.
- Videos are stored without sound and compressed for the web. To add one: `ffmpeg -i input.mp4 -an -c:v libx264 -crf 26 -preset slow -pix_fmt yuv420p -movflags +faststart video-NN.mp4`, then save a frame from it as `video-NN-poster.webp`.
- Moving between pages cross-fades using CSS view transitions (`@view-transition` in `main.css`). Browsers only run it on a hosted site or a local server such as Live Server, not when a file is opened directly, and it is turned off for visitors who prefer reduced motion.

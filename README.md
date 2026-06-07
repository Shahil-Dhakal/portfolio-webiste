# Alex Carter — Portfolio Website

A clean, static personal portfolio website. No frameworks, no build tools — just HTML, CSS, and vanilla JS.

## Folder Structure

```
portfolio/
├── index.html          ← About Me (home)
├── resume.html         ← Resume / Experience
├── projects.html       ← Projects showcase
├── contact.html        ← Contact form
├── css/
│   └── style.css       ← All styles (CSS custom properties, responsive)
├── js/
│   └── main.js         ← Hamburger menu + scroll behaviour
├── assets/
│   └── images/
│       └── profile.jpg ← Drop your profile photo here
└── README.md
```

## Customisation

1. **Replace name/role**: Search and replace `Alex Carter` and `PRODUCT DESIGNER` across all `.html` files.
2. **Profile photo**: Drop a square photo at `assets/images/profile.jpg`.
3. **Colors**: Edit the CSS variables at the top of `css/style.css` under `:root`.
4. **Content**: Edit text directly in each `.html` file.
5. **Social links**: Find the `<a href="#">` tags in the social sections and add your URLs.

## Colors (Masculine Palette)

| Variable      | Value     | Usage                      |
|---------------|-----------|----------------------------|
| `--bg`        | `#f0ece6` | Warm sandy background      |
| `--navy`      | `#0f1923` | Dark headings / text       |
| `--accent`    | `#1a3a5c` | Steel blue — primary CTA   |
| `--accent-alt`| `#c8a96e` | Warm gold — secondary hint |

## Deployment

Drag the entire `portfolio/` folder to any static host:
- **Netlify Drop** — drag folder to netlify.com/drop
- **GitHub Pages** — push to a repo, enable Pages in settings
- **Vercel** — `vercel deploy` from the folder

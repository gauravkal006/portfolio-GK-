# portfolio-GK-

Personal portfolio of Gaurav Kalamkhede, live at [gauravkalamkhede.in](https://gauravkalamkhede.in/).

Built with React, TypeScript, Vite, Tailwind CSS v4 and GSAP (ScrollTrigger).

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint
npm run typecheck
npm run build      # outputs to dist/
npm run preview    # serve the production build
```

## Where things live

| What | File |
| --- | --- |
| Name, links, intro, nav | `src/data/profile.ts` |
| Projects (featured + GitHub grid) | `src/data/projects.ts` |
| Skills | `src/data/skills.ts` |
| Experience, education, certifications | `src/data/experience.ts` |
| Resume PDF | `public/resume.pdf` |
| Project screenshots | `public/images/projects/` (see below) |
| Sections and UI | `src/components/` |
| Design tokens | `src/index.css` (`@theme`) |

To replace the resume, overwrite `public/resume.pdf`.

### Adding a project screenshot

Every project card has a browser-window preview slot. Until a screenshot is added it shows an
illustrated template (and, in `npm run dev` only, a hint with the expected file name).

1. Save a screenshot (about 1600×1000, `.webp` or `.jpg`) to `public/images/projects/`, e.g. `storemyfiles.webp`.
2. In `src/data/projects.ts`, add `preview: "images/projects/storemyfiles.webp"` to that project.

## Deploy

`.github/workflows/deploy.yml` lints, builds and publishes `dist/` to GitHub Pages on every push to `main`.
In the repository's **Settings → Pages**, set **Source** to **GitHub Actions** (one-time). The custom domain is kept by `public/CNAME`.

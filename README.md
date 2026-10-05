# Jose E. Garcia — Contemporary Minimal Developer Portfolio

Tailored around digital media, real-time creative coding, and modern web architecture.

**Live GitHub Pages URL**: [https://garciajoseeduard02-lab.github.io/Garcia/](https://garciajoseeduard02-lab.github.io/Garcia/)  
**GitHub Repository**: [https://github.com/garciajoseeduard02-lab/Garcia](https://github.com/garciajoseeduard02-lab/Garcia)

---

## ✦ Aesthetic & Design Foundation

- **Deep Black Background (`#020204` / `#05060a`)**: Seamless, luminous OLED dark-mode palette eliminating glare while maximizing visual focus.
- **Bright High-Contrast Typography**: Ultra-clean grotesk titles (`Space Grotesk`) paired with cybernetic monospace annotations (`JetBrains Mono`).
- **Neo Blue Accents (`#00f0ff` / `#38f8ff`)**: Electric cyan indicator beams, pulse status beacons, luminous hover states, and glow drop-shadows.
- **Digital Media Focus**: Real-time generative canvas hero constellation, interactive procedural **Digital Media Lab** (flowfield, cyber matrix, audio spectrum simulator), project showcase with filter controls, and digital artwork asset inspection lightbox preserving `Image/demo.png`.

---

## ✦ Directory Structure

```
garcia-portfolio/
├── index.html           # Master semantic HTML5 portfolio
├── style.css            # Root stylesheet (imports css/styles.css)
├── css/
│   └── styles.css       # Complete design system, glassmorphism & responsive CSS
├── js/
│   └── main.js          # Interactive particle canvas, digital lab engine & audio synth
├── Image/
│   └── demo.png         # Original authentic high-res digital artwork asset (1322x1132)
└── README.md            # Architecture & deployment guide
```

---

## ✦ How to Deploy to GitHub Pages

To update your live site at `https://garciajoseeduard02-lab.github.io/Garcia/`:

### Option A: From your local GitHub repository folder (`Documents/github/Garcia`)
If you already have your local clone at `~/Documents/github/Garcia` or `~/Documents/GitHub/Garcia`:

```bash
# 1. Copy the updated portfolio files into your repository
cp -r /Users/Guest/.gemini/antigravity/scratch/garcia-portfolio/* ~/Documents/github/Garcia/

# 2. Navigate to your repository
cd ~/Documents/github/Garcia/

# 3. Stage, commit, and push to main
git add .
git commit -m "Deploy contemporary minimal developer portfolio with deep black & neo-blue styling"
git push origin main
```

### Option B: Push directly from this portfolio directory

```bash
cd /Users/Guest/.gemini/antigravity/scratch/garcia-portfolio/

# Initialize git if needed
git init
git remote add origin https://github.com/garciajoseeduard02-lab/Garcia.git

# Pull or switch to main branch
git branch -M main

# Add and commit
git add .
git commit -m "Redesign portfolio: contemporary digital media developer showcase"
git push -u origin main --force
```

GitHub Pages will automatically update your site within ~30–60 seconds at `https://garciajoseeduard02-lab.github.io/Garcia/`.

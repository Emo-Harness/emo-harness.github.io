# emo-harness.github.io

Project page for **EmoHarness: Boosting Multimodal Emotion Understanding with
Meta-Harness Evolving**, served at <https://emo-harness.github.io>.

Code: <https://github.com/Emo-Harness/EmoHarness>

## Layout

```
index.html                 the page
static/css/style.css       styles (colors follow the paper's figures)
static/js/results.js       Table 1 data and the interactive Recognition chart
static/js/main.js          navigation, the hero condition ladder, tabs, figure lightbox, BibTeX copy
static/images/             figures exported from the paper (WebP), case-study frames, logo
static/videos/             MME-Emotion example clips (MP4, faststart) and their WebP posters
static/pdf/EmoHarness.pdf  the paper
```

The page is static HTML with no build step; GitHub Pages serves the `main`
branch as is (`.nojekyll` turns Jekyll off).

## Updating

- **Paper:** the Paper button and the BibTeX in `index.html` point at arXiv
  [2611.11994](https://arxiv.org/abs/2611.11994). `static/pdf/EmoHarness.pdf` is a
  local copy of v1; replace it after a new arXiv version so both match.
- **Numbers:** the chart reads `STUDENTS` in `static/js/results.js`; the IntentQA
  table and the text quote numbers directly in `index.html`.
- **Figures:** re-export from the paper's PDF figures, for example
  `pdftoppm -png -scale-to-x 2200 -scale-to-y -1 -singlefile fig.pdf out` and
  `cwebp -q 90 out.png -o static/images/fig.webp`.

Preview locally with `python3 -m http.server` and open <http://localhost:8000>.

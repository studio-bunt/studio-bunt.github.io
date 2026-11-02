# studio bunt — website

Live at **https://bunt-studio.com** (GitHub Pages: every push to `main` goes online within a minute or two).

Plain HTML, CSS and a little JavaScript: no build step, no framework. Open `index.html` in a browser to preview locally.

## Files

| file | what it is |
|---|---|
| `index.html` | home page: live plotter, works, research, contact |
| `people.html` | the people page |
| `css/style.css` | all styling; colours and fonts are at the top (`:root`) |
| `js/main.js` | the live plotter drawing (any `<canvas class="plot">`) |
| `images/works/` | artwork images |
| `images/people/` | portraits (black-and-white, 4:5, e.g. 800 × 1000 px) |

## Common edits

- **Add a work:** in `index.html`, copy one `<div class="card"> … </div>` block inside `#works`, then change the image path and the text. Add `wide` to the class to make it span two columns. Keep images around 1600–1800 px on the long side, saved as JPG.
- **Add a person:** in `people.html`, copy one `<article class="person"> … </article>` block.
- **Placeholders** still to fill in are shown in copper on the site (`class="todo"`): Felix's bio, projects and links. After filling one in, remove `class="todo"`.
- **The plotter** on each page can be tuned with attributes on its canvas: `data-pens` (density), `data-seed` (a different drawing), `data-palette` (`pink`, `gold`, `copper`, `paper`).

- **After changing `css/style.css` or `js/main.js`:** raise the number in `?v=2` (in `index.html` and `people.html`) so visitors' browsers load the new version instead of a saved copy.

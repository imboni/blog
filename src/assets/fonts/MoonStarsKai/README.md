# MoonStarsKai Font

The web build loads `public/fonts/MoonStarsKai.woff2`, a subset of the original
MoonStarsKai font. The full font is not included in the app bundle.

## Regenerate the subset

From the repository root, create a temporary Python environment and recover the
original font from Git history:

```sh
python3 -m venv /private/tmp/boni-font-tools
/private/tmp/boni-font-tools/bin/python -m pip install fonttools brotli
git show 2c6b70b:src/assets/fonts/MoonStarsKai/MoonStarsKai-Regular.woff > /private/tmp/boni-full-font.woff
/private/tmp/boni-font-tools/bin/python scripts/subset-font.py --font-input /private/tmp/boni-full-font.woff
```

The script resolves the project path from its own location and requires the
original full font as input. It collects printable characters from application
sources in `src`, `public/site.config.json`, and `index.html`, adds printable ASCII,
and preserves every character mapped by the existing WOFF2. It verifies the
generated font before replacing it.

Commit the regenerated WOFF2 and both character manifests:

- `scripts/font-chars.txt`: supported characters found in current local sources.
- `scripts/font-chars-extended.txt`: the final set, including previously shipped
  characters retained to prevent regressions.

Run the script again when local UI copy or site configuration changes. External
article content is loaded at runtime and is not collected by this script. Future
article characters outside the subset, or characters unsupported by the full
font, use the existing `PingFang SC` / `Microsoft YaHei UI` / `sans-serif` fallback.

See `LICENSE.txt` for font licensing information.

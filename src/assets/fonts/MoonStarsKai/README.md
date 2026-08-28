# MoonStarsKai Font

The web build uses a subset of MoonStarsKai optimized for this site's content.

**Production font location**: `/public/fonts/MoonStarsKai.woff2` (196 KB)

The subset includes:
- All ASCII characters (space through ~)
- 330 CJK characters actually used in the site content
- Common CJK punctuation

Characters not in the subset fall back to PingFang SC / Microsoft YaHei UI.

## Original Font

The full MoonStarsKai-Regular font (11 MB) is no longer shipped with the app bundle to improve loading performance. If you need to regenerate the subset, use the character collection and subsetting scripts in `/scripts`.

See `LICENSE.txt` for font licensing information.

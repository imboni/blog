#!/usr/bin/env python3
"""Rebuild the local UI font subset without dropping previously shipped glyphs."""

import argparse
import io
import json
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_FONT = PROJECT_ROOT / 'public/fonts/MoonStarsKai.woff2'
SOURCE_EXTENSIONS = {'.ts', '.tsx', '.js', '.jsx', '.vue', '.less', '.css', '.scss', '.html', '.json'}


def strings_in(value):
    """Read decoded config values, including Unicode escapes in JSON."""
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from strings_in(item)
    elif isinstance(value, list):
        for item in value:
            yield from strings_in(item)


def collect_characters():
    # Only local application sources: exclude docs, generated files and remote posts.
    sources = sorted(path for path in (PROJECT_ROOT / 'src').rglob('*')
                     if path.is_file() and path.suffix in SOURCE_EXTENSIONS)
    sources.append(PROJECT_ROOT / 'index.html')
    text = ''.join(path.read_text(encoding='utf-8') for path in sources)
    config = json.loads((PROJECT_ROOT / 'public/site.config.json').read_text(encoding='utf-8'))
    text += ''.join(strings_in(config))
    characters = {ord(char) for char in text if char.isprintable()}
    characters.update(range(32, 127))
    return characters, len(sources) + 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--font-input', type=Path, required=True,
                        help='Path to the original full MoonStarsKai font (not the subset).')
    args = parser.parse_args()
    if not args.font_input.is_file():
        parser.error(f'Font input does not exist: {args.font_input}')
    if args.font_input.resolve() == OUTPUT_FONT.resolve():
        parser.error('--font-input must point to the original full font, not the output subset.')

    try:
        from fontTools import subset
        from fontTools.ttLib import TTFont
    except ImportError:
        parser.error('Install fonttools and brotli in your Python environment first.')

    previous = set()
    if OUTPUT_FONT.exists():
        with TTFont(OUTPUT_FONT) as font:
            previous = set(font.getBestCmap() or {})

    collected, file_count = collect_characters()
    with TTFont(args.font_input, recalcTimestamp=False) as font:
        available = set(font.getBestCmap() or {})
        if previous - available:
            parser.error('The input font lacks previously shipped glyphs; use the original full font.')
        unsupported = collected - available
        current = collected & available
        requested = current | previous
        options = subset.Options()
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=requested)
        subsetter.subset(font)
        font.flavor = 'woff2'
        output = io.BytesIO()
        font.save(output)

    data = output.getvalue()
    with TTFont(io.BytesIO(data)) as font:
        if not requested.issubset(font.getBestCmap() or {}):
            raise RuntimeError('Generated font is missing requested glyphs; output was not replaced.')

    OUTPUT_FONT.write_bytes(data)
    for filename, characters in [('font-chars.txt', current), ('font-chars-extended.txt', requested)]:
        (PROJECT_ROOT / 'scripts' / filename).write_text(
            ''.join(chr(codepoint) for codepoint in sorted(characters)) + '\n', encoding='utf-8')

    print(f'Processed {file_count} local source/config files; retained {len(previous)} existing glyphs.')
    print(f'Wrote {len(requested)} mapped characters to {OUTPUT_FONT} ({len(data):,} bytes).')
    if unsupported:
        print('Characters unavailable in the full font will use the CSS fallback: '
              + ' '.join(f'U+{codepoint:04X}' for codepoint in sorted(unsupported)))


if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""
Collect unique characters from the site and subset MoonStarsKai font.
"""

import os
import re
import glob
from pathlib import Path

def collect_characters_from_file(filepath):
    """Read a file and collect all unique characters."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            return set(content)
    except Exception as e:
        print(f"Warning: Could not read {filepath}: {e}")
        return set()

def main():
    workspace = Path('/workspace')
    all_chars = set()
    
    # Patterns to search
    patterns = [
        'src/**/*.ts',
        'src/**/*.tsx',
        'src/**/*.js',
        'src/**/*.jsx',
        'src/**/*.vue',
        'src/**/*.less',
        'src/**/*.css',
        'src/**/*.html',
        'src/**/*.md',
        'public/**/*.html',
        'index.html',
        'README.md',
    ]
    
    files_processed = []
    
    for pattern in patterns:
        for filepath in workspace.glob(pattern):
            if filepath.is_file():
                chars = collect_characters_from_file(filepath)
                all_chars.update(chars)
                files_processed.append(str(filepath.relative_to(workspace)))
    
    print(f"Processed {len(files_processed)} files")
    
    # Add essential ASCII range (space through ~)
    ascii_chars = set(chr(i) for i in range(32, 127))
    all_chars.update(ascii_chars)
    
    # Add common CJK punctuation
    cjk_punctuation = set('　—―‖…''""、。〈〉《》「」『』【】〔〕〖〗〘〙〚〛〜〝〞〟〰〾〿–')
    all_chars.update(cjk_punctuation)
    
    # Sort characters for readability
    sorted_chars = sorted(all_chars)
    
    # Create a text file with all characters
    chars_file = workspace / 'scripts' / 'font-chars.txt'
    with open(chars_file, 'w', encoding='utf-8') as f:
        f.write(''.join(sorted_chars))
    
    print(f"\nCollected {len(all_chars)} unique characters")
    print(f"Characters saved to: {chars_file}")
    
    # Count character types
    ascii_count = sum(1 for c in all_chars if ord(c) < 128)
    cjk_count = sum(1 for c in all_chars if ord(c) >= 0x4E00 and ord(c) <= 0x9FFF)
    other_count = len(all_chars) - ascii_count - cjk_count
    
    print(f"\nCharacter breakdown:")
    print(f"  ASCII: {ascii_count}")
    print(f"  CJK Unified Ideographs: {cjk_count}")
    print(f"  Other (punctuation, etc.): {other_count}")
    
    return chars_file

if __name__ == '__main__':
    main()

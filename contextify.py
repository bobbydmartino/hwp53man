#!/usr/bin/env python3

import os

# Extensions to include
INCLUDE_EXTS = {'.md', '.html', '.njk', '.css', '.json', '.yml', '.yaml'}

# Directories to skip
EXCLUDE_DIRS = {'node_modules', '_site', '.git', '__pycache__'}

def should_include(file):
    return os.path.splitext(file)[1] in INCLUDE_EXTS

def walk_dir(root='.'):
    output = []
    for dirpath, dirnames, filenames in os.walk(root):
        # Skip ignored directories
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]

        for file in sorted(filenames):
            if should_include(file):
                rel_path = os.path.relpath(os.path.join(dirpath, file), root)
                output.append(f"\n\n===== FILE: {rel_path} =====\n")
                try:
                    with open(os.path.join(dirpath, file), 'r', encoding='utf-8') as f:
                        output.append(f.read())
                except Exception as e:
                    output.append(f"[Could not read file: {e}]")

    return '\n'.join(output)

if __name__ == "__main__":
    content = walk_dir()
    with open('monofile.txt', 'w', encoding='utf-8') as out_file:
        out_file.write(content)
    print("✔ Created monofile.txt")

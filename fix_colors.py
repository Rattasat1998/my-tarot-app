import os
import re

TARGET_DIRS = [
    'src/components/home',
    'src/components/ui',
    'src/components/game'
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # We want to replace text-white with "text-slate-900 dark:text-white"
    # But only inside typical text elements (<h1..6>, <p>, or <div...>)
    # Exclude cases where there is a strong background color like bg-purple, bg-gradient, from-, to-
    
    modified = False
    new_content = ""
    
    # Simple line-by-line heuristic
    lines = content.split('\n')
    for i, line in enumerate(lines):
        if 'text-white' in line and not 'dark:text-white' in line:
            # Check if it's likely a button or badge which should stay white
            if any(x in line for x in ['bg-purple', 'bg-gradient', 'from-', 'to-', 'bg-blue', 'bg-green', 'bg-amber', 'bg-red', 'bg-black', 'bg-[#', 'text-white shadow-lg shadow-purple']):
                # skip
                new_content += line + '\n'
                continue
            
            # If it's a heading
            if re.search(r'<h[1-6].*?className=.*?>', line):
                line = line.replace('text-white', 'text-slate-900 dark:text-white')
                modified = True
            # If it's a paragraph
            elif re.search(r'<p.*?className=.*?>', line):
                line = line.replace('text-white', 'text-slate-900 dark:text-white')
                modified = True
            # If it's a div with font-bold or text-lg etc, and no bg-
            elif re.search(r'<div.*?className=.*?>', line) and 'bg-' not in line.replace('bg-white/10', ''):
                line = line.replace('text-white', 'text-slate-900 dark:text-white')
                modified = True
            # spans that don't have colored backgrounds
            elif re.search(r'<span.*?className=.*?>', line) and 'bg-' not in line.replace('bg-white/10', ''):
                line = line.replace('text-white', 'text-slate-900 dark:text-white')
                modified = True
            # If it's an icon or something else
            elif 'text-white' in line and 'hover:text-white' not in line and 'bg-' not in line:
                 # Check if the surrounding html tag is not a button
                 if '<button' not in line:
                     line = line.replace('text-white', 'text-slate-900 dark:text-white')
                     modified = True
        
        new_content += line + '\n'
        
    # Remove last newline
    if new_content.endswith('\n'):
        new_content = new_content[:-1]
        
    if modified and new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated: {filepath}")

for d in TARGET_DIRS:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith('.jsx'):
                process_file(os.path.join(root, file))

print("Done")

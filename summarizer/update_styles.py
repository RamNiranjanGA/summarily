import os
import re

def update_styles():
    jsx_path = 'src/summarizer.jsx'
    css_path = 'src/index.css'
    
    if not os.path.exists(jsx_path):
        print(f"Error: {jsx_path} not found.")
        return

    with open(jsx_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract CSS from <style>{` ... `}</style>
    style_match = re.search(r'<style>{`(.+?)`}</style>', content, re.DOTALL)
    if not style_match:
        print("No style block found in summarizer.jsx")
        return

    css_content = style_match.group(1)
    
    # Handle dynamic parts like ${isDragging ? ...}
    # We'll replace them with classes in the JSX and fixed values or variables in CSS
    
    # In CSS, replace ${isDragging ? 'var(--accent-primary)' : 'var(--card-border)'} 
    # with a class-based approach. 
    # But for now, let's just make them variables that we can toggle.
    
    # Actually, a better way is to define .drag-drop-zone.dragging in CSS
    css_content = css_content.replace(
        "border: 2px dashed ${isDragging ? 'var(--accent-primary)' : 'var(--card-border)'};",
        "border: 2px dashed var(--card-border);"
    )
    css_content += "\n.drag-drop-zone.dragging {\n  border-color: var(--accent-primary);\n  background: var(--drop-zone-hover);\n}\n"
    
    css_content = css_content.replace(
        "background: ${isDragging ? 'var(--drop-zone-hover)' : 'var(--drop-zone-bg)'};",
        "background: var(--drop-zone-bg);"
    )

    # Write to index.css
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_content)
    print(f"Successfully moved styles to {css_path}")

    # Remove style block from JSX
    new_jsx_content = re.sub(r'<style>{`(.+?)`}</style>', '', content, flags=re.DOTALL)
    
    # Update drag-drop-zone className
    new_jsx_content = new_jsx_content.replace(
        "className={`drag-drop-zone ${isReadingFile ? 'reading' : ''}`}",
        "className={`drag-drop-zone ${isReadingFile ? 'reading' : ''} ${isDragging ? 'dragging' : ''}`}"
    )
    
    # Remove unused React import if present (ESLint fix)
    new_jsx_content = new_jsx_content.replace("import React, { useState", "import { useState")

    with open(jsx_path, 'w', encoding='utf-8') as f:
        f.write(new_jsx_content)
    print(f"Successfully updated {jsx_path}")

    # Update main.jsx to import index.css if not already
    main_path = 'src/main.jsx'
    if os.path.exists(main_path):
        with open(main_path, 'r', encoding='utf-8') as f:
            main_content = f.read()
        if "import './index.css'" not in main_content:
            main_content = "import './index.css'\n" + main_content
            with open(main_path, 'w', encoding='utf-8') as f:
                f.write(main_content)
            print(f"Successfully updated {main_path}")

if __name__ == "__main__":
    update_styles()

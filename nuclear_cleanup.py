import os
import re

def clean_file(filepath):
    print(f"Nuclear cleaning {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        full_content = f.read()

    # 1. Extract Head
    head_match = re.search(r'<(head)>.*?</\1>', full_content, re.DOTALL | re.IGNORECASE)
    if not head_match:
        print(f"Skipping {filepath} (no head found)")
        return
    head = head_match.group(0)
    
    # 2. Extract Main Content (Keep everything from <main> or the first major container to the end of scripts)
    # Most pages have <main>...</main> and then some footer/scripts.
    # We want to identify the core content.
    main_match = re.search(r'(<main.*?</main>).*?(<footer.*?</footer)?', full_content, re.DOTALL | re.IGNORECASE)
    
    # If no <main>, look for common admin containers or just take everything after head and before </body>
    if not main_match:
        # Fallback for pages like admin-login which might not have <main>
        # Just take the first <div> that looks like content
        body_content_match = re.search(r'<body[^>]*>(.*)</body>', full_content, re.DOTALL | re.IGNORECASE)
        if not body_content_match:
            print(f"Skipping {filepath} (no body found)")
            return
        body_raw = body_content_match.group(1)
        # Remove known junk from body_raw
        body_raw = re.sub(r'<!-- Navbar -->.*?<!-- Mobile Menu Overlay -->.*?</div>', '', body_raw, flags=re.DOTALL)
        body_raw = re.sub(r'<nav.*?</nav>', '', body_raw, flags=re.DOTALL)
        body_raw = re.sub(r'<aside.*?</aside>', '', body_raw, flags=re.DOTALL)
        body_raw = re.sub(r'<!-- Topbar mobile -->.*?<header.*?</header>', '', body_raw, flags=re.DOTALL)
        # Remove repeated nav links (the "Massive repeated vertical list")
        body_raw = re.sub(r'<div class="flex flex-col space-y-4 text-lg font-bold overflow-y-auto">.*?</div>\s*</div>', '', body_raw, flags=re.DOTALL)
        body_raw = re.sub(r'<div class="flex flex-col space-y-6 text-xl font-bold">.*?</div>\s*</div>', '', body_raw, flags=re.DOTALL)
        main_content = body_raw
    else:
        main_content = main_match.group(1)
        footer = main_match.group(2) if main_match.group(2) else ""
        
        # Get scripts after footer
        scripts_match = re.findall(r'<script.*?</script>', full_content[full_content.find(footer or main_content):], re.DOTALL)
        scripts = "\\n".join([s for s in scripts_match if 'navbar' not in s]) # Exclude navbar scripts to re-add later
        main_content = main_content + "\\n" + footer + "\\n" + scripts

    # 3. Clean Main Content of any lingering nav junk
    main_content = re.sub(r'<!-- Sidebar -->.*?<aside.*?</aside>', '', main_content, flags=re.DOTALL)
    main_content = re.sub(r'<!-- Topbar mobile -->.*?<header.*?</header>', '', main_content, flags=re.DOTALL)
    main_content = re.sub(r'<nav.*?</nav>', '', main_content, flags=re.DOTALL)
    # Remove those annoying mobile header buttons if they are outside main
    main_content = re.sub(r'<header class="bg-white shadow-sm px-6 py-4 flex justify-between items-center md:hidden">.*?</header>', '', main_content, flags=re.DOTALL)

    # 4. Reconstruct head to ensure it has tailwind and NO navbar logic
    head = re.sub(r'<script>\s*\(function\(\)\s*\{.*?// Global Navbar Logic.*?\}\)\(\);\s*</script>', '', head, flags=re.DOTALL)
    head = re.sub(r'<script>\s*\(function\(\)\s*\{\s*const typeLabels.*?\}\)\(\);\s*</script>', '', head, flags=re.DOTALL)
    
    # 5. Build New File
    new_html = f"""<!DOCTYPE html>
<html lang="si">
{head}
<body class="bg-gray-50 flex flex-col min-h-screen">
    <div id="navbar-placeholder"></div>
    {main_content}
    <script src="js/navbar.js"></script>
</body>
</html>"""

    # Final cleanup
    # Replace literal \n strings with real newlines if they were accidentally injected
    new_html = new_html.replace("\\n", "\n")
    new_html = re.sub(r'<script></script>', '', new_html)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_html)

files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in files:
    clean_file(f)

print("Nuclear reconstruction complete. Site is now clean and modular.")

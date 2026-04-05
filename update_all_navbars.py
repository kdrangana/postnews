import os
import re

def update_file(filepath):
    print(f"Updating {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Broad cleanup of all previous navbar/sidebar artifacts
    content = re.sub(r'<!-- Navbar -->.*?<!-- Mobile Menu Overlay -->.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<nav.*?</nav>', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- Sidebar -->.*?<aside.*?</aside>', '', content, flags=re.DOTALL)
    content = re.sub(r'<!-- Topbar mobile -->.*?<header.*?</header>', '', content, flags=re.DOTALL)
    # Remove any scripts with navbar logic
    content = re.sub(r'<script>\s*\(function\(\)\s*\{.*?// NAVBAR_REFAC_LOGIC.*?\}\)\(\);\s*</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script>\s*\(function\(\)\s*\{\s*const typeLabels.*?\}\)\(\);\s*</script>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script>\s*\(function\(\)\s*\{\s*// NAVBAR_REFAC_LOGIC_V3.*?\}\)\(\);\s*</script>', '', content, flags=re.DOTALL)
    
    # Clean up corrupted body tags
    content = re.sub(r'\\1', '', content)
    
    # 2. Standardize Body and Layout
    body_pattern = re.compile(r'<body[^>]*>', re.IGNORECASE)
    content = body_pattern.sub('<body class="bg-gray-50 flex flex-col min-h-screen">', content)
    
    # Special fix for dashboard/admin pages layout
    content = content.replace('flex h-screen overflow-hidden', 'min-h-screen')
    content = content.replace('bg-gray-100 flex', 'bg-gray-50 flex flex-col')
    
    # 3. Inject Navbar Script inclusion (assuming it's not there)
    if 'js/navbar.js' not in content:
        if '</body>' in content:
            content = content.replace('</body>', '<script src="js/navbar.js"></script>\\n</body>')
        else:
            content += '\\n<script src="js/navbar.js"></script>'
            
    # 4. Ensure Tailwind config is present for primary colors
    if 'tailwind.config' not in content:
        tw_config = """
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af',
                            400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c',
                            800: '#9f1239', 900: '#881337',
                        }
                    }
                }
            }
        }
    </script>
"""
        if '</head>' in content:
            content = content.replace('</head>', tw_config + '</head>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in files:
    update_file(f)

print("Modular Navbar implementation successful.")

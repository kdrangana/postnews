import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll replace the word "තැපැල් පුවත්" inside navbar/sidebar headers with the logo,
# and we'll change blue/indigo colors to red/yellow tones.

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # 1. Update the tailwind config to use Red for primary
    primary_blue = """primary: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            900: '#1e3a8a',
                        }"""
    primary_red = """primary: {
                            50: '#fef2f2',
                            100: '#fee2e2',
                            500: '#ef4444',
                            600: '#dc2828',
                            700: '#b91c1c',
                            900: '#7f1d1d',
                        }"""
    content = content.replace(primary_blue, primary_red)
    
    # Update single-line primary config if any (e.g., in announcements.html)
    content = re.sub(r"primary: \{ 500: '[^']+', 600: '[^']+' \}", "primary: { 500: '#ef4444', 600: '#dc2828' }", content)

    # 2. Replace hardcoded blue and indigo tailwind classes to red and yellow across all HTML
    content = content.replace('blue-50', 'red-50')
    content = content.replace('blue-100', 'red-100')
    content = content.replace('blue-400', 'red-400')
    content = content.replace('blue-500', 'red-500')
    content = content.replace('blue-600', 'red-600')
    content = content.replace('blue-700', 'red-700')
    content = content.replace('indigo-400', 'yellow-400')
    content = content.replace('indigo-600', 'yellow-500')
    content = content.replace('indigo-700', 'yellow-600')

    # 3. Replace the logo text strings in Navbars and Sidebars and Footers
    # The logo in navbar (index.html, etc)
    content = re.sub(
        r'<span[^>]*class="[^"]*text-2xl[^"]*"[^>]*>\s*තැපැල්\s*පුවත්\s*</span>',
        '<img src="logo.png" alt="Sri Lanka POST News Logo" class="h-12 w-auto">',
        content
    )
    content = re.sub(
        r'<a href="index\.html"[^>]*class="[^"]*text-2xl[^"]*"[^>]*>\s*තැපැල්\s*පුවත්\s*</a>',
        '<a href="index.html" class="flex items-center"><img src="logo.png" alt="Sri Lanka POST News Logo" class="h-12 w-auto"></a>',
        content
    )
    # The logo in sidebar (add-post.html, dashboard.html)
    content = re.sub(
        r'<h2 class="[^"]*text-2xl[^"]*">\s*තැපැල් පුවත්\s*</h2>',
        '<img src="logo.png" alt="Sri Lanka POST News Logo" class="h-10 w-auto">',
        content
    )
    # The logo in footer (all pages) - keeping the text but adding logo? The user said "Replace the name with the logo".
    # In footer:
    content = re.sub(
        r'<p[^>]*class="[^"]*text-2xl[^"]*"[^>]*>\s*තැපැල් පුවත්\s*</p>',
        '<img src="logo.png" alt="Sri Lanka POST News Logo" class="h-12 w-auto mb-4">',
        content
    )

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Update complete")

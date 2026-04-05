import os
import re

files = [f for f in os.listdir('.') if f.endswith('.html')]

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # Navbar image (index.html, announcements.html, contact.html)
    # The current one: class="h-12 w-auto"
    content = re.sub(
        r'<img src="Logo\.png" alt="Sri Lanka POST News Logo" class="h-12 w-auto">',
        '<img src="Logo.png" alt="Sri Lanka POST News Logo" class="h-16 md:h-20 w-auto object-contain mix-blend-multiply">',
        content
    )
    
    # Actually wait, mix-blend-multiply might look weird if background is dark. Navbar has glass (white ops). 
    # Let's just use nice sizing and alignment.
    content = re.sub(
        r'<img src="Logo\.png" alt="Sri Lanka POST News Logo" class="h-12 w-auto">',
        '<img src="Logo.png" alt="Sri Lanka POST News Logo" class="h-16 md:h-20 w-auto object-contain">',
        content
    )
    # For A tags wrapping it (in announcements.html)
    content = re.sub(
        r'<a href="index\.html"[^>]*class="flex items-center"[^>]*>\s*<img src="Logo\.png" alt="Sri Lanka POST News Logo" class="(h-[0-9a-z-]+ w-auto(?: mb-\d+)?(?: object-contain)?)">\s*</a>',
        '<a href="index.html" class="flex items-center py-2"><img src="Logo.png" alt="Sri Lanka POST News Logo" class="h-16 md:h-20 w-auto object-contain"></a>',
        content
    )

    # In case the regex above missed index.html navbar img which isn't in an <a> tag
    content = re.sub(
        r'<img src="Logo\.png" alt="Sri Lanka POST News Logo" class="(?![^"]*h-16)[^"]*">',
        '<img src="Logo.png" alt="Sri Lanka POST News Logo" class="h-16 md:h-20 w-auto object-contain">',
        content
    )
    
    # Sidebar image (add-post.html, dashboard.html)
    # Right now it's in a <div class="p-6 border-b border-gray-800">
    # Let's make that div flex to center the logo.
    # The logo was originally class="h-10 w-auto"
    content = content.replace(
        '<div class="p-6 border-b border-gray-800">',
        '<div class="p-6 border-b border-red-900 flex justify-center items-center bg-white">'
    )
    content = content.replace(
        '<div class="p-6 border-b border-red-900 flex justify-center items-center bg-white">\n                <img src="Logo.png" alt="Sri Lanka POST News Logo" class="h-16 md:h-20 w-auto object-contain">',
        '<div class="p-6 border-b border-red-900 flex justify-center items-center bg-white px-4 py-8">\n                <img src="Logo.png" alt="Sri Lanka POST News Logo" class="max-h-20 w-auto object-contain">'
    )
    
    # Make sure we don't break existing ones
    content = re.sub(
        r'<div class="p-6 border-b border-[a-z0-9-]+">\s*<img src="Logo\.png" alt="[^"]*" class="[^"]*">\s*</div>',
        '<div class="p-6 border-b border-red-900 flex justify-center items-center bg-gray-50">\n                <img src="Logo.png" alt="Sri Lanka POST News Logo" class="max-h-24 w-auto object-contain">\n            </div>',
        content
    )

    # Footer image
    # Note: Footer dark red is bg-red-950, so maybe logo has a transparent bg. 
    # original had mb-4. We match anything:
    content = re.sub(
        r'<img src="Logo\.png" alt="Sri Lanka POST News Logo" class="(h-\d+ w-auto mb-4[^"]*)">',
        '<img src="Logo.png" alt="Sri Lanka POST News Logo" class="h-20 md:h-24 w-auto object-contain mb-6 drop-shadow-md bg-white p-2 rounded-xl">',
        content
    )

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Sizes and alignments updated")

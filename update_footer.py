import os

files = [f for f in os.listdir('.') if f.endswith('.html')]

# We'll replace the footer background color

for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()

    # The footer currently has: class="bg-gray-900 text-white ...
    # Let's change bg-gray-900 to bg-red-900 or bg-red-950 for dark red
    content = content.replace('bg-gray-900 text-white py-12', 'bg-red-950 text-white py-12')
    # If some footer lines have `border-gray-800` we can change to `border-red-900`
    content = content.replace('border-gray-800 pb-8', 'border-red-900 pb-8')
    content = content.replace('border-t border-gray-800', 'border-t border-red-900')
    
    # Let's also make sure Logo.png is exact case if it matters
    content = content.replace('src="logo.png"', 'src="Logo.png"')

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Footer updated")

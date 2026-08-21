import re
import json

with open('artifacts/mobile/constants/words.ts', 'r', encoding='utf-8') as f:
    words_content = f.read()

# Match entries with id, category, spellings
matches = re.findall(r"id:\s*'([^']+)',\s*spellings:\s*\{\s*en:\s*'([^']+)'\s*\},\s*category:\s*'([^']+)'", words_content)

categorized = {}
all_words = []

for item_id, en_word, category in matches:
    if category not in categorized:
        categorized[category] = []
    if en_word not in categorized[category]:
        categorized[category].append(en_word)
    if en_word not in all_words:
        all_words.append(en_word)

with open('artifacts/mobile/constants/expandedWords.ts', 'r', encoding='utf-8') as f:
    exp_content = f.read()

exp_matches = re.findall(r"\['[^']+',\s*'[^']+',\s*'([^']+)'", exp_content)
if 'animals' not in categorized:
    categorized['animals'] = []
for w in exp_matches:
    if w not in categorized['animals']:
        categorized['animals'].append(w)
    if w not in all_words:
        all_words.append(w)

print("TOTAL_COUNT:", len(all_words))
print("\n--- BY CATEGORY ---")
for cat, words in categorized.items():
    print(f"\n### {cat.upper()} ({len(words)} words):")
    print(", ".join(words))

print("\n--- ALL COMBINED (COMMA SEPARATED) ---")
print(", ".join(all_words))

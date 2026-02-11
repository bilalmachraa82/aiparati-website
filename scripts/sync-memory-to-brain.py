#!/usr/bin/env python3
"""
Sync memory/*.md files to Second Brain (Neon PostgreSQL)
Runs daily via cron to keep database in sync with local memory files.
"""

import os
import re
import glob
from datetime import datetime, date
import psycopg2
from psycopg2.extras import Json

DB_URL = os.getenv("JARVIS_DB_URL", "postgresql://neondb_owner:npg_q5VkobCMUju4@ep-winter-bread-aghork1i.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require")
MEMORY_DIR = os.path.expanduser("~/clawd/memory")

def get_conn():
    return psycopg2.connect(DB_URL)

def parse_memory_file(filepath):
    """Parse a memory markdown file and extract entries"""
    entries = []
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract date from filename (YYYY-MM-DD.md)
    filename = os.path.basename(filepath)
    date_match = re.match(r'(\d{4}-\d{2}-\d{2})\.md', filename)
    if not date_match:
        return entries
    
    file_date = date_match.group(1)
    
    # Parse entries - look for patterns like:
    # - [HH:MM] content
    # - content
    # ## Section headers
    
    current_section = None
    
    for line in content.split('\n'):
        line = line.strip()
        
        # Section header
        if line.startswith('## '):
            current_section = line[3:].strip()
            continue
        
        # Entry with timestamp
        time_match = re.match(r'^-\s*\[(\d{2}:\d{2})\]\s*(.+)$', line)
        if time_match:
            time_str = time_match.group(1)
            entry_content = time_match.group(2)
            entries.append({
                'content': entry_content,
                'timestamp': f"{file_date} {time_str}",
                'section': current_section,
                'source': filepath
            })
            continue
        
        # Entry without timestamp
        entry_match = re.match(r'^-\s+(.+)$', line)
        if entry_match:
            entry_content = entry_match.group(1)
            if entry_content and len(entry_content) > 5:
                entries.append({
                    'content': entry_content,
                    'timestamp': file_date,
                    'section': current_section,
                    'source': filepath
                })
    
    return entries

def categorize_entry(content):
    """Determine memory type based on content"""
    content_lower = content.lower()
    
    if any(word in content_lower for word in ['aprendido', 'lição', 'nunca', 'sempre', 'regra', 'bug', 'corrigido']):
        return 'learning'
    elif any(word in content_lower for word in ['decidido', 'decisão', 'escolhido', 'optámos']):
        return 'decision'
    elif any(word in content_lower for word in ['ideia', 'pensar em', 'considerar', 'talvez']):
        return 'idea'
    elif any(word in content_lower for word in ['bilal', 'cliente', 'reunião', 'contacto']):
        return 'event'
    else:
        return 'fact'

def sync_entries_to_db(entries):
    """Insert entries into the database"""
    conn = get_conn()
    cur = conn.cursor()
    
    inserted = 0
    skipped = 0
    
    for entry in entries:
        content = entry['content']
        memory_type = categorize_entry(content)
        
        # Check if already exists (avoid duplicates)
        cur.execute(
            "SELECT id FROM memories WHERE content = %s",
            (content,)
        )
        if cur.fetchone():
            skipped += 1
            continue
        
        # Insert
        cur.execute("""
            INSERT INTO memories (content, memory_type, subject, created_at)
            VALUES (%s, %s, %s, %s)
        """, (content, memory_type, entry.get('section'), entry.get('timestamp')))
        inserted += 1
        
        # If it's a learning, also add to learnings table
        if memory_type == 'learning':
            cur.execute("""
                INSERT INTO learnings (lesson, context, source)
                VALUES (%s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (content, entry.get('section'), entry.get('source')))
    
    conn.commit()
    conn.close()
    
    return inserted, skipped

def update_daily_summary(file_date, entries):
    """Create/update daily summary"""
    conn = get_conn()
    cur = conn.cursor()
    
    # Extract highlights (entries with emoji or important markers)
    highlights = [e['content'] for e in entries if any(c in e['content'] for c in ['✅', '🔴', '⚠️', '🎯', '💰', '🐛'])][:5]
    
    # Extract lessons
    lessons = [e['content'] for e in entries if categorize_entry(e['content']) == 'learning'][:3]
    
    # Count completed items
    completed = len([e for e in entries if '✅' in e['content']])
    
    try:
        cur.execute("""
            INSERT INTO daily_summaries (date, highlights, lessons_learned, todos_completed)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (date) DO UPDATE SET
                highlights = EXCLUDED.highlights,
                lessons_learned = EXCLUDED.lessons_learned,
                todos_completed = EXCLUDED.todos_completed
        """, (file_date, highlights, lessons, completed))
        conn.commit()
    except Exception as e:
        print(f"Warning: Could not update daily summary: {e}")
    
    conn.close()

def main():
    print("🧠 Syncing memory files to Second Brain...")
    
    # Find all memory files
    memory_files = glob.glob(os.path.join(MEMORY_DIR, "*.md"))
    memory_files = [f for f in memory_files if re.match(r'\d{4}-\d{2}-\d{2}\.md', os.path.basename(f))]
    
    total_inserted = 0
    total_skipped = 0
    
    for filepath in sorted(memory_files):
        filename = os.path.basename(filepath)
        file_date = filename.replace('.md', '')
        
        entries = parse_memory_file(filepath)
        if not entries:
            continue
        
        inserted, skipped = sync_entries_to_db(entries)
        total_inserted += inserted
        total_skipped += skipped
        
        # Update daily summary
        update_daily_summary(file_date, entries)
        
        print(f"  📄 {filename}: {inserted} new, {skipped} existing")
    
    print(f"\n✅ Sync complete: {total_inserted} entries added, {total_skipped} already existed")

if __name__ == '__main__':
    main()

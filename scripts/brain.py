#!/usr/bin/env python3
"""
Jarvis Second Brain - CLI Tool
Usage:
    brain.py idea "content" [--category CAT] [--tags tag1,tag2]
    brain.py learn "lesson" [--context CTX]
    brain.py remember "content" [--type TYPE] [--subject SUBJ]
    brain.py search "query"
    brain.py today [--summary "text"]
"""

import os
import sys
import json
import argparse
from datetime import date
import psycopg2
from psycopg2.extras import RealDictCursor

DB_URL = os.getenv("JARVIS_DB_URL", "postgresql://neondb_owner:npg_q5VkobCMUju4@ep-winter-bread-aghork1i.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require")

def get_conn():
    return psycopg2.connect(DB_URL)

def add_idea(content, category=None, tags=None, source=None, importance=5):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO ideas (content, category, tags, source, importance) VALUES (%s, %s, %s, %s, %s) RETURNING id",
        (content, category, tags, source, importance)
    )
    id = cur.fetchone()[0]
    conn.commit()
    conn.close()
    print(f"💡 Idea #{id} saved")
    return id

def add_learning(lesson, context=None, source=None, applies_to=None):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO learnings (lesson, context, source, applies_to) VALUES (%s, %s, %s, %s) RETURNING id",
        (lesson, context, source, applies_to)
    )
    id = cur.fetchone()[0]
    conn.commit()
    conn.close()
    print(f"📚 Learning #{id} saved")
    return id

def add_memory(content, memory_type=None, subject=None, confidence=1.0):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO memories (content, memory_type, subject, confidence) VALUES (%s, %s, %s, %s) RETURNING id",
        (content, memory_type, subject, confidence)
    )
    id = cur.fetchone()[0]
    conn.commit()
    conn.close()
    print(f"🧠 Memory #{id} saved")
    return id

def search(query, limit=10):
    conn = get_conn()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    # Search across all tables
    results = []
    
    cur.execute("SELECT 'idea' as type, id, content, category, created_at FROM ideas WHERE content ILIKE %s LIMIT %s", (f'%{query}%', limit))
    results.extend(cur.fetchall())
    
    cur.execute("SELECT 'learning' as type, id, lesson as content, context as category, created_at FROM learnings WHERE lesson ILIKE %s LIMIT %s", (f'%{query}%', limit))
    results.extend(cur.fetchall())
    
    cur.execute("SELECT 'memory' as type, id, content, memory_type as category, created_at FROM memories WHERE content ILIKE %s LIMIT %s", (f'%{query}%', limit))
    results.extend(cur.fetchall())
    
    conn.close()
    
    print(f"🔍 Found {len(results)} results for '{query}':")
    for r in results:
        print(f"  [{r['type']}#{r['id']}] {r['content'][:80]}...")
    
    return results

def update_today(summary=None, highlights=None, lessons=None):
    conn = get_conn()
    cur = conn.cursor()
    today = date.today()
    
    cur.execute("""
        INSERT INTO daily_summaries (date, summary, highlights, lessons_learned)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (date) DO UPDATE SET
            summary = COALESCE(EXCLUDED.summary, daily_summaries.summary),
            highlights = COALESCE(EXCLUDED.highlights, daily_summaries.highlights),
            lessons_learned = COALESCE(EXCLUDED.lessons_learned, daily_summaries.lessons_learned)
        RETURNING id
    """, (today, summary, highlights, lessons))
    
    id = cur.fetchone()[0]
    conn.commit()
    conn.close()
    print(f"📅 Daily summary updated (#{id})")
    return id

def main():
    parser = argparse.ArgumentParser(description="Jarvis Second Brain")
    subparsers = parser.add_subparsers(dest='command')
    
    # idea
    p_idea = subparsers.add_parser('idea', help='Add an idea')
    p_idea.add_argument('content')
    p_idea.add_argument('--category', '-c')
    p_idea.add_argument('--tags', '-t')
    p_idea.add_argument('--importance', '-i', type=int, default=5)
    
    # learn
    p_learn = subparsers.add_parser('learn', help='Add a learning')
    p_learn.add_argument('lesson')
    p_learn.add_argument('--context', '-c')
    p_learn.add_argument('--source', '-s')
    
    # remember
    p_remember = subparsers.add_parser('remember', help='Add a memory')
    p_remember.add_argument('content')
    p_remember.add_argument('--type', '-t')
    p_remember.add_argument('--subject', '-s')
    
    # search
    p_search = subparsers.add_parser('search', help='Search brain')
    p_search.add_argument('query')
    
    # today
    p_today = subparsers.add_parser('today', help='Update daily summary')
    p_today.add_argument('--summary', '-s')
    
    args = parser.parse_args()
    
    if args.command == 'idea':
        tags = args.tags.split(',') if args.tags else None
        add_idea(args.content, args.category, tags, importance=args.importance)
    elif args.command == 'learn':
        add_learning(args.lesson, args.context, args.source)
    elif args.command == 'remember':
        add_memory(args.content, args.type, args.subject)
    elif args.command == 'search':
        search(args.query)
    elif args.command == 'today':
        update_today(args.summary)
    else:
        parser.print_help()

if __name__ == '__main__':
    main()

#!/usr/bin/env python3
"""Check memory database statistics"""

import os
import psycopg2
from datetime import datetime, timedelta

DB_URL = os.getenv("JARVIS_DB_URL", "postgresql://neondb_owner:npg_q5VkobCMUju4@ep-winter-bread-aghork1i.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require")

def get_conn():
    return psycopg2.connect(DB_URL)

def main():
    conn = get_conn()
    cur = conn.cursor()

    # Total memories
    cur.execute("SELECT COUNT(*) FROM memories")
    total_memories = cur.fetchone()[0]

    # Learnings this week
    one_week_ago = datetime.now() - timedelta(days=7)
    cur.execute("""
        SELECT COUNT(*) FROM learnings
        WHERE created_at >= %s
    """, (one_week_ago,))
    learnings_week = cur.fetchone()[0]

    # Daily summaries count
    cur.execute("SELECT COUNT(*) FROM daily_summaries")
    daily_summaries = cur.fetchone()[0]

    # Breakdown by type
    cur.execute("""
        SELECT memory_type, COUNT(*) as count
        FROM memories
        GROUP BY memory_type
        ORDER BY count DESC
    """)
    by_type = dict(cur.fetchall())

    # Recent learnings (last 3)
    cur.execute("""
        SELECT lesson, created_at
        FROM learnings
        ORDER BY created_at DESC
        LIMIT 3
    """)
    recent_lessons = cur.fetchall()

    conn.close()

    print("📊 Second Brain Statistics")
    print("=" * 40)
    print(f"Total Memories: {total_memories}")
    print(f"Learnings This Week: {learnings_week}")
    print(f"Daily Summaries: {daily_summaries}")
    print("\nBy Type:")
    for mtype, count in by_type.items():
        print(f"  • {mtype}: {count}")
    print("\nRecent Learnings:")
    for lesson, created in recent_lessons:
        print(f"  • {lesson[:60]}...")
    print(f"    ({created.strftime('%Y-%m-%d')})")

if __name__ == '__main__':
    main()

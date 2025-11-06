import sqlite3

conn = sqlite3.connect('crops.db')
c = conn.cursor()

# Create the crops table
c.execute('''
CREATE TABLE IF NOT EXISTS crops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    crop_name TEXT,
    mandi TEXT,
    msr REAL,
    max_capacity INTEGER
)
''')

# Insert some initial sample data
c.executemany('''
INSERT INTO crops (crop_name, mandi, msr, max_capacity)
VALUES (?, ?, ?, ?)
''', [
    ('Wheat', 'Mysore', 2500, 1000),
    ('Rice', 'Mandya', 3000, 1200),
    ('Maize', 'Bangalore', 2000, 800)
])

conn.commit()
conn.close()
print("✅ New crops.db created successfully.")

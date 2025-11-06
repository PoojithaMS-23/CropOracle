from db_config import get_db_connection

def get_farmer_by_credentials(username, password):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    query = "SELECT * FROM farmer_details WHERE LOWER(username) = LOWER(%s) AND password = %s"

    cursor.execute(query, (username, password))
    farmer = cursor.fetchone()
    print("DEBUG:", username, password, "->", farmer)

    cursor.close()
    conn.close()
    return farmer


def farmer_exists(username):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM farmer_details WHERE username = %s", (username,))
    exists = cursor.fetchone() is not None
    cursor.close()
    conn.close()
    return exists


def create_farmer(name, username, password, location, age, phone):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        INSERT INTO farmer_details (name, username, password, location, age, phone)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (name, username, password, location, age, phone))
    conn.commit()

    cursor.close()
    conn.close()

def update_farmer(farmer_id, name, username, password, location, age, phone):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    query = """
        UPDATE farmer_details
        SET name = %s,
            username = %s,
            password = %s,
            location = %s,
            age = %s,
            phone = %s
        WHERE farmer_id = %s
    """
    cursor.execute(query, (name, username, password, location, age, phone, farmer_id))
    conn.commit()
    
    cursor.close()
    conn.close()
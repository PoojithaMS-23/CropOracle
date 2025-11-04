from db_config import get_db_connection

class Capacity:

    @staticmethod
    def get_max_capacity(mandi, crop):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT c.max_capacity 
            FROM capacity c
            JOIN admin_price_variations a ON c.crop_id = a.crop_id
            WHERE c.mandi_name = %s AND a.crop_name = %s
        """
        cursor.execute(query, (mandi, crop))
        row = cursor.fetchone()
        conn.close()
        return row['max_capacity'] if row else 1000  # default

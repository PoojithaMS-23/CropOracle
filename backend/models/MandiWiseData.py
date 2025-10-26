from db_config import get_db_connection
from datetime import datetime, timedelta

class MandiWiseData:

    @staticmethod
    def get_total_yield_last_15_days(mandi, crop, timestamp):
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT SUM(yield) AS total_yield
            FROM mandi_wise_data
            WHERE mandi_name = %s
              AND crop = %s
            #   AND created_at BETWEEN %s AND %s
        """
        start_date = timestamp - timedelta(days=15)
        cursor.execute(query, (mandi, crop, start_date, timestamp))
        row = cursor.fetchone()
        conn.close()
        return row['total_yield'] or 0

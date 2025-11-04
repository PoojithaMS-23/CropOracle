import mysql.connector
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

def get_db_connection():
    """
    Get database connection with fallback to None if database is not available.
    This allows the application to run in a limited mode without database access.
    """
    try:
        connection = mysql.connector.connect(
            host=os.getenv('DB_HOST', 'localhost'),
            user=os.getenv('DB_USER', 'root'),
            password=os.getenv('DB_PASSWORD', 'root123'),
            database=os.getenv('DB_NAME', 'FarmerDB'),
            connect_timeout=5  # 5 second timeout
        )
        if connection.is_connected():
            logger.info("Database connection successful")
            return connection
        else:
            logger.error("Database connection failed: Could not establish connection")
            return None
    except mysql.connector.Error as err:
        logger.error(f"Database connection failed: {err}. Running in limited mode.")
        return None
    except Exception as e:
        logger.error(f"Unexpected error while connecting to database: {e}")
        return None

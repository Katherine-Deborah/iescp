import redis
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def test_redis_connection():
    try:
        r = redis.Redis(host='localhost', port=6379, db=0)
        r.ping()
        logger.info("Connected to Redis!")
    except redis.ConnectionError as e:
        logger.error(f"Failed to connect to Redis: {e}")

test_redis_connection()
class Config(object):
  DEBUG = False
  TESTING = False

class DevelopmentConfig(Config):
  DEBUG = True
  SQLALCHEMY_DATABASE_URI = 'sqlite:///iespc.db'
  SECRET_KEY = "thisissecter"
  SECURITY_PASSWORD_SALT = "thisissaltt"
  SQLALCHEMY_TRACK_MODIFICATIONS = False
  WTF_CSRF_ENABLED = False
  SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'
  CACHE_TYPE = "RedisCache"
  CACHE_REDIS_HOST = "localhost"
  CACHE_REDIS_PORT = 6379
  CACHE_REDIS_DB = 3
  SMTP_PORT = 1025
  SMTP_SERVER = "localhost"
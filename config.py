import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev'
    SQLALCHEMY_DATABASE_URI = 'mysql://username:password@localhost/your_database'
    SQLALCHEMY_TRACK_MODIFICATIONS = False 
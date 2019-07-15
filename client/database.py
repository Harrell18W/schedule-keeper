import mysql.connector
import os

import queries

db = mysql.connector.connect(user=os.environ['SK_CLIENT_DB_USER'],
                             password=os.environ['SK_CLIENT_DB_PASSWORD'],
                             host='localhost',
                             database='sk_db')

def get_employees():
    newQuery = db.cursor()
    newQuery.execute(queries.get_employees)
    return list(newQuery)

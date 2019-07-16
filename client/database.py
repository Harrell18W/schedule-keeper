import mysql.connector
import os

import queries

db = mysql.connector.connect(user=os.environ['SK_CLIENT_DB_USER'],
                             password=os.environ['SK_CLIENT_DB_PASSWORD'],
                             host='localhost',
                             database='sk_db')


def add_employee(employee):
    new_query = db.cursor()
    new_query.execute(queries.add_employee, employee)
    db.commit()


def delete_employee(slack_user_id):
    new_query = db.cursor()
    new_query.execute(queries.delete_employee, (slack_user_id,))
    db.commit()


def update_employee(employee):
    new_query = db.cursor()
    new_query.execute(queries.update_employee, employee)
    db.commit()


def get_employees():
    new_query = db.cursor()
    new_query.execute(queries.get_employees)
    return list(new_query)


def employee_from_slack_id(slack_user_id):
    new_query = db.cursor()
    new_query.execute(queries.employee_from_slack_id, (slack_user_id,))
    result = list(new_query)
    return result[0] if len(result) else None


def add_customer(customer):
    new_query = db.cursor()
    new_query.execute(queries.add_customer, customer)
    db.commit()


def delete_customer(name):
    new_query = db.cursor()
    new_query.execute(queries.delete_customer, (name,))
    db.commit()


def get_customers():
    new_query = db.cursor()
    new_query.execute(queries.get_customers)
    return list(new_query)

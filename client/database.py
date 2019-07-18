import mysql.connector

import queries


class ScheduleKeeperDatabase(object):

    def __init__(self, host, username, password):
        self.db = mysql.connector.connect(user=username, password=password,
                                          host=host, database='sk_db',
                                          autocommit=True)

    def close_connection(self):
        self.db.close()

    def add_employee(self, employee):
        new_query = self.db.cursor()
        new_query.execute(queries.add_employee, employee)

    def delete_employee(self, slack_user_id):
        new_query = self.db.cursor()
        new_query.execute(queries.delete_employee, (slack_user_id,))

    def update_employee(self, employee):
        new_query = self.db.cursor()
        new_query.execute(queries.update_employee, employee)

    def get_employees(self):
        new_query = self.db.cursor()
        new_query.execute(queries.get_employees)
        return list(new_query)

    def get_employee(self, identifier):
        if identifier[0] == 'U':
            query = queries.employee_from_slack_id
        else:
            query = queries.employee_from_id
        new_query = self.db.cursor()
        new_query.execute(query, (identifier,))
        result = list(new_query)
        return result[0] if len(result) else None

    def add_customer(self, customer):
        new_query = self.db.cursor()
        new_query.execute(queries.add_customer, customer)

    def get_customer(self, customer_id):
        new_query = self.db.cursor()
        new_query.execute(queries.get_customer, (customer_id,))
        result = list(new_query)
        return result[0] if len(result) else None

    def delete_customer(self, name):
        new_query = self.db.cursor()
        new_query.execute(queries.delete_customer, (name,))

    def get_customers(self):
        new_query = self.db.cursor()
        new_query.execute(queries.get_customers)
        return list(new_query)

    def delete_active_clock(self, clock_id):
        new_query = self.db.cursor()
        new_query.execute(queries.delete_active_clock, (clock_id,))

    def get_active_clocks(self):
        new_query = self.db.cursor()
        new_query.execute(queries.get_active_clocks)
        result = list(new_query)
        return result

    def delete_finished_clock(self, clock_id):
        new_query = self.db.cursor()
        new_query.execute(queries.delete_finished_clock, (clock_id,))

    def get_finished_clocks(self):
        new_query = self.db.cursor()
        new_query.execute(queries.get_finished_clocks)
        return list(new_query)

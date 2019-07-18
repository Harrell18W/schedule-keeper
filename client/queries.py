add_employee: str = '''INSERT INTO Employees
(firstName, lastName, email, phone, slackUserId, id)
VALUES
(%s, %s, %s, %s, %s, %s)'''

check_if_employee_in_db: str = '''SELECT * FROM Employees
WHERE slackUserId = %s'''

delete_employee: str = '''DELETE FROM Employees
WHERE slackUserId = %s'''

update_employee: str = '''UPDATE Employees SET
firstName = %s,
lastName = %s,
email = %s,
phone = %s,
slackUserId = %s
WHERE id = %s'''

get_employees: str = 'SELECT * FROM Employees'

employee_from_id: str = '''SELECT * FROM Employees
WHERE id = %s'''

employee_from_slack_id: str = '''SELECT * FROM Employees
WHERE slackUserId = %s'''

add_customer: str = '''INSERT INTO Customers
(name, customShorthands, id)
VALUES
(%s, %s, %s)'''

get_customer: str = '''SELECT * FROM Customers
WHERE id = %s'''

delete_customer: str = '''DELETE FROM Customers
WHERE name = %s'''

get_customers: str = 'SELECT * FROM Customers'

delete_active_clock: str = '''DELETE FROM ActiveClocks
WHERE id = %s'''

get_active_clocks: str = 'SELECT * FROM ActiveClocks'

delete_finished_clock: str = '''DELETE FROM FinishedClocks
WHERE id = %s'''

get_finished_clocks: str = 'SELECT * FROM FinishedClocks'

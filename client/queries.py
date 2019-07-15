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
phone = %s
WHERE slackUserId = %s'''

get_employees: str = 'SELECT * FROM Employees'

employee_from_slack_id: str = '''SELECT * FROM Employees
WHERE slackUserId = %s'''

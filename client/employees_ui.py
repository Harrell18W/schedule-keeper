from PySide2.QtWidgets import QTableWidgetItem

import database as db

employees_header_items = ['First Name', 'Last Name', 'Email', 'Phone',
                          'Slack User ID', 'ID']

def refresh_employees(window):
    tw = window.employees_tablewidget

    def inner():
        employees = db.get_employees()
        tw.setColumnCount(len(employees_header_items))
        tw.setRowCount(len(employees))
        tw.setHorizontalHeaderLabels(employees_header_items)
        for row in range(0, len(employees)):
            for column in range(0, len(employees[row])):
                item = QTableWidgetItem(employees[row][column])
                tw.setItem(row, column, item)
    return inner

from PySide2.QtWidgets import QTableWidgetItem, QHeaderView
from PySide2.QtWidgets import QAbstractItemView

import apputils

active_jobs_header_items = ['Customer', 'Employee', 'Started', 'Time Elapsed']
active_jobs_header_items += ['ID']
finished_jobs_header_items = ['Customer', 'Employee', 'Started', 'Finished']
finished_jobs_header_items += ['Time Elapsed', 'ID']


def tablewidgets_setup(main_window):
    active_tw = main_window.window.activejobs_tablewidget
    finished_tw = main_window.window.finishedjobs_tablewidget
    active_tw.setSelectionBehavior(QAbstractItemView.SelectRows)
    finished_tw.setSelectionBehavior(QAbstractItemView.SelectRows)
    active_tw.setEditTriggers(QAbstractItemView.NoEditTriggers)
    finished_tw.setEditTriggers(QAbstractItemView.NoEditTriggers)
    active_tw.verticalHeader().setVisible(False)
    finished_tw.verticalHeader().setVisible(False)
    active_tw.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)
    finished_tw.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)


def refresh_jobs(main_window):
    active_tw = main_window.window.activejobs_tablewidget
    active_tw.setColumnCount(len(active_jobs_header_items))
    active_tw.setHorizontalHeaderLabels(active_jobs_header_items)
    finished_tw = main_window.window.finishedjobs_tablewidget
    finished_tw.setColumnCount(len(finished_jobs_header_items))
    finished_tw.setHorizontalHeaderLabels(finished_jobs_header_items)

    def inner():
        active_jobs = main_window.db.get_active_clocks()
        active_tw.setRowCount(len(active_jobs))
        for row in range(0, len(active_jobs)):
            job = active_jobs[row]
            customer = main_window.db.get_customer(job[1])
            if customer:
                customer_item = QTableWidgetItem(customer[0])
            else:
                customer_item = QTableWidgetItem('Customer not found')
            active_tw.setItem(row, 0, customer_item)
            employee = main_window.db.get_employee(job[0])
            if employee:
                employee_str = employee[0] + ' ' + employee[1]
                employee_item = QTableWidgetItem(employee_str)
            else:
                employee_item = QTableWidgetItem('Employee not found')
            active_tw.setItem(row, 1, employee_item)
            started_item = QTableWidgetItem(job[2].strftime('%b %d, %I:%M%p'))
            active_tw.setItem(row, 2, started_item)
            time_elapsed = apputils.time_elapsed(job[2], job[2].now())
            active_tw.setItem(row, 3, QTableWidgetItem(time_elapsed))
            active_tw.setItem(row, 4, QTableWidgetItem(job[3]))
        active_tw.sortItems(0)

        finished_jobs = main_window.db.get_finished_clocks()
        finished_tw.setRowCount(len(finished_jobs))
        for row in range(0, len(finished_jobs)):
            job = finished_jobs[row]
            customer = main_window.db.get_customer(job[1])
            if customer:
                customer_item = QTableWidgetItem(customer[0])
            else:
                customer_item = QTableWidgetItem('Customer not found')
            finished_tw.setItem(row, 0, customer_item)
            employee = main_window.db.get_employee(job[0])
            if employee:
                employee_str = employee[0] + ' ' + employee[1]
                employee_item = QTableWidgetItem(employee_str)
            else:
                employee_item = QTableWidgetItem('Employee not found')
            finished_tw.setItem(row, 1, employee_item)
            started_item = QTableWidgetItem(job[2].strftime('%b %d, %I:%M%p'))
            finished_tw.setItem(row, 2, started_item)
            finished_item = QTableWidgetItem(job[3].strftime('%b %d, %I:%M%p'))
            finished_tw.setItem(row, 3, finished_item)
            time_elapsed = apputils.time_elapsed(job[2], job[3])
            finished_tw.setItem(row, 4, QTableWidgetItem(time_elapsed))
            finished_tw.setItem(row, 5, QTableWidgetItem(job[4]))
        finished_tw.sortItems(0)

    tablewidgets_setup(main_window)
    inner()
    return inner


def delete_active_job(main_window):
    tw = main_window.window.activejobs_tablewidget

    def inner():
        selected = tw.selectedRanges()
        if len(selected) == 0:
            main_window.show_error('No job selected.')
            return
        top_row = selected[0].topRow()
        bottom_row = selected[0].bottomRow()
        for row in range(top_row, bottom_row + 1):
            job_id = tw.item(row, 4).text()
            main_window.db.delete_active_clock(job_id)
        refresh_jobs(main_window)

    return inner


def delete_finished_job(main_window):
    tw = main_window.window.finishedjobs_tablewidget

    def inner():
        selected = tw.selectedRanges()
        if len(selected) == 0:
            main_window.show_error('No job selected.')
            return
        top_row = selected[0].topRow()
        bottom_row = selected[0].bottomRow()
        for row in range(top_row, bottom_row + 1):
            job_id = tw.item(row, 5).text()
            main_window.db.delete_finished_clock(job_id)
        refresh_jobs(main_window)

    return inner

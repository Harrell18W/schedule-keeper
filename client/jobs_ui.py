from PySide2.QtWidgets import QTableWidgetItem, QHeaderView
from PySide2.QtWidgets import QAbstractItemView

import datetime as dt
from openpyxl.utils.exceptions import InvalidFileException

import apputils
from excel import Spreadsheet

active_jobs_header_items = ['Customer', 'Employee', 'Started', 'Travel']
active_jobs_header_items += ['Time Elapsed', 'ID']
finished_jobs_header_items = ['Customer', 'Employee', 'Started', 'Finished']
finished_jobs_header_items += ['Travel', 'Time Elapsed', 'ID']


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
            time_elapsed = apputils.time_elapsed(job[2], job[2].now(), job[3])
            travel = 'Yes' if job[3] else 'No'
            active_tw.setItem(row, 3, QTableWidgetItem(travel))
            active_tw.setItem(row, 4, QTableWidgetItem(time_elapsed))
            active_tw.setItem(row, 5, QTableWidgetItem(job[4]))
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
            travel = 'Yes' if job[4] else 'No'
            finished_tw.setItem(row, 4, QTableWidgetItem(travel))
            time_elapsed = apputils.time_elapsed(job[2], job[3], job[4])
            finished_tw.setItem(row, 5, QTableWidgetItem(time_elapsed))
            finished_tw.setItem(row, 6, QTableWidgetItem(job[5]))
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
            job_id = tw.item(row, 5).text()
            main_window.db.delete_active_clock(job_id)
        refresh_jobs(main_window)

    return inner


def enter_finished_jobs(main_window):
    tw = main_window.window.finishedjobs_tablewidget
    checkbox = main_window.window.delete_after_entering_checkbox

    def inner():
        selected = tw.selectedRanges()
        if len(selected) == 0:
            main_window.show_error('No job selected.')
            return

        inserted = []
        inserted_ids = []
        for selection in selected:
            top_row = selection.topRow()
            bottom_row = selection.bottomRow()

            try:
                workbook = Spreadsheet(main_window.excel_filename)
            except InvalidFileException:
                msg = 'Unable to open ' + main_window.excel_filename
                main_window.show_error(msg)
                return
            workbook.backup(main_window.config['Directories']['backup'])

            for row in range(top_row, bottom_row + 1):
                current_year = str(dt.datetime.today().year)
                finished_str = tw.item(row, 3).text() + ' ' + current_year
                finished = dt.datetime.strptime(finished_str,
                                                '%b %d, %I:%M%p %Y')
                customer = tw.item(row, 0).text()
                elapsed_str = tw.item(row, 5).text()
                elapsed = apputils.time_elapsed_to_hours(elapsed_str)

                ok, msg = workbook.insert_job(finished, customer, elapsed)
                if not ok:
                    msg += '\nNo changes were made to the Excel workbook.'
                    main_window.show_error(msg)
                    return
                inserted.append(msg)
                job_id = tw.item(row, 6).text()
                inserted_ids.append(job_id)

        workbook.save()

        if checkbox.isChecked():
            for job_id in inserted_ids:
                main_window.db.delete_finished_clock(job_id)
            refresh_jobs(main_window)

        # not an error but shh
        msg = 'Inserted the following data into the spreadsheet:\n\n'
        for item in inserted:
            msg += item + '\n'
        main_window.show_error(msg)

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
            job_id = tw.item(row, 6).text()
            main_window.db.delete_finished_clock(job_id)
        refresh_jobs(main_window)

    return inner

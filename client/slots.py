from PySide2.QtCore import SIGNAL, QObject

import jobs_ui
import customers_ui
import employees_ui

widgets = [
    {
        'name': 'customers_tablewidget',
        'signal': 'currentCellChanged(int,int,int,int)',
        'fn': customers_ui.populate_customers_details
    },
    {
        'name': 'nickname_add_pushbutton',
        'signal': 'clicked()',
        'fn': customers_ui.add_nickname
    },
    {
        'name': 'nickname_delete_pushbutton',
        'signal': 'clicked()',
        'fn': customers_ui.delete_nickname
    },
    {
        'name': 'customers_add_pushbutton',
        'signal': 'clicked()',
        'fn': customers_ui.add_customer
    },
    {
        'name': 'customers_delete_pushbutton',
        'signal': 'clicked()',
        'fn': customers_ui.delete_customer
    },
    {
        'name': 'customers_refresh_pushbutton',
        'signal': 'clicked()',
        'fn': customers_ui.refresh_customers
    },
    {
        'name': 'employees_tablewidget',
        'signal': 'currentCellChanged(int,int,int,int)',
        'fn': employees_ui.populate_employees_details
    },
    {
        'name': 'employees_add_pushbutton',
        'signal': 'clicked()',
        'fn': employees_ui.add_employee
    },
    {
        'name': 'employees_update_pushbutton',
        'signal': 'clicked()',
        'fn': employees_ui.update_employee
    },
    {
        'name': 'employees_delete_pushbutton',
        'signal': 'clicked()',
        'fn': employees_ui.delete_employee
    },
    {
        'name': 'employees_refresh_pushbutton',
        'signal': 'clicked()',
        'fn': employees_ui.refresh_employees
    },
    {
        'name': 'jobs_refresh_all_pushbutton',
        'signal': 'clicked()',
        'fn': jobs_ui.refresh_jobs
    },
    {
        'name': 'delete_selected_activejobs_pushbutton',
        'signal': 'clicked()',
        'fn': jobs_ui.delete_active_job
    },
    {
        'name': 'delete_selected_finishedjobs_pushbutton',
        'signal': 'clicked()',
        'fn': jobs_ui.delete_finished_job
    }
]


def connect_slots(main_window):
    for item in widgets:
        widget = getattr(main_window.window, item['name'])
        QObject.connect(widget, SIGNAL(item['signal']),
                        item['fn'](main_window))

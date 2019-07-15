from PySide2.QtCore import SIGNAL, QObject

import database as db
import employees_ui
import tables

def refresh_employees(window):
    tw = window.employees_tablewidget

    def inner():
        tables.load_employees(tw, db.get_employees())
    return inner

widgets = {
    'employees_refresh_pushbutton': {
        'signal': 'clicked()',
        'fn': employees_ui.refresh_employees
    }
}

def connect_slots(window):
    for widget_name in widgets.keys():
        widget = getattr(window, widget_name)
        QObject.connect(widget, SIGNAL(widgets[widget_name]['signal']),
                        widgets[widget_name]['fn'](window))

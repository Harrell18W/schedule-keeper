from PySide2.QtCore import SIGNAL, QObject

import employees_ui

widgets = {
    'employees_refresh_pushbutton': {
        'signal': 'clicked()',
        'fn': employees_ui.refresh_employees
    },
    'employees_add_pushbutton': {
        'signal': 'clicked()',
        'fn': employees_ui.add_employee
    },
    'employees_tablewidget': {
        'signal': 'cellClicked(int,int)',
        'fn': employees_ui.populate_employees_details
    },
    'employees_delete_pushbutton': {
        'signal': 'clicked()',
        'fn': employees_ui.delete_employee
    },
    'employees_update_pushbutton': {
        'signal': 'clicked()',
        'fn': employees_ui.update_employee
    }
}

def connect_slots(main_window):
    for widget_name in widgets.keys():
        widget = getattr(main_window.window, widget_name)
        QObject.connect(widget, SIGNAL(widgets[widget_name]['signal']),
                        widgets[widget_name]['fn'](main_window))

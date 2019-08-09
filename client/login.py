from PySide2.QtUiTools import QUiLoader
from PySide2.QtCore import QFile, SIGNAL, QObject
from PySide2.QtWidgets import QFileDialog

import re
import os

import config

config_path = './sk-client.ini'

host_re = re.compile(r'^(localhost|(\d{1,3}\.){3}\d{1,3})$')

widgets = [
    {
        'name': 'remember_address_checkbox',
        'signal': 'stateChanged(int)',
        'fn': 'address_checkbox_changed'
    },
    {
        'name': 'remember_username_checkbox',
        'signal': 'stateChanged(int)',
        'fn': 'username_checkbox_changed'
    },
    {
        'name': 'login_pushbutton',
        'signal': 'clicked()',
        'fn': 'login'
    },
    {
        'name': 'browse_pushbutton',
        'signal': 'clicked()',
        'fn': 'open_file_dialog'
    }
]


class LoginWindow(object):

    def __init__(self, main_window):
        self.main_window = main_window

        login_file = QFile('ui/login_dialog.ui')
        login_file.open(QFile.ReadOnly)

        self.loader = QUiLoader()
        self.dialog = self.loader.load(login_file)

        login_file.close()

        self.connect_slots()

        self.read_config()

    def show(self):
        self.dialog.show()

    def hide(self):
        self.dialog.hide()

    def connect_slots(self):
        for item in widgets:
            widget = getattr(self.dialog, item['name'])
            fn = getattr(self, item['fn'])
            QObject.connect(widget, SIGNAL(item['signal']), fn)

    def address_checkbox_changed(self, state):
        if not state:
            self.dialog.remember_username_checkbox.setChecked(False)
            self.dialog.remember_password_checkbox.setChecked(False)
        self.dialog.remember_username_checkbox.setEnabled(state)

    def username_checkbox_changed(self, state):
        if not state:
            self.dialog.remember_password_checkbox.setChecked(False)
        self.dialog.remember_password_checkbox.setEnabled(state)

    def read_config(self):
        saved_config = config.load_config()
        if 'filename' in saved_config['UserInfo']:
            filename = saved_config['UserInfo']['filename']
            self.dialog.file_path_lineedit.setText(filename)
        if 'host' in saved_config['UserInfo']:
            host = saved_config['UserInfo']['host']
            self.dialog.address_lineedit.setText(host)
            self.dialog.remember_address_checkbox.setChecked(True)
        if 'username' in saved_config['UserInfo']:
            username = saved_config['UserInfo']['username']
            self.dialog.username_lineedit.setText(username)
            self.dialog.remember_username_checkbox.setChecked(True)
        if 'password' in saved_config['UserInfo']:
            password = saved_config['UserInfo']['password']
            self.dialog.password_lineedit.setText(password)
            self.dialog.remember_password_checkbox.setChecked(True)

    def update_config(self, filename, host, username=None, password=None):
        new_config = {}
        new_config['filename'] = filename
        new_config['host'] = host
        if username:
            new_config['username'] = username
            if password:
                new_config['password'] = password
        config.write_config(new_config)

    def open_file_dialog(self):
        dialog = QFileDialog(self.dialog)
        dialog.setFileMode(QFileDialog.ExistingFile)
        dialog.setDirectory(os.environ['HOME'])
        if dialog.exec_():
            filename = dialog.selectedFiles()[0]
            self.dialog.file_path_lineedit.setText(filename)

    def login(self):
        filename = self.dialog.file_path_lineedit.text()
        host = self.dialog.address_lineedit.text()
        if not bool(host_re.match(host)):
            self.main_window.show_error('Invalid host %s.' % host)
            return
        username = self.dialog.username_lineedit.text()
        if not username:
            self.main_window.show_error('Blank username.')
            return
        password = self.dialog.password_lineedit.text()
        if not password:
            self.main_window.show_error('Blank password.')
            return

        if self.dialog.remember_password_checkbox.isChecked():
            self.update_config(filename, host, username, password)
        elif self.dialog.remember_username_checkbox.isChecked():
            self.update_config(filename, host, username)
        elif self.dialog.remember_address_checkbox.isChecked():
            self.update_config(filename, host)

        self.main_window.set_config(config.load_config())
        self.main_window.set_excel_file(filename)
        self.main_window.db_login(host, username, password)

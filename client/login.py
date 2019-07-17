import configparser
from PySide2.QtUiTools import QUiLoader
from PySide2.QtCore import QFile, SIGNAL, QObject

import re
from os.path import exists as file_exists

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

        self.load_config()

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

    def load_config(self):
        if not file_exists(config_path):
            return
        config = configparser.ConfigParser()
        config.read(config_path)
        if 'address' in config['credentials']:
            host = config['credentials']['address']
            self.dialog.address_lineedit.setText(host)
            self.dialog.remember_address_checkbox.setChecked(True)
        if 'username' in config['credentials']:
            username = config['credentials']['username']
            self.dialog.username_lineedit.setText(username)
            self.dialog.remember_username_checkbox.setChecked(True)
        if 'password' in config['credentials']:
            password = config['credentials']['password']
            self.dialog.password_lineedit.setText(password)
            self.dialog.remember_password_checkbox.setChecked(True)

    def write_config(self, host, username=None, password=None):
        config = configparser.ConfigParser()
        config['credentials'] = {'address': host}
        if username:
            config['credentials']['username'] = username
            if password:
                config['credentials']['password'] = password
        with open(config_path, 'w') as config_file:
            config.write(config_file)

    def login(self):
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
            self.write_config(host, username, password)
        elif self.dialog.remember_username_checkbox.isChecked():
            self.write_config(host, username)
        elif self.dialog.remember_address_checkbox.isChecked():
            self.write_config(host)

        self.main_window.db_login(host, username, password)

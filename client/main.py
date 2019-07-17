from mysql.connector.errors import DatabaseError
from PySide2.QtUiTools import QUiLoader
from PySide2.QtWidgets import QApplication
from PySide2.QtCore import QFile, SIGNAL
import sys

import database
import login
import slots


class MainWindow(object):

    def __init__(self):
        self.app = QApplication(sys.argv)
        ui_file = QFile('ui/main_window.ui')
        error_file = QFile('ui/error_dialog.ui')
        login_file = QFile('ui/login_dialog.ui')
        ui_file.open(QFile.ReadOnly)
        error_file.open(QFile.ReadOnly)
        login_file.open(QFile.ReadOnly)

        self.loader = QUiLoader()
        self.window = self.loader.load(ui_file)

        self.error = self.loader.load(error_file)
        self.error.ok_pushbutton.connect(SIGNAL('clicked()'), self.hide_error)

        self.login = login.LoginWindow(self)
        self.login.show()

        ui_file.close()
        error_file.close()

    def show_error(self, msg):
        self.error.message_label.setText(msg)
        self.error.show()

    def hide_error(self):
        self.error.hide()

    def db_login(self, host, user, password):
        # self.db = database.ScheduleKeeperDatabase(host, user, password)
        try:
            self.db = database.ScheduleKeeperDatabase(host, user, password)
        except DatabaseError as err:
            if 'Can\'t connect' in err.msg:
                msg = 'Unable to connect to MySQL database at %s.' % host
                self.show_error(msg)
                return
            elif 'Access denied' in err.msg:
                msg = 'Access denied to user with given credentials.'
                self.show_error(msg)
                return
        slots.connect_slots(self)
        self.login.hide()
        self.window.show()


if __name__ == '__main__':
    main = MainWindow()
    sys.exit(main.app.exec_())

import sys
from PySide2.QtUiTools import QUiLoader
from PySide2.QtWidgets import QApplication
from PySide2.QtCore import QFile, SIGNAL

import slots


class MainWindow(object):

    def __init__(self):
        self.app = QApplication(sys.argv)
        ui_file = QFile('ui/main_window.ui')
        error_file = QFile('ui/error_dialog.ui')
        ui_file.open(QFile.ReadOnly)
        error_file.open(QFile.ReadOnly)

        self.loader = QUiLoader()
        self.window = self.loader.load(ui_file)

        self.error = self.loader.load(error_file)
        self.error.ok_pushbutton.connect(SIGNAL('clicked()'), self.hide_error)

        ui_file.close()
        error_file.close()

        slots.connect_slots(self)

        self.window.show()

    def show_error(self, msg):
        self.error.message_label.setText(msg)
        self.error.show()

    def hide_error(self):
        self.error.hide()


if __name__ == '__main__':
    main = MainWindow()
    sys.exit(main.app.exec_())

import sys
from PySide2.QtUiTools import QUiLoader
from PySide2.QtWidgets import QApplication
from PySide2.QtCore import QFile

import slots

app = QApplication(sys.argv)

ui_file = QFile('ui/main_window.ui')
ui_file.open(QFile.ReadOnly)

loader = QUiLoader()
window = loader.load(ui_file)
ui_file.close()

slots.connect_slots(window)

window.show()

sys.exit(app.exec_())

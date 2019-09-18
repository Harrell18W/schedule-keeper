# schedule-keeper
System to keep track of employee hours and store them in an Excel file

Requirements:
* MySQL server
* Node.js
  * mysql for interacting with database
  * @slack/bolt for communicating with employees
* Python 3
  * PySide2 for GUI
  * mysql-connector for interacting with database
  * openpyxl for interacting with Excel files
  * built with [fman-build-system](https://build-system.fman.io/)

Directories:
* client/: Python client
    * ui/: Qt UI files
* docs/: documentation
* server/: Node.js server

# schedule-keeper
System to keep track of employee hours and store them in an Excel file

Uses:
* Python 3
  * PyQt5
  * openpyxl
  * toml

Files:
* docs/: documentation
* src/SpreadsheetHandler.py: interfaces with spreadsheets containing employee hours
* test-docs/: files to aid with testing

![alt-text](https://raw.githubusercontent.com/prophetofxenu/schedule-keeper/master/docs/flow-diagram.png "Flow Diagram")

Process of communicator (no GUI, runs indefinitely):
1. Communicate with employees
2. Enter information into database accordingly

Process of spreadsheet handler (GUI, runs when needed):
1. Connect to database
2. Check for new entries in database
3. Transfer new entries in database to Excel file after user confirmation

Possible Methods of Communication with Employees:
* SMS through twilio ($1/month)
* Email
* Online messaging service

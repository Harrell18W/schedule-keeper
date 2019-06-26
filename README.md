# schedule-keeper
System to keep track of employee hours and store them in an Excel file

Uses:
* MongoDB (or different database application)
* Node.js
  * mongodb and mongoose for interacting with database
  * email/slack/twilio for communicating with employees
* Python 3
  * PyQt5 for GUI
  * openpyxl for interacting with Excel files
  * toml for storing configuration settings

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

Methods of Communication with Employees:
* SMS through twilio ($1/month + $5/month for ngrok + small charges per message)
    * Convenient for employees (nothing extra required)
    * Most complicated method
    * Requires webhook URL (can be done through ngrok for $5/month)
* Email (Free)
    * Least convenient
    * Second most complicated method
    * Requires reserved email
* Slack (Free)
    * Requires app
    * Least complicated
    * Can be done through group chat so others can see what's going on as it happens

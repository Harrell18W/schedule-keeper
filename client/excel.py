import datetime as dt
import openpyxl as pyxl


class Spreadsheet(object):

    def __init__(self, filename):
        self.filename = filename
        self.workbook = pyxl.load_workbook(filename)
        active_year = dt.datetime(2000, 1, 1).now().strftime('%Y')
        self.active_sheet = self.workbook[active_year]

    def save(self):
        self.workbook.save(self.filename)

    def _get_customer_column(self, customer):
        for column in range(1, self.active_sheet.max_column + 1):
            value = self.active_sheet.cell(row=1, column=column).value
            if value == customer:
                return column

    def _get_date_row(self, date):
        for row in range(1, self.active_sheet.max_row + 1):
            value = self.active_sheet.cell(row=row, column=1).value
            if ((isinstance(value, dt.date) or
                    isinstance(value, dt.datetime)) and
                    value.year == date.year and
                    value.month == date.month and
                    value.day == date.day):
                return row

    def insert_job(self, date, customer, hours):
        column = self._get_customer_column(customer)
        if not column:
            return False, 'Customer %s not found in spreadsheet.' % customer
        row = self._get_date_row(date)
        if not row:
            return False, 'Date %s not found in spreadsheet.' \
                % date.strftime('%b %d %Y')
        cell = self.active_sheet.cell(row=row, column=column)
        column_letter = pyxl.utils.get_column_letter(column)
        value = round(hours, 2)
        try:
            cell.value = cell.value + value if cell.value else value
        except TypeError:
            return False, 'Invalid data exists in cell ' \
                '%s%d.' % (column_letter, row)
        return True, '%s, %s, %.2f hours (%s%d)' \
            % (customer, date.strftime('%b %d %Y'), value, column_letter, row)

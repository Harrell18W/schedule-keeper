from PySide2.QtWidgets import QTableWidgetItem, QListWidgetItem
from PySide2.QtWidgets import QAbstractItemView, QHeaderView
import re

import apputils

customers_header_items = ['Name', 'Nicknames', 'ID']

nickname_re = re.compile(r'^\w+$')


def customers_tablewidget_setup(main_window):
    tw = main_window.window.customers_tablewidget
    tw.setSelectionBehavior(QAbstractItemView.SelectRows)
    tw.setSelectionMode(QAbstractItemView.SingleSelection)
    tw.setEditTriggers(QAbstractItemView.NoEditTriggers)
    tw.verticalHeader().setVisible(False)
    tw.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)


def parse_nicknames_str(nicknames):
    nicknames = str(nicknames)[2:-1]
    items = list(map(lambda x: x.strip()[1:-1], nicknames[1:-1].split(',')))
    result = ''
    for i in range(0, len(items)):
        result += items[i]
        if i < len(items) - 1:
            result += ', '
    return result


def parse_nicknames_list(nicknames):
    return parse_nicknames_str(nicknames).split(', ')


def populate_customers_details(main_window):
    tw = main_window.window.customers_tablewidget
    name_te = main_window.window.customers_name_lineedit
    nicknames_lw = main_window.window.customers_nicknames_listwidget
    nicknames_te = main_window.window.customers_nicknames_lineedit

    def inner(row, column):
        if row == -1 and column == -1:
            name_te.setText('')
            nicknames_lw.clear()
            nicknames_te.setText('')
            return
        name_te.setText(tw.item(row, 0).text())
        nicknames = tw.item(row, 1).text().split(', ')
        nicknames_lw.clear()
        for nickname in nicknames:
            if nickname:
                nicknames_lw.addItem(QListWidgetItem(nickname))

    return inner


def get_nicknames(main_window):
    nicknames_lw = main_window.window.customers_nicknames_listwidget
    results = []
    for i in range(0, nicknames_lw.count()):
        text = nicknames_lw.item(i).text()
        results.append(text)
    return results


def add_nickname(main_window):
    nicknames_lw = main_window.window.customers_nicknames_listwidget
    name_te = main_window.window.customers_name_lineedit
    nicknames_te = main_window.window.customers_nicknames_lineedit

    def inner():
        name = name_te.text()
        if not name:
            msg = 'No customer specified. Please either select one '
            msg += 'or add a name in the box.'
            main_window.show_error(msg)
            return
        nickname = nicknames_te.text().upper().strip()
        if not nickname:
            main_window.show_error('No nickname given.')
            return
        if not bool(nickname_re.match(nickname)):
            main_window.show_error('Invalid nickname: %s' % nickname)
            return
        if nickname == name:
            main_window.show_error('Cannot use customer name as nickname.')
        if nickname in get_nicknames(main_window):
            main_window.show_error('Nickname %s already exists.' % nickname)
            return
        nicknames_lw.addItem(QListWidgetItem(nickname))
        nicknames_te.setText('')

    return inner


def delete_nickname(main_window):
    nicknames_lw = main_window.window.customers_nicknames_listwidget

    def inner():
        row = nicknames_lw.currentRow()
        nicknames_lw.takeItem(row)

    return inner


def populate_nickname_lineedit(main_window):
    nicknames_lw = main_window.window.customers_nicknames_listwidget
    nicknames_te = main_window.window.customers_nicknames_lineedit

    def inner():
        item = nicknames_lw.currentItem()
        text = item.text() if item else ''
        nicknames_te.setText(text)

    return inner


def add_customer(main_window):
    name_te = main_window.window.customers_name_lineedit

    def inner():
        name = name_te.text().strip()
        if not name:
            main_window.show_error('No name given for customer.')
            return
        nicknames = get_nicknames(main_window)
        existing_customers = main_window.db.get_customers()
        for customer in existing_customers:
            if customer[0].upper() == name.upper():
                msg = 'Customer %s already exists.' % customer[0]
                main_window.show_error(msg)
                return
            if name.upper() in parse_nicknames_list(customer[1].upper()):
                msg = 'A customer exists with nickname %s.' % name.upper()
                main_window.show_error(msg)
                return
            for nickname in nicknames:
                if nickname == customer[0].upper():
                    msg = 'A customer exists with name %s.' % customer[0]
                    main_window.show_error(msg)
                    return
                if nickname in parse_nicknames_list(customer[1].upper()):
                    msg = 'A customer exists with nickname %s.' % nickname
                    main_window.show_error(msg)
                    return

        nicknames = str(nicknames).replace('\'', '"')
        customer_id = apputils.str_id()
        customer = (name, nicknames, customer_id)
        main_window.db.add_customer(customer)
        refresh_customers(main_window)

    return inner


def delete_customer(main_window):
    name_te = main_window.window.customers_name_lineedit

    def inner():
        name = name_te.text().strip()
        if not name:
            main_window.show_error('No name given.')
            return
        main_window.db.delete_customer(name)
        refresh_customers(main_window)
        populate_customers_details(main_window)(-1, -1)

    return inner


def refresh_customers(main_window):
    tw = main_window.window.customers_tablewidget
    customers_tablewidget_setup(main_window)

    def inner():
        customers = main_window.db.get_customers()
        tw.setColumnCount(len(customers_header_items))
        tw.setRowCount(len(customers))
        tw.setHorizontalHeaderLabels(customers_header_items)
        for row in range(0, len(customers)):
            for column in range(0, len(customers_header_items)):
                text = customers[row][column]
                if column == customers_header_items.index('Nicknames'):
                    text = parse_nicknames_str(text)
                text = str(text) if text else None
                item = QTableWidgetItem(text)
                tw.setItem(row, column, item)
        tw.sortItems(0)

    inner()
    return inner

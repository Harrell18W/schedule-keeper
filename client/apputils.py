from math import floor
from random import choices
import re

elapsed_re = re.compile(r'(\d+ hours, )?\d+ minutes \((\d+\.\d{2})\)')


def str_id():
    return ''.join(choices('abcdef0123456789', k=32))


def quarter_round(hours):
    total = floor(hours)
    total += ((hours % 1) // 0.25) * 0.25
    if hours % 1 % 0.25 > 0:
        total += 0.25
    return total


def time_elapsed(dt1, dt2):
    delta = dt1 - dt2 if dt1 > dt2 else dt2 - dt1
    hours = delta.seconds // 3600
    minutes = (delta.seconds - hours * 3600) // 60
    hours_float = quarter_round(hours + (minutes / 60))
    if hours:
        return '%d hours, %d minutes (%.2f)' % (hours, minutes, hours_float)
    else:
        return '%d minutes (%.2f)' % (minutes, hours_float)


def time_elapsed_to_hours(elapsed_str):
    match = elapsed_re.match(elapsed_str)
    return float(match.group(2))

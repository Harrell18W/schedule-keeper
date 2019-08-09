from random import choices
import re

elapsed_re = re.compile(r'((\d+) hours, )?(\d+) minutes')


def str_id():
    return ''.join(choices('abcdef0123456789', k=32))


def time_elapsed(dt1, dt2):
    delta = dt1 - dt2 if dt1 > dt2 else dt2 - dt1
    hours = delta.seconds // 3600
    minutes = (delta.seconds - hours * 3600) // 60
    if hours:
        return '%d hours, %d minutes' % (hours, minutes)
    else:
        return '%d minutes' % minutes


def time_elapsed_to_hours(elapsed_str):
    match = elapsed_re.match(elapsed_str)
    hours = int(match.group(2) if match.group(2) else 0)
    hours += int(match.group(3)) / 60
    return hours

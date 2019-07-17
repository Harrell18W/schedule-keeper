from random import choices


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

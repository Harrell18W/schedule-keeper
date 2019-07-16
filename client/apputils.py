from random import choices


def str_id():
    return ''.join(choices('abcdef0123456789', k=32))

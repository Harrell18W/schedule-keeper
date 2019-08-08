import configparser
import os

folder_path = os.environ['HOME'] + '/Documents/Schedule Keeper/'
backup_path = folder_path + 'backups/'
config_path = folder_path + 'config.ini'
log_path = folder_path + 'logs/'


def init_config():
    print(folder_path)
    if not os.path.exists(folder_path):
        os.mkdir(folder_path)
    if not os.path.exists(backup_path):
        os.mkdir(backup_path)
    if not os.path.exists(log_path):
        os.mkdir(log_path)

    if not os.path.exists(config_path):
        write_config({})


def load_config():
    init_config()
    if not os.path.exists(config_path):
        return {}
    config = configparser.ConfigParser()
    config.read(config_path)
    return config


def write_config(config):
    new_config = configparser.ConfigParser()
    new_config['UserInfo'] = {}
    for key in config.keys():
        new_config.set('UserInfo', key, config[key])
    with open(config_path, 'w') as config_file:
        new_config.write(config_file)

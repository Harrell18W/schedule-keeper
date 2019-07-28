# Setting up Schedule Keeper Server on Ubuntu Server

These instructions were tested on Ubuntu Server 18.04.

## Prerequisites:
* A machine, physical or virtual, running Ubuntu Server, already set up
* A MySQL server
* A reverse proxy server acting on a domain, such as Apache or Nginx
* An existing Slack workspace

## 1. Prepare Ubuntu Server

If the timezone has not been set, set it with:

`sudo dpkg-reconfigure tzdata`

The Node.js package in the default Ubuntu repositories is outdated.
A newer version is available in the
[NodeSource](https://github.com/nodesource/distributions/)
repository. This repository is secure and endorsed by Node.js. At the time of
writing, the newest LTS version of Node is v10.

Add the respository to the Ubuntu Server with:

`curl -sL https://dev.nodesource.com/setup_10.x | sudo -E bash -`

and install the nodejs package with:

`sudo apt install -y nodejs`

Create a service user for SK (username doesn't have to be "skserver", but be sure to
account for differences later in instructions):

`sudo adduser skserver`

## 2. Set up reverse proxy

This is dependent on whatever webserver you use. Create an endpoint on your domain,
such as "https://domain.com/skserver", and forward requests to a free port.
By default, port 57678 is used but it can be changed as shown later.

## 3. Prepare MySQL database

Both the server and the client will connect to a MySQL server and expect to find a 
database called "sk_db". The server will automatically create the necessary tables,
but it must be granted access first.

Login to the MySQL server and create the database:

`CREATE DATABASE sk_db;`

Create the user the SK server will login as, replacing "username", "host", and "password":

`CREATE USER 'username'@'host' IDENTIFIED BY 'password';`

and give it access to the new sk_db database:

`GRANT ALL PRIVILEGES ON sk_db.* TO 'username'@'host';`

Repeat this process with different credentials to create the MySQL user for the client.

After changes have been made:

`FLUSH PRIVILEGES;`

## 4. Setup Slack - Part 1

Head to the [Slack API dashboard.](https://api.slack.com/apps) After logging in,
click "Create New App". Name it whatever you like, and choose your workspace.

Click Basic Information. Copy the Signing Secret for later use.

Click "OAuth & Permissions" and scroll to Scopes. Add the scopes
"bot" and "commands" and click Save Changes.

Click Bot Users. Create a Bot User with whatever Display Name you like, and
a username such as "sk_user". Optionally set the bot to always appear online.
If you do not switch this on, the bot will always appear offline. When you're finished,
click Add Bot.

Click Install App and install the app to your workspace. Afterwards, copy the Bot User
OAuth Access Token for later use. Sometimes the copy button doesn't work, so after
clicking it paste your clipboard somewhere and verify that it did copy the token.

Leave this page open - you will need to come back to it later.

## 5. Setup SK server


Create a symlink between you and skserver:

`sudo ln -sf /home/you/schedule-keeper/ /home/skserver/`

Copy the systemd service file into the system directory:

`sudo cp /home/you/schedule-keeper/server/sk-server.service
/lib/systemd/server/`

Edit it with your editor of choice (such as `sudo nano`) and fill in:
* SK_PORT (Optional): The port the reverse proxy will forward requests to, if not 57678.
Be sure to uncomment this line if you're not using the default
* SK_DB_HOST: The address of the MySQL server
* SK_DB_USER: The server's MySQL user
* SK_DB_PASSWORD: The server's MySQL password
* SK_SLACK_SIGNING_SECRET: The signing secret from part 5
* SK_SLACK_BOT_TOKEN: The bot token from part 5
* Also edit the WorkingDirectory and ExecStart paths if not using skserver as
the service user, as well as the User variable.

When done editing, start the service and verify that it started successfully:

`sudo systemctl start sk-server`

`systemctl status sk-server`

If it failed to start, double check your login parameters. You can also try
starting the server from the commandline by exporting the environment
variables yourself, cding into schedule-keeper/server and running:

`npm run start`

This will output raw JavaScript errors, which may show that the server was unable to
authenticate with Slack or login to the MySQL database. However, this should only be
used to diagnose errors.

To start the server on boot:

`sudo systemctl enable sk-server`

## 6. Setup Slack - Part 2

On the Slack app page, click Event Subscriptions. Enable Events and paste your domain's
endpoint in the Request URL box, appending /slack/events. For instance:
https://domain.com/skserver/slack/events. Slack will try to contact the app. If it
fails, check your reverse proxy and verify the app is running.

Click Interactive Components. Enable Interactivity and paste the same URL from
the previous step into the Request URL box. Click Save Changes.

Click Slash Commands. Add the following commands by clicking Create New Command
for each one and filling in the information:

* /clockin
    * Request URL: same as others
    * Short Description: Clock in with a customer
    * Usage Hint: [time] [customer]
* /clockout
    * Request URL: same as others
    * Short Description: Clock out of active session
    * Usage Hint: [time]
* /register
    * Request URL: same as others
    * Short Description: Register with database

To test the bot, open the Slack App. The bot user you created should be in your workspace
under Apps. Click it, and send it the /register command. If it responds, the bot is
working. No further configuration can be performed without the client.

## Troubleshooting

If the MySQL server is restarted, the server needs to be restarted as well:

`sudo systemctl restart sk-server`
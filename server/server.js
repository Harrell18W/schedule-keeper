//TODO redo styling across project
const { App } = require('@slack/bolt');
const db = require('./database');

const actions = require('./actions');
const commands = require('./commands');

// Create Slack client
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/clockin', commands.clockinResponse);
app.command('/clockout', commands.clockoutResponse);

app.action(/^customer_select_[0-9a-z]{32}$/, actions.clockinRequestResponse);
app.action(/^clockin_request_cancel_[0-9a-z]{32}$/, actions.clockinRequestCancel);

async function slack_start() {
    await app.start(process.env.PORT || 3500);

    console.log('Slack client started');
}

slack_start();
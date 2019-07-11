//TODO redo styling across project
const { App } = require('@slack/bolt');
const db = require('./database');

const Responses = require('./responses');

// Create Slack client
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/clockin', Responses.clockinResponse);

app.action(/^request_[0-9a-z]{32}$/, Responses.clockinRequestResponse);

async function slack_start() {
    await app.start(process.env.PORT || 3500);

    console.log('Slack client started');
}

slack_start();
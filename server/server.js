const { App } = require('@slack/bolt');

const Responses = require('./responses');

// Create Slack client
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

app.command('/clockin', Responses.clock_in_response);

async function slack_start() {
    await app.start(process.env.PORT || 3500);

    console.log('Slack client connected');
}

slack_start();
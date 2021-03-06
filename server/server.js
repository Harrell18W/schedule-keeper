//TODO redo styling across project
const { App } = require('@slack/bolt');

const actions = require('./actions');
const commands = require('./commands');

// Create Slack client
const app = new App({
    token: process.env.SK_SLACK_BOT_TOKEN,
    signingSecret: process.env.SK_SLACK_SIGNING_SECRET
});

app.command('/clockin', commands.clockinResponse);
app.command('/clockintt', commands.clockinTravelResponse);
app.command('/clockout', commands.clockoutResponse);
app.command('/nicknames', commands.nicknames);
app.command('/register', commands.register);

app.action(/^customer_select_[0-9a-z]{32}$/, actions.clockinRequestResponse);
app.action(/^clockin_request_cancel_[0-9a-z]{32}$/, actions.clockinRequestCancel);
app.action(/^clockout_select_[0-9a-z]{32}$/, actions.clockoutRequestResponse);
app.action(/^clockout_request_cancel_[0-9a-z]{32}$/, actions.clockoutRequestCancel);
app.action(/^clockout_button_[0-9a-z]{32}$/, actions.clockoutButton);
app.action(/^clockin_cancel_[0-9a-z]{32}$/, actions.clockoutCancel);
app.action(/^session_cancel_[0-9a-z]{32}$/, actions.sessionCancel);
app.action('nickname', actions.listNicknames);

async function slack_start() {
    await app.start(process.env.SK_PORT || 57678);

    console.log('Slack client started');
}

slack_start();

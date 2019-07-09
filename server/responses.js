const blocks = require('./blocks');

module.exports.clockinResponse = async function ({ command, ack, say }) {
    ack();

    say(`<@${command.user_id}>`);
}
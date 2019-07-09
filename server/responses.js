const blocks = require('./blocks');

module.exports.clock_in_response = async function ({ command, ack, say }) {
    ack();

    say(`<@${command.user_id}>`);
}
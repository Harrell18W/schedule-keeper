//TOOD add parsed timestamp
module.exports.clockinBlocks = function(slackUserId, requestId, customers) {

    // Construct options for list of customers
    var customers_items = [];
    var i = 0;
    for (const customer of customers) {
        customers_items.push(
            {
                "text": {
                    "type": "plain_text",
                    "text": customer.name
                },
                "value": `value-${i++}`
            }
        )
    }

    return [
        {
            "type": "section",
            "block_id": "clock_in_mainresponse",
            "text": {
                "type": "mrkdwn",
                "text": `<@${slackUserId}> Please choose a customer from the list:`
            },
            "accessory": {
                "action_id": requestId,
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select a customer"
                },
                "options": customers_items
            }
        }
    ]

}

module.exports.clockinReponseBlocks = function(customer, time) {
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Clocked in\n\n*Customer:* ${customer}\n*Time:* ${time}`
            }
        }
    ]
}

//TOOD add time in and time out
module.exports.clockoutBlocks = function(customer, time) {
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Clocked out\n\n*Customer:* ${customer}\n*Time:* ${time}`
            }
        }
    ]
}
//TOOD add parsed timestamp
module.exports.clockinBlocks = function(slackUserId, id, customers) {

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
            }
        },
        {
            "type": "actions",
            "block_id": "clockin_elements",
            "elements": [
                {
                    "action_id": `customer_select_${id}`,
                    "type": "static_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": `Choose a customer`
                    },
                    "options": customers_items
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": ":x: Cancel"
                    },
                    "style": "danger",
                    "value": "cancel",
                    "action_id": `clockin_request_cancel_${id}`
                }
            ]
        }
    ]

}

module.exports.clockinReponseBlocks = function(customer, time, id) {
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `:clock4: Clocked in\n\n*Customer:* ${customer}\n*Time:* ${time}`
            }
        },
        {
            "type": "actions",
            "block_id": "clockedin_elements",
            "elements": [
                {
                    "action_id": `clockout_button_${id}`,
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": ":heavy_check_mark: Clock Out"
                    },
                    "value": "clockout"
                },
                {
                    "action_id": `clockout_cancel_${id}`,
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": ":x: Cancel"
                    },
                    "style": "danger",
                    "value": "cancel_clockout"
                }
            ]
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
                "text": `:heavy_check_mark: Clocked out\n\n*Customer:* ${customer}\n*Time:* ${time}`
            }
        }
    ]
}
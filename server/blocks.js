//var clock_in_block = function(user_id, request_id, customers) {
module.exports.clock_in_blocks = function(user_id, request_id, customers) {

    // Construct options for list of customers
    var customers_items = []
    var i = 0
    for (const customer of customers) {
        customers_items.push(
            {
                "text": {
                    "type": "plain_text",
                    "text": customer
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
                "text": `<@${user_id}> Please choose a customer from the list:`
            },
            "accessory": {
                "action_id": request_id,
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
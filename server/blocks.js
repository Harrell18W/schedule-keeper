module.exports.clockinBlocks = function(slackUserId, id, customers) {
    // Construct options for list of customers
    var customers_items = [];
    var i = 0;
    for (const customer of customers) {
        customers_items.push(
            {
                'text': {
                    'type': 'plain_text',
                    'text': customer.name
                },
                'value': `value-${i++}`
            }
        );
    }

    return [
        {
            'type': 'section',
            'block_id': 'clock_in_mainresponse',
            'text': {
                'type': 'mrkdwn',
                'text': `<@${slackUserId}> Please choose a customer from the list:`
            }
        },
        {
            'type': 'actions',
            'block_id': 'clockin_elements',
            'elements': [
                {
                    'action_id': `customer_select_${id}`,
                    'type': 'static_select',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Choose a customer'
                    },
                    'options': customers_items
                },
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': ':x: Cancel'
                    },
                    'style': 'danger',
                    'value': 'cancel',
                    'action_id': `clockin_request_cancel_${id}`
                }
            ]
        }
    ];
};

module.exports.clockinReponseBlocks = function(customer, time, id) {
    return [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': `:clock4: Clocked in\n\n*Customer:* ${customer}\n*Time:* ${time}`
            }
        },
        {
            'type': 'actions',
            'block_id': 'clockedin_elements',
            'elements': [
                {
                    'action_id': `clockout_button_${id}`,
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': ':heavy_check_mark: Clock Out'
                    },
                    'value': id
                },
                {
                    'action_id': `clockin_cancel_${id}`,
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': ':x: Cancel'
                    },
                    'style': 'danger',
                    'value': id
                }
            ]
        }
    ];
};

module.exports.clockoutBlocks = function(slackUserId, id, customers) {
    var customers_items = [];
    for (const customer of customers) {
        customers_items.push(
            {
                'text': {
                    'type': 'plain_text',
                    'text': customer.text
                },
                'value': customer.id
            }
        );
    }

    return [
        {
            'type': 'section',
            'block_id': 'clock_out_mainresponse',
            'text': {
                'type': 'mrkdwn',
                'text': `<@${slackUserId}> Please choose a customer from the list:`
            }
        },
        {
            'type': 'actions',
            'block_id': 'clockout_elements',
            'elements': [
                {
                    'action_id': `clockout_select_${id}`,
                    'type': 'static_select',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Choose a customer'
                    },
                    'options': customers_items
                },
                {
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': ':x: Cancel'
                    },
                    'style': 'danger',
                    'value': 'cancel',
                    'action_id': `clockout_request_cancel_${id}`
                }
            ]
        }
    ];
};

module.exports.clockoutResponseBlocks = function(customer, start, end, time, id) {
    return [
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': ':heavy_check_mark: Clocked out\n\n' +
                        `*Customer:* ${customer}\n` +
                        `*Start:* ${start}\n` +
                        `*End:* ${end}\n` +
                        `*Time:* ${time}`
            }
        },
        {
            'type': 'actions',
            'block_id': 'clockedout_elements',
            'elements': [
                {
                    'action_id': `session_cancel_${id}`,
                    'type': 'button',
                    'text': {
                        'type': 'plain_text',
                        'text': ':x: Cancel'
                    },
                    'style': 'danger',
                    'value': 'session_clockout'
                }
            ]
        }
    ];
};

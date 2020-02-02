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
            'type': 'divider'
        },
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
                        'text': ':x: Cancel Clockin Request'
                    },
                    'style': 'danger',
                    'value': 'cancel',
                    'action_id': `clockin_request_cancel_${id}`
                }
            ]
        },
        {
            'type': 'divider'
        }
    ];
};

module.exports.clockinReponseBlocks = function(customer, time, travel, id) {
    var text = ':clock4: Clocked in\n\n';
    text += `*Customer:* ${customer}\n`;
    text += `*Time:* ${time}\n`;
    text += '*Travel:* ' + (travel ? 'Yes' : 'No');
    return [
        {
            'type': 'divider'
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': text
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
                        'text': ':x: Cancel Clockin'
                    },
                    'style': 'danger',
                    'value': id
                }
            ]
        },
        {
            'type': 'divider'
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
            'type': 'divider'
        },
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
                        'text': ':x: Cancel Clockout Request'
                    },
                    'style': 'danger',
                    'value': 'cancel',
                    'action_id': `clockout_request_cancel_${id}`
                }
            ]
        },
        {
            'type': 'divider'
        }
    ];
};

module.exports.clockoutResponseBlocks = function(customer, start, end, time, travel, id) {
    return [
        {
            'type': 'divider'
        },
        {
            'type': 'section',
            'text': {
                'type': 'mrkdwn',
                'text': ':heavy_check_mark: Clocked out\n\n' +
                        `*Customer:* ${customer}\n` +
                        `*Start:* ${start}\n` +
                        `*End:* ${end}\n` +
                        `*Travel:* ${travel ? 'Yes' : 'No'}\n` +
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
                        'text': ':x: Undo and Delete Hours'
                    },
                    'style': 'danger',
                    'value': 'session_clockout'
                }
            ]
        },
        {
            'type': 'divider'
        }
    ];
};

module.exports.nicknameSelectBlocks = function(slackUserId, customers) {
    var customers_items = [];
    for (const customer of customers) {
        customers_items.push(
            {
                'text': {
                    'type': 'plain_text',
                    'text': customer.name
                },
                'value': customer.id
            }
        );
    }

    return [
        {
            'type': 'divider'
        },
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
                    'action_id': 'nickname',
                    'type': 'static_select',
                    'placeholder': {
                        'type': 'plain_text',
                        'text': 'Choose a customer'
                    },
                    'options': customers_items
                }
            ]
        },
        {
            'type': 'divider'
        }
    ];
};

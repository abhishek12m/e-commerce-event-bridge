const AWS = require('aws-sdk');
const eventBridge = new AWS.EventBridge();

module.exports.notifyOrderStatusUpdated = async (event) => {
    const detail = event.detail;

    const params = {
        Entries: [
            {
                Source: 'deliveryapp.order',
                DetailType: 'Order Status Updated',
                Detail: JSON.stringify(detail),
                EventBusName: 'default',
            },
        ],
    };

    await eventBridge.putEvents(params).promise();
    console.log('Event sent to EventBridge:', params);

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Event sent to EventBridge' }),
    };
};

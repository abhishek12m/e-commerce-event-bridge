const AWS = require('aws-sdk');
const { deleteMessageFromSQS } = require('./sqsOperations');
const dynamo = new AWS.DynamoDB.DocumentClient();

const { ORDERS_TABLE, ORDERS_STATUS_TABLE, UPDATE_ORDER_QUEUE_URL } = process.env;

module.exports.updateOrderStatus = async (event, context, callback) => {
    try {
        for (const record of event.Records) {
            const { orderId, userId, expectedDeliveryTime } = JSON.parse(record.body);
            const receiptHandle = record.receiptHandle;
            const currentTime = new Date().toISOString();

            const order = await dynamo.get({
                TableName: ORDERS_TABLE,
                Key: { orderId }
            }).promise();

            if (order.Item && new Date(expectedDeliveryTime) < new Date(currentTime)) {
                const params = {
                    TableName: ORDERS_STATUS_TABLE,
                    Key: { orderId },
                    UpdateExpression: 'set orderStatus = :status, statusUpdateDate = :updateDate',
                    ExpressionAttributeValues: {
                        ':status': 'completed',
                        ':updateDate': currentTime
                    }
                };

                await dynamo.update(params).promise();
                console.log('Order status updated:', params);

                
                await deleteMessageFromSQS(UPDATE_ORDER_QUEUE_URL, receiptHandle);
            }
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order statuses checked and updated' })
        });
    } catch (error) {
        console.error('Error processing order status:', error);
        callback(new Error(`Error processing order status: ${error.message}`));
    }
};

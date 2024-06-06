const AWS = require('aws-sdk');
const { sendMessageToSQS } = require('./sqsOperations');
const dynamo = new AWS.DynamoDB.DocumentClient();

const { ORDERS_STATUS_TABLE, UPDATE_ORDER_QUEUE_URL } = process.env;

module.exports.updateOrderSQS = async (event) => {
    try {
        const scanParams = {
            TableName: ORDERS_STATUS_TABLE,
            FilterExpression: 'orderStatus = :status',
            ExpressionAttributeValues: {
                ':status': 'order out for delivery'
            }
        };

        const orders = await dynamo.scan(scanParams).promise();

        for (const orderStatus of orders.Items) {
            const message = {
                orderId: orderStatus.orderId,
                userId: orderStatus.userId,
                expectedDeliveryTime: orderStatus.expectedDeliveryTime
            };

            await sendMessageToSQS(message, UPDATE_ORDER_QUEUE_URL);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Orders sent to SQS' })
        };
    } catch (error) {
        console.error('Error sending orders to SQS:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

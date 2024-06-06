const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const { ORDERS_STATUS_TABLE } = process.env;

module.exports.handleOrderStatusUpdated = async (event) => {
    try {
        const detail = event.detail;
        const { orderId, newStatus } = detail;

        const params = {
            TableName: ORDERS_STATUS_TABLE,
            Key: { orderId },
            UpdateExpression: 'set orderStatus = :status',
            ExpressionAttributeValues: {
                ':status': `${newStatus} by e-commerce`
            }
        };

        await dynamo.update(params).promise();
        console.log('Order status updated in e-commerce app:', params);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order status updated in e-commerce app' })
        };
    } catch (error) {
        console.error('Error updating order status in e-commerce app:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const ORDERS_TABLE = process.env.ORDERS_TABLE;
const ORDERS_STATUS_TABLE = process.env.ORDERS_STATUS_TABLE;

module.exports.orderProduct = async (event) => {
    try {
        const { productId, quantity } = JSON.parse(event.body);
        const userId = event.requestContext.authorizer.principalId;
        const orderId = uuidv4();
        const orderDate = new Date().toISOString();

        const orderParams = {
            TableName: ORDERS_TABLE,
            Item: {
                orderId,
                userId,
                productId,
                quantity,
                orderDate
            }
        };
        
        await dynamo.put(orderParams).promise();
        console.log('Order placed:', orderParams);

        const statusParams = {
            TableName: ORDERS_STATUS_TABLE,
            Item: {
                orderId,
                userId,
                orderStatus: "order out for delivery",
                createdAt: orderDate,
                statusUpdateDate: orderDate,
                expectedDeliveryTime: new Date(new Date().getTime() + 2 * 60 * 1000).toISOString()
            }
        };
        await dynamo.put(statusParams).promise();
        console.log('Order status:', statusParams);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Order placed successfully' })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};

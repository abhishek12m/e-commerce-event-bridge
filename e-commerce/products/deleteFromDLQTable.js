const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const DLQ_TABLE = process.env.DLQ_TABLE;

exports.deleteFromDLQTable = async (orderId) => {
  
    const params = {
      TableName: DLQ_TABLE,
      Key: { orderId }
    };
  
    const product = await dynamo.delete(params).promise();
  
    if (!product.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'not found' })
      };
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'deleted' })
    };
  };
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE = process.env.PRODUCTS_TABLE;

module.exports.getProduct = async (event) => {
    const productId = event.pathParameters.id;
  
    const params = {
      TableName: PRODUCTS_TABLE,
      Key: { productId }
    };
  
    const product = await dynamo.get(params).promise();
  
    if (!product.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Product not found' })
      };
    }
  
    return {
      statusCode: 200,
      body: JSON.stringify(product.Item)
    };
  };
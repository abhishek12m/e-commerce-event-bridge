const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const PRODUCTS_TABLE=process.env.PRODUCTS_TABLE;

module.exports.listProducts = async () => {
  const params = {
    TableName: PRODUCTS_TABLE
  };

  const products = await dynamo.scan(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(products.Items)
  };
};

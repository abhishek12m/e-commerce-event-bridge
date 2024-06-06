const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const { v4: uuidv4 } = require('uuid');

const { DLQ_TABLE } = process.env;
const saveErrorToDynamoDB = async (message) => {
    const timestamp = new Date().toISOString();
    const item = {
        id: uuidv4(),
        timestamp,
        ...message
    };

    const params = {
        TableName: DLQ_TABLE,
        Item: item
    };

    await dynamo.put(params).promise();
    // console.log('Error saved to DynamoDB:', item);
};

module.exports = {
    saveErrorToDynamoDB
};
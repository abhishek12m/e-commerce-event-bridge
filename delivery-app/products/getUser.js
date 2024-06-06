const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = 'users-table-dev';

exports.getUser = async (userId) => {
    const params = {
        TableName: USERS_TABLE
    };

    const result = await dynamo.scan(params).promise();
    
    if (!result.Items || result.Items.length === 0) {
        throw new Error('User not found');
    }
    const user=result.Items.find(user=>user.userId===userId);

    return user;
}
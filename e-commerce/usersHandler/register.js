const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const dynamo = new AWS.DynamoDB.DocumentClient();
const {v4: uuidv4} =require("uuid");
const USERS_TABLE = process.env.USERS_TABLE;

module.exports.register = async (event) => {
    const { username, email, password } = JSON.parse(event.body);
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const params = {
      TableName: USERS_TABLE,
      Item: {
        userId: uuidv4(),
        username,
        email,
        passwordHash: hashedPassword
      }
    };
  
    await dynamo.put(params).promise();
  
    return {
      statusCode: 200,
      body: JSON.stringify({ message:"user registered..." })
    };
  };
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

const sendMessageToSQS = async (message, queueUrl) => {
    const params = {
        MessageBody: JSON.stringify(message),
        QueueUrl: queueUrl
    };

    await sqs.sendMessage(params).promise();
    console.log('Message sent to SQS queue:', message);
};

const deleteMessageFromSQS = async (receiptHandle, queueUrl) => {
    const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle
    };

    await sqs.deleteMessage(deleteParams).promise();
    console.log('Message deleted from SQS queue:', receiptHandle);
};

module.exports = {
    sendMessageToSQS,
    deleteMessageFromSQS
};

const AWS = require('aws-sdk');
const { getUser } = require('./getUser');
const s3 = new AWS.S3();

const logErrorToS3 = async (orderId, userId, errorMessage, sqsMessageId, bucketName) => {
    let user = null;
    try {
        user = await getUser(userId);
        console.log("User details retrieved: ", user);
    } catch (error) {
        console.error("Error retrieving user details: ", error);
        user = { error: 'Failed to retrieve user details', details: error.message };
    }

    const errorDetails = {
        orderId,
        userId,
        errorMessage,
        timestamp: new Date().toISOString(),
        sqsMessageId,
        username:user.username,
        email:user.email
    };

    const s3Params = {
        Bucket: bucketName,
        Key: `${Date.now()}-${orderId}.json`,
        Body: JSON.stringify(errorDetails),
        ContentType: 'application/json'
    };

    await s3.putObject(s3Params).promise();
    console.log('Error logged to S3:', s3Params);
};

module.exports = {
    logErrorToS3
};

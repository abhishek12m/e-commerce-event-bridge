const { sendMessageToSQS, deleteMessageFromSQS } = require('./sqsOperations');
// const { logErrorToS3 } = require('./s3Logging');
const { saveErrorToDynamoDB } = require('./saveErrorToDynamoDB');

const { UPDATE_ORDER_QUEUE_URL, UPDATE_ORDER_DLQ_URL, S3_BUCKET_NAME } = process.env;
const MAX_RETRIES = 3;

module.exports.processDLQ = async (event, context, callback) => {
    try {
        for (const record of event.Records) {
            const message = JSON.parse(record.body);
            const { orderId, userId, expectedDeliveryTime, attempts = 0 } = message;
            const receiptHandle = record.receiptHandle;
            const messageId = record.messageId;
            const s3Message = { ...message, messageId };

            message.attempts = attempts + 1;

            if (message.attempts > MAX_RETRIES) {

                //save error to dynamodb becoz s3 is not working
                await saveErrorToDynamoDB(s3Message);

                // await logErrorToS3(orderId, userId, `Max retries (${MAX_RETRIES}) exceeded`, record.messageId, S3_BUCKET_NAME);
                console.error(`Max retries exceeded for orderId ${orderId}`);


                await deleteMessageFromSQS(receiptHandle, UPDATE_ORDER_DLQ_URL);
                console.log('Message deleted from DLQ:', receiptHandle);
            } else {
                try {

                    await sendMessageToSQS(message, UPDATE_ORDER_QUEUE_URL);


                    await deleteMessageFromSQS(receiptHandle, UPDATE_ORDER_DLQ_URL);
                } catch (error) {
                    console.error('Error re-sending message to main queue:', error);

                    //save error to dynamodb becoz s3 is not working
                    await saveErrorToDynamoDB(s3Message);

                    // await logErrorToS3(orderId, userId, error.message, record.messageId, S3_BUCKET_NAME);


                    await deleteMessageFromSQS(receiptHandle, UPDATE_ORDER_DLQ_URL);

                    callback(new Error(`Error processing DLQ message: ${error.message}`));
                    return;
                }
            }
        }

        callback(null, {
            statusCode: 200,
            body: JSON.stringify({ message: 'DLQ items processed and retried' })
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        callback(new Error(`Unexpected error: ${error.message}`));
    }
};

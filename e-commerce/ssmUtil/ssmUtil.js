const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

async function getSSMParameter(parameterName) {
    const params = {
        Name: parameterName,
        WithDecryption: true
    };

    try {
        const data = await ssm.getParameter(params).promise();
        return data.Parameter.Value;
    } catch (error) {
        console.error(`Error retrieving SSM parameter ${parameterName}:`, error);
        throw error;
    }
}
module.exports = { getSSMParameter };
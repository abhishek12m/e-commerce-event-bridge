const jwt = require('jsonwebtoken');
const { getSSMParameter } = require('../ssmUtil/ssmUtil');

module.exports.authorizeToken = async (event, context, callback) => {

    const token = event.headers.Authorization;
    // const secretKey = await getSSMParameter("SECRET_KEY") || "secret";
    const secretKey = "secret";
    if (!token) {
        console.log("Token not provided");
        return callback(null, generateErrorResponse(401, "Unauthorized: Token missing"));
    }

    const tokenValue = token.split(' ')[1];
    if (!tokenValue) {
        return callback(null, generateErrorResponse(401, "Unauthorized: Token value missing"));
    }

    try {
        const decoded = jwt.verify(tokenValue, secretKey);
        console.log("token: ", decoded)
        return callback(null, generatePolicy(decoded.userId, 'Allow', event.methodArn));
    } catch (error) {
        console.log("Error: ", error);
        if (error.name === 'TokenExpiredError') {
            console.log("Error name: ", error.name);
            return callback(null, generateErrorResponse(401, "Unauthorized: Token expired"));
        } else {
            return callback(null, generateErrorResponse(401, "Unauthorized: Invalid token"));
        }
    }
};

function generatePolicy(principalId, effect, resource) {
    const apiGatewayArnPartials = resource.split(':');
    const apiGatewayArnPrefix = apiGatewayArnPartials.slice(0, 5).join(':') + ':';
    const apiGatewayArnSuffix = apiGatewayArnPartials[5].split('/').slice(0, 2).join('/') + '/*';
    // console.log("1", apiGatewayArnPartials);
    // console.log("2", apiGatewayArnPrefix);
    // console.log("3", apiGatewayArnSuffix);
    return {
        principalId: principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: apiGatewayArnPrefix + apiGatewayArnSuffix
                }
            ]
        }
    };
}

function generateErrorResponse(statusCode, message) {
    return {
        statusCode: statusCode,
        body: JSON.stringify({ message: message })
    };
}

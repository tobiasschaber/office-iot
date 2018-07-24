/**
 * create a response message with a given status code and a body message
 * @param responseCode
 * @param message
 * @returns {{statusCode: *, headers: {}, body: *, isBase64Encoded: boolean}}
 */
exports.createResponse = (responseCode, message) => {

    return {
        "statusCode": responseCode,
        "headers": {
            "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Headers" : true

        },
        "body": message,
        "isBase64Encoded": false
    };
};
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
        },
        "body": message,
        "isBase64Encoded": false
    };
};
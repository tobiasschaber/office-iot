/**
 * create a response message with a given status code and a body message
 * @param errorCode
 * @param message
 * @returns {{statusCode: *, headers: {}, body: *, isBase64Encoded: boolean}}
 */
exports.createResponse = (responseCode, message) => {

    var response = {
        "statusCode": responseCode,
        "headers": {
        },
        "body": message,
        "isBase64Encoded": false
    };

    return response;
}
const AWS = require('aws-sdk');


/**
 * create a promise wrapper for the dynamoDB query, which uses a callback implementation
 * @param searchparams the parameters for the search
 * @returns {Promise<any>}
 */
exports.getQueryPromise = async (searchParams) => {

    const docClient = new AWS.DynamoDB.DocumentClient();

    return new Promise((resolve, reject) => {
        docClient.scan(searchParams, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};
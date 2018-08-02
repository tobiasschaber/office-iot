const AWS = require('aws-sdk');


/**
 * create a promise  for the dynamoDB query
 * @param searchparams the parameters for the search
 * @returns {Promise<any>}
 */
exports.getQueryPromise = async (searchParams) => {

    let docClient = new AWS.DynamoDB.DocumentClient();

    return new Promise((resolve, reject) => {
        docClient.scan(searchParams, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data);
        });
    });
};


/**
 * create a promise for the dynamoDB put
 * @param inputParams the input parameters to insert
 * @return {Promise<any>}
 */
exports.getPutPromise = async (inputParams) => {
    let docClient = new AWS.DynamoDB.DocumentClient();

    return new Promise((resolve, reject) => {
        docClient.put(inputParams, (err, data) => {
            if (err) {
                console.log("error writing into dynamodb");
                reject(err);

            } else {
                resolve("success");
            }
        });
    });
};
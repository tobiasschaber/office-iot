
const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');
const roomsTableName = 'rooms';
const awsRegion = 'eu-central-1';


/**
 * call this method to set AWS credentials profile,
 * for example if you want to execute locally
 */
exports.setLocalTestMode = (awsCredentialsProfile) => {
    AWS.config.update({credentials: new AWS.SharedIniFileCredentials({profile: awsCredentialsProfile})});
}


/**
 * entry point for lambda execution
 * @param event
 * @param context
 * @param callback
 */
exports.listRooms = (event, context, callback) => {

    AWS.config.update({region: awsRegion});
    const docClient = new AWS.DynamoDB.DocumentClient();


    var rooms = listRooms();


    /**
     * get a list of all rooms
     * @returns {*}
     */
    function listRooms() {

        /* rooms database query parameters */
        var searchparams = {
            TableName: roomsTableName,
            ProjectionExpression: "roomId"
        };


        /**
         * promise wrapper for the dynamoDB query, which uses a callback implementation
         * @param searchparams the parameters for the search
         * @returns {Promise<any>}
         */
        var scanRoomsPromiseWrapper = function (searchParams) {
            return new Promise((resolve, reject) => {
                docClient.scan(searchParams, (err, data) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(data);
                });
            });
        };


        //
        //
        //
        //
        // AKTUELLES PROBLEM: ich weiß nicht wie das Ergebnis dass wir unten haben, zurückgegeben werden kann an den aufrufenden.
        // VIELLEICHT KOMME ICH HIER WEITER?
        //     https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/nodejs-write-lambda-function-example.html

        /* create a promise via the wrapper */
        var roomsPromise = scanRoomsPromiseWrapper(searchparams);

        /**
         * Wait for all Promises to be finished.
         */
        Promise.all([roomsPromise])
            .then(resp => {
                console.log(resp[0]);

            }).catch(err => {
            console.log(err.message);
        });
    }

}
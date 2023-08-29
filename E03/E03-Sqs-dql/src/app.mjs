/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */


async function validityCheck( record ){
    let s = record.body;
    const body = JSON.parse(s);
    const word1 = body.word1;
    const word2 = body.word2;
    try
    {
        const combined = word1 + word2;
        if(combined.length > 10)
        {
            throw Error;
        }
        return combined;
    }
    catch (err)
    {
        throw record.MessageId;
    }
}

export const lambdaHandler = async (event, context) => {
    try {
        const records = event.Records;
        const promises = records.map( record => validityCheck(record));
        
        const executedPromises = await Promise.allSettled(promises);
        console.log(executedPromises);
        const batchItemFailures = executedPromises
            .filter(promise => promise.status == "rejected")
            .map(promise => ({itemIdentifier: promise.reason}));
        return {batchItemFailures};
    } catch (err) {
        console.log(err);
        return err;
    }
};

import { Logger } from '@aws-lambda-powertools/logger'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'

const logger = new Logger({ serviceName: 'serverlessDynamoDB', logLevel: 'DEBUG' })

const ddbClient = new DynamoDBClient({})
// eslint-disable-next-line new-cap
const ddbDocumentClient = new DynamoDBDocumentClient(ddbClient)

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

export const lambdaHandler = async (event, context) => {
  logger.info(event)

  const body = JSON.parse(event.body)

  try {
    const response = await ddbDocumentClient.send(new UpdateCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        FilmId: body.filmId,
        Genere: body.genere
      },
      UpdateExpression: 'set Title = :title',
      ExpressionAttributeValues: {
        ':title': body.title
      },
      ReturnValues: 'ALL_NEW'
    }))
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    }
  } catch (err) {
    logger.error(err)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(err)
    }
  }
}

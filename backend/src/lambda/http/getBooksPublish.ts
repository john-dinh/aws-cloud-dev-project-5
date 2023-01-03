import 'source-map-support/register'

import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getBooksForPublish } from '../../businessLogic/books'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// export const getBooks: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
export const getBooks: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const publish = event.pathParameters.publish
  const createdAt = event.pathParameters.createdAt
  const result = await getBooksForPublish(publish, createdAt);
  const items = result.Items
  logger.info('Get Items:', items)

  const res = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      items
    })
  }
  return res
}


export const handler = middy(getBooks)

handler
    .use(httpErrorHandler())
    .use(
        cors({
          credentials: true
        })
    )

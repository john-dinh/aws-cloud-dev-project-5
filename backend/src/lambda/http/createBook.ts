import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import * as uuid from 'uuid'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateBookRequest } from '../../requests/CreateBookRequest'
import { getUserId } from '../utils';
import { createBook } from '../../businessLogic/books'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBook: CreateBookRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const bookId = uuid.v4()
    const bookItem = { ...newBook, userId, bookId, createdAt: new Date().toISOString() }

    await createBook(bookItem)

    logger.info('Created Book:', bookItem)
    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ item: bookItem })
    }
}

)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )

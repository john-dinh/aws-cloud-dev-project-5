import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl, updateAttachmentBook } from '../../businessLogic/books'
import { getUserId } from '../utils'

import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const bookId = event.pathParameters.bookId
        const userId = getUserId(event)
        const { read, write }  = await createAttachmentPresignedUrl(bookId)
        await updateAttachmentBook({bookId, userId, attachmentUrl: read})

        logger.info("Generated URL for BookId:", bookId)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                uploadUrl: write
            })
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

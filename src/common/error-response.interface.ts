/**
 * A general format for all API error responses.
 *
 * @see https://www.vinaysahni.com/best-practices-for-a-pragmatic-restful-api
 */
export interface ErrorResponse {
  /**
   * A code indicating the type of error. May differ from the HTTP status code.
   */
  code: number

  /**
   * A brief description about the error.
   */
  message: string

  /**
   * More detailed messages about the error.
   */
  errors?: any[]
}

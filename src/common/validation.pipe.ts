import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe as BasePipe
} from '@nestjs/common'
import { ErrorResponse } from './error-response.interface'

export class ValidationPipe extends BasePipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const response: ErrorResponse = {
        code: 422,
        message: 'Validation failed',
        errors: this.flattenValidationErrors(validationErrors)
      }
      return new UnprocessableEntityException(response)
    }
  }

  protected prependConstraintsWithParentProp(
    parentPath: string,
    error: ValidationError
  ): ValidationError {
    // Don't add prefix to props of nested object
    return error
  }
}

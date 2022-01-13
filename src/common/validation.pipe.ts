import {
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe as BasePipe
} from '@nestjs/common'

export class ValidationPipe extends BasePipe {
  createExceptionFactory() {
    return (validationErrors: ValidationError[] = []) => {
      const errors = this.flattenValidationErrors(validationErrors)
      return new UnprocessableEntityException({
        code: 422,
        message: 'Validation error',
        errors
      })
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

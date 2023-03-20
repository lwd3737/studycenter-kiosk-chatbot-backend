import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class IsStringOrNumberConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any): boolean {
    if (typeof value === 'string') return true;
    if (typeof value === 'number') return true;
    return false;
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `'${validationArguments.value}' is not string or number type`;
  }
}

export const IsStringOrNumber = (validationOptions?: ValidationOptions) => {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsStringOrNumberConstraint,
    });
  };
};

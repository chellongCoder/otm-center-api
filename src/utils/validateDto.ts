import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'IsArrayOfNumbers', async: false })
export class IsArrayOfNumbersConstraint implements ValidatorConstraintInterface {
  validate(array: any[]) {
    if (!Array.isArray(array)) {
      return false;
    }

    return array.every(item => typeof item === 'number');
  }
}

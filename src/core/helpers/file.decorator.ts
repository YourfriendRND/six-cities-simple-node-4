//import { File } from 'node:buffer';
import {ValidationOptions, ValidationArguments, registerDecorator} from 'class-validator';

interface IsFileOptions {
  mime: ('image/jpg' | 'image/png' | 'image/jpeg')[];
}

export function IsFile(options: IsFileOptions, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    return registerDecorator({
      name: 'isFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: object, args: ValidationArguments) {
          // if (value?.mimetype && (options?.mime ?? []).includes(value?.mimetype)) {
          //   return true;
          // }
          return false;
        },
      }
    });
  };
}

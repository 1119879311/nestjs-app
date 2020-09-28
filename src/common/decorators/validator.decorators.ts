// import { registerDecorator, ValidationOptions, ValidationArguments, Validator } from 'class-validator';
// import { get } from 'lodash';

// const validator = new Validator();

// export function IsEqualsThan(property: string[] | string, validationOptions?: ValidationOptions) {
//     return (object: object, propertyName: string) => {
//         registerDecorator({
//             name: 'IsEqualsThan',
//             target: object.constructor,
//             propertyName,
//             constraints: [property],
//             options: validationOptions,
//             validator: {
//                 validate(value: any, args: ValidationArguments): boolean {
//                     // 拿到要比较的属性名或者路径 参考`lodash#get`方法
//                     const [comparativePropertyName] = args.constraints;
//                     // 拿到要比较的属性值
//                     const comparativeValue = get(args.object, comparativePropertyName);
//                     // 返回false 验证失败
//                     // return validator.equals(value, comparativeValue);
//                 },
//             },
//         });
//     };
// }

import { registerDecorator, ValidationArguments, ValidationOptions, Validator } from "class-validator"
import {get} from "lodash"
// const validatorO = new Validator();
export function IsEqualsThan(property:string|string[],validationOptions?:ValidationOptions){
    return function (object: Object, propertyName: string) {
        registerDecorator({
          name: 'IsEqualsThan',
          target: object.constructor,
          propertyName: propertyName,
          constraints: [property],
          options: validationOptions,
          validator: {
            validate(value: any, args: ValidationArguments) {
               
              const [relatedPropertyName] = args.constraints;
            //   console.log('comparativePropertyName:',relatedPropertyName)
               // 拿到要比较的属性值
               const relatedValue = get(args.object, relatedPropertyName);
            //    const relatedValue = (args.object as any)[relatedPropertyName];
            //    console.log('comparativeValue:',relatedValue)
               // 返回false 验证失败
               return value===relatedValue
            },
          },
        });     
      };
}
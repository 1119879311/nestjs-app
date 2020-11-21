import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator"
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


export function  IsRegExp(regExpOptions:{pattern:RegExp|string,flags?:string},validationOptions?:ValidationOptions){
    return function (object: Object, propertyName: string) {
        registerDecorator({
          name: 'IsRegExp',
          target: object.constructor,
          propertyName: propertyName,
          constraints: [regExpOptions.pattern],
          options: validationOptions,
          validator: {
            validate(value: any, args: ValidationArguments) {
                let reg = new RegExp(regExpOptions.pattern,regExpOptions.flags)
                return reg.test(value);
            },
          },
        });     
      };
}
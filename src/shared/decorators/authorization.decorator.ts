import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


export const IS_AUTH_KEY = 'isAuth';

export const Auth = (name?:string) => SetMetadata(IS_AUTH_KEY, name || true );



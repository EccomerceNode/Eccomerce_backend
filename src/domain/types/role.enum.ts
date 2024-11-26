export enum RoleEnum{
    ADMIN="ADMIN",
    USER='USER'
}

export type Role=RoleEnum.ADMIN | RoleEnum.USER;
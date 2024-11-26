import { Role } from "@/domain/types";


export class UpdateAuthDto{

    private constructor(
        public readonly user_id:string,
        public readonly full_name:string,
        public readonly phone:string,
        public readonly email:string,
        public readonly password:string,
        public readonly foto_url:string,
        public readonly rol:Role[],
        
        
    ){}
    get values(){
        const returnObj:{[key:string]:any}={};
        if (this.user_id) returnObj.user_id=this.user_id;
        if (this.full_name) returnObj.full_name=this.full_name;
        if (this.phone) returnObj.phone=this.phone;
        if (this.email) returnObj.email=this.email;
        if (this.password) returnObj.password=this.password;
        if (this.foto_url) returnObj.foto_url=this.foto_url;
        if (this.rol) returnObj.rol=this.rol;

        return returnObj;
    }

    static create(props:{[key:string]:any}):[string?, UpdateAuthDto?]{
        const {
            user_id,
            full_name,
            phone,
            email,
            password,
            foto_url,
            rol
            }=props;

            
        return [undefined,new UpdateAuthDto(
                user_id,
                full_name,
                phone,
                email,
                password,
                foto_url,
                rol
                )]
    }


}
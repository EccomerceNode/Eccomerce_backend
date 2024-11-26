
import { Role } from "@/domain/types";
import { regularExps } from "../../../config";


export class CreateAuthDto{

    private constructor(
        public readonly user_id:string,
        public readonly full_name:string,
        public readonly phone:string,
        public readonly email:string,
        public readonly password:string,
        public readonly foto_url:string,
        public readonly rol:Role[],
    
    ){}

    static create(props:{[key:string]:any}):[string?, CreateAuthDto?]{

        

        const {
            user_id,
            full_name,
            phone,
            email,
            password,
            foto_url,
            rol
            }=props;

            if (!full_name) return ['Tiene que escribir un nombre',undefined];
            if (!email) return ['Tiene que escribir un email ',undefined];
            if (!regularExps.email.test(email)) return ['el email no es valido',undefined];
            if (!password) return ['Tiene que colocar un password ',undefined];
            if (password.length<6) return ['el password debe tener mas de 6 letras ',undefined];




        return [undefined,new CreateAuthDto(
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
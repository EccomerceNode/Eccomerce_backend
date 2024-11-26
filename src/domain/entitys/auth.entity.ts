import { CustomError } from "../errors/custom.error";
import { Role } from "@/domain/types";


export class AuthEntity{

    public  user_id:string;
    public  full_name:string;
    public  phone:string;
    public  email:string;
    public  email_verified:boolean;
    public  status:boolean;
    public  password:string;
    public  foto_url:string;
    public  rol:Role[];
    

    constructor(
        user_id:string,
        password:string,
        foto_url:string,
        full_name:string,
        email:string,
        email_verified:boolean,
        status:boolean,
        phone:string,
        rol:Role[]
        

    ){
        this.user_id=user_id;
        this.password=password,
        this.foto_url=foto_url,
        this.full_name=full_name,
        this.email=email,
        this.status=status,
        this.email_verified=email_verified,
        this.phone=phone,
        this.rol=rol
    }

    public static fromObject(obj:{[key:string]:any}):AuthEntity{

        const {
            user_id,
            password,
            foto_url,
            full_name,
            email,
            email_verified,
            status,
            phone,
            rol
            }=obj;

        if(!user_id) throw CustomError.badRequest('no existe el id') ;
        if(!password) throw CustomError.badRequest('no existe el password') ;
        if(!full_name) throw CustomError.badRequest('no existe el full_name') ;
        if(!email) throw CustomError.badRequest('no existe el email') ;
        if(email_verified===undefined) throw CustomError.badRequest('no existe el email_verified') ;


        return new AuthEntity(user_id,
            password,
            foto_url,
            full_name,
            email,
            email_verified,
            status,
            phone,
            rol
        );

    }



}
import { regularExps } from "../../../config";



export class LoginAuthDto{

    private constructor(
        public readonly password:string,
        public readonly email:string,
    ){}

    static create(props:{[key:string]:any}):[string?, LoginAuthDto?]{

        

        const {
            password,
            email
            }=props;

            if (!email) return ['Tiene que escribir un email ',undefined];
            if (!regularExps.email.test(email)) return ['el email no es valido',undefined];
            if (!password) return ['Tiene que colocar un password ',undefined];
            if (password.legth<6) return ['el password debe tener mas de 6 letras ',undefined];




        return [undefined,new LoginAuthDto(
                password,
                email
                )]
    }


}
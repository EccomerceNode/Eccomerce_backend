
import { jwtAdapter, prisma } from "../config";
import { CustomError } from "../domain";

export const validateEmailData=async(token:string)=>{

        const emailVerified:any= await jwtAdapter.validateToken(token);
        if(!emailVerified) throw CustomError.badRequest('el email ingresado no es valido para la verificacion');
        const verifyData=await prisma.user.findFirst({
            where:{
                email:emailVerified.data
            }
        })
        if(!verifyData) throw CustomError.badRequest('no se encontro el usuario con el email ingresado');

        if (verifyData.email_verified===false) {
            const updateEmailVerify= await prisma.user.update({
                where:{
                    user_id:verifyData?.user_id
                },
                data:{
                    email_verified:true
                }
            })
            if(!updateEmailVerify) throw CustomError.internalServer('Ocurrio un problema al validar al usuario');
            return {
                email:updateEmailVerify.email
            }
            
        }else {
            throw CustomError.badRequest('el email ingresado ya esta validado')
        }

        

}
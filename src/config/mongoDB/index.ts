import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
    query:{
        user:{
            async create({args,query}){

                if(typeof args.data.rol==="string"){
                    
                    args.data.rol=[args.data.rol];
                }

                if(!args.data.rol){
                    args.data.rol=['USER'];
                }
                return query(args)
            },
            async update({args,query}){

                    const userId=args.where.user_id;
                    if(typeof args.data.rol==='string'){

                        const rolExist=await prisma.user.findUnique({
                            where:{user_id:userId},
                            select:{rol:true}
                        })
                        if(rolExist?.rol.includes(args.data.rol)) {
                            args.data.rol=rolExist.rol
                        }else {
                            args.data.rol=[...rolExist?.rol!,args.data.rol];
                        }
                    }
                    
                    return query(args);
            }
        }
    }
});
import { Request, Response } from "express";
import {UploadedFile} from 'express-fileupload';
import { CreateAuthDto, CustomError, LoginAuthDto, CreateAuth, LoginAuth, UpdateAuth, UpdateAuthDto } from "../../domain";
import { AuthRepository } from "../../domain/repository/user.repository";
import { jwtAdapter } from "../../config";
import { maxAgeHour, validateEmailData, validateUserForToken, validationsImg } from "../../helper";



export class AuthController {

    constructor(
        private readonly AuthRepository:AuthRepository,

    ){

        this.handleError=this.handleError.bind(this);

        this.loginAuth=this.loginAuth.bind(this);
        this.logoutAuth=this.logoutAuth.bind(this);
        this.registerAuth=this.registerAuth.bind(this);
        this.updateAuth=this.updateAuth.bind(this);
        this.tokenAuthEmail=this.tokenAuthEmail.bind(this);
        this.validateTokenAccessAuth=this.validateTokenAccessAuth.bind(this);
        
    }

    private handleError=(error:unknown, res:Response)=>{
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({error:error.message});
        }

        console.log(`${error}`);
        return res.status(500).json({error:'Internal server Error'});
        
    }

    public searchUser(req:Request,res:Response){
        
    }


    public loginAuth(req:Request, res:Response){

        const [error,loginAuthDto]= LoginAuthDto.create(req.body);
        if(error) res.status(400).json(error);


        new LoginAuth(this.AuthRepository)
        .execute(loginAuthDto!)
        .then(loginAuth=>{
            jwtAdapter.generateToken(loginAuth.user_id).then((token)=>{
                console.log(token);
                
                res.cookie('token',token,{httpOnly:true,secure:true,sameSite:'none',maxAge:maxAgeHour(2)});
                const {password,...rest}=loginAuth;
                return res.status(200).json({
                    Auth:rest
                })
            });
        })
        .catch(error=> this.handleError(error,res));

    }

    public logoutAuth(req:Request, res:Response){

        try {
            const token=req.cookies['token'];
            if(!token) return res.status(400).json({err:'no existe un usuario activo'})
            
            res.clearCookie('token');
            return res.status(200).json({
                logout:'cerraste sesion correctamente'
            });
        } catch (error) {
            return res.status(500).json({err:'Error al cerrar Sesion'});
            
        }
    }


    public registerAuth(req:Request, res:Response){

        const foto = req.files?.foto_url as UploadedFile;
        
        validationsImg.validationImg(foto).then((secureUrl)=>{
            
            const [error,createAuthDto]= CreateAuthDto.create({
                ...req.body,
                foto_url:secureUrl
                
            });
            if(error) res.status(400).json(error);
            console.log({datanew:createAuthDto});
            

            new CreateAuth(this.AuthRepository)
            .execute(createAuthDto!)
            .then(createAuth=>{
                jwtAdapter.generateToken(createAuth.user_id).then((token)=>{
                    const {password,...rest}=createAuth;
                    res.cookie('token',token,{httpOnly:true,secure:true,sameSite:'none',maxAge:maxAgeHour(2)});
                    return res.status(200).json({
                        Auth:{...rest}
                    })
                });
            })
            .catch(error=> this.handleError(error,res));

        }).catch(error=> this.handleError(error,res));;
        
    }

    public updateAuth(req:Request,res:Response){

        const foto = req.files?.foto_url as UploadedFile;
        const User_id=req.params.id;

        validationsImg.validationImg(foto).then((secureUrl)=>{

        const [error,updateAuthDto]= UpdateAuthDto.create({
            ...req.body,
            user_id:User_id,
            foto_url:secureUrl
        })
        new UpdateAuth(this.AuthRepository)
        .execute(updateAuthDto!)
        .then((updateData)=>{
            return res.status(200).json(updateData);
        })
        .catch((error)=>this.handleError(error,res));

        }).catch(error=> this.handleError(error,res));;

    }

    public async tokenAuthEmail(req:Request, res:Response){
        const {token} = req.params;
        if(token===null || token===undefined) return res.status(400).json({error:'No hay un email para validar'})
        validateEmailData(token).then(data=>{
            res.status(200).json({
                email:data.email,
                respuesta:'Se valido correctamente su email electronico'
            });
        }).catch(error => this.handleError(error,res));

    }

    public  validateTokenAccessAuth(req:Request, res:Response){
 
            const token=req.cookies['token'];
            
            if(token===null || token===undefined) return res.status(400).json({error:'No hay un usuario para validar'})
            
            validateUserForToken(token).then((data)=>{
            
                return res.status(200).json({
                    user_id:data?.user_id,
                    email:data?.email,
                    foto_url:data?.foto_url,
                    full_name:data?.full_name,
                    phone:data?.phone
                });

            }).catch(err => this.handleError(err,res))  
        
        }     
    
}
import { bcryptAdapter, envs, jwtAdapter, prisma } from "@/config";
import { AuthDatasource, AuthEntity, CreateAuthDto, CustomError, LoginAuthDto, UpdateAuthDto } from "@/domain";
import { EmailService } from "@/services/email.service";


export class AuthDatasourceImpl implements AuthDatasource{

     constructor(
         readonly emailService:EmailService
    ){}
    


    async postLoginAuth(loginAuthDto: LoginAuthDto): Promise<AuthEntity> {
        const auth= await prisma.user.findFirst({
            where:{
                email:loginAuthDto.email
            }
        })
        if(!auth) throw CustomError.badRequest('Email o Password incorrectos-email');
        const passwordUnhashed= bcryptAdapter.compare(loginAuthDto.password,auth.password);
        if(!passwordUnhashed) throw CustomError.badRequest('Email o Password incorrectos-password');
        
        return AuthEntity.fromObject(auth);
    }
    

    async postRegisterAuth(createAuthDto: CreateAuthDto): Promise<AuthEntity> {
        const existEmail= await prisma.user.findFirst({
            where:{
                email:createAuthDto.email
            }
        })   
        if(existEmail) throw CustomError.badRequest('el email ya existe');

        const hashedPasword=bcryptAdapter.hash(createAuthDto.password);

        await this.sendEmailValidationLink(createAuthDto.email);
        try {
            const auth=await prisma.user.create({
                data:{
                    ...createAuthDto,
                    password:hashedPasword
                }
            });
    
            return AuthEntity.fromObject(auth);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }


    async updateUser(updateAuthDto: UpdateAuthDto): Promise<AuthEntity> {
        const existId= await prisma.user.findFirst({
            where:{
                user_id:updateAuthDto.user_id
            }
        })
        if(!existId) throw CustomError.badRequest("User no exist");

        
        try {
            const {user_id,...updateDto}=updateAuthDto;

            const updateData=await prisma.user.update({
                where:{
                    user_id:updateAuthDto.user_id
                },
                data:updateDto
            })
            
            if(!updateData) throw CustomError.badRequest("Error Data-update");
            return AuthEntity.fromObject(updateData);
        } catch (error) {
            console.log(error);
            throw CustomError.internalServer("Error server");
            
        }
    }


    private async sendEmailValidationLink(email:string){

        const token=await jwtAdapter.generateToken(email);
        
        if(!token) throw CustomError.internalServer('Errror getting token');

        const link= `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html=`
            <h1>VALIDA TU EMAIL </h1>
            <p> click on the following link to validate your email</p>
            <a href="${link}">validate tour email:${email}</a>
        `;

        const options={
            to:email,
            subject:'Validate your email',
            htmlBody:html
        }

        const isSent=await this.emailService.sendEmail(options);
        if(!isSent) throw CustomError.internalServer('error sending email');

        return true;

    }


}
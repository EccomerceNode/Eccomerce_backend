import { Router } from "express";
import { AuthController } from "./AuthController";
import { EmailService } from "@/services/email.service";
import { AuthDatasourceImpl } from "@/infrastructure/datasource/auth.datasource.impl";
import { AuthRepositoryImpl } from "@/infrastructure/repository/auth.repository.impl";
import { envs } from "@/config";



export class AuthRoutes{

    constructor(){}

    static get routes():Router{

        const router= Router();

        const emailService= new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY
            )
        const authDatasource= new AuthDatasourceImpl(emailService);
        const authRepository= new AuthRepositoryImpl(authDatasource);
        const authController= new AuthController(authRepository);

        router.post('/login',authController.loginAuth);

        router.post('/logout',authController.logoutAuth);
        router.post('/register',authController.registerAuth);
        router.put('/:id',authController.updateAuth);

        router.get('/validate-email/:token',authController.tokenAuthEmail);
        router.get('/validate-token',authController.validateTokenAccessAuth);

        return router;
    }
}
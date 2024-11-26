import { CreateAuthDto, UpdateAuthDto } from "../../dtos";
import { AuthEntity } from "../../entitys";
import { AuthRepository } from "../../repository/user.repository";


export interface UpdateAuthUseCase{
    execute(dto:UpdateAuthDto):Promise<AuthEntity>
}

export class UpdateAuth implements UpdateAuthUseCase{

    constructor(
        private readonly repository:AuthRepository,
    ){}

    execute(dto: UpdateAuthDto): Promise<AuthEntity> {
        return this.repository.updateUser(dto);
    }

}
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UsersRepository } from './userRepositories';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dto/get-user.dto';
@Injectable()
export class UsersService {

    constructor(private readonly usersRepository: UsersRepository){}

    async createUser(createUserPayload: CreateUserDto) {
        const hashPassword = await bcrypt.hash(createUserPayload.password, 10);
        return this.usersRepository.create({
            ...createUserPayload,
            password: hashPassword
        });
    }

    async verifyUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({ email });
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
            throw new UnauthorizedException('invalid credentials')
        }

        return user
    }

    async getUser(getUserDto: GetUserDto) {
        
        return this.usersRepository.findOne(getUserDto);
    }
}

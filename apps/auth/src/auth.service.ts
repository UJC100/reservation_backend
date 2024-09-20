import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from './users/model/users.schema';
import { Response } from 'express'
import { TokenPayload } from './interfaces/token-payload-interface';




@Injectable()
export class AuthService {

  constructor(private readonly configService: ConfigService,
  private readonly jwtService: JwtService) { }

  async login(user: UserDocument, res: Response) {
    const jwtPayload: TokenPayload = {
      userId: user._id.toHexString()
    }
    console.log(jwtPayload)
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION')) 

    const token = this.jwtService.sign(jwtPayload)

    res.cookie('Authenticaton', token, {
      httpOnly: true,
      expires
    })

  }
  
}

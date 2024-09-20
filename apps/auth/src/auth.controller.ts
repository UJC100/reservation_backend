import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { CurrentUser } from './current-user-decorator';
import { UserDocument } from './users/model/users.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() user: UserDocument, @Res({passthrough: true}) res: Response ) {
    await this.authService.login(user, res)
    res.send(user)
    }
  
    
    
   
  
}

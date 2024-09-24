import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TokenPayload } from "../interfaces/token-payload-interface";
import { UsersService } from "../users/users.service";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService, private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: any) => req?.cookies?.Authenticaton || req?.Authentication
            ]),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }

    async validate({userId}: TokenPayload) {
        return this.userService.getUser({_id: userId})
    }
}
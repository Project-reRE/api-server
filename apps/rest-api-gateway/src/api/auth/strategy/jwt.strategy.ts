import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { jwtConstants } from "../constants/jwt";
import { JwtPayloadDto } from "../dto/jwt-payload.dto";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayloadDto) {
    return {
      id: payload.id,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      profileUrl: payload.profileUrl,
      description: payload.description,
      createdAt: payload.createdAt,
      updatedAt: payload.updatedAt,
    } as JwtPayloadDto;
  }
}

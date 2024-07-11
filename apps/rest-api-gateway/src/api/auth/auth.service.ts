import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from "@nestjs/jwt";
import { UserDto } from "../user/dto/user.dto";
import { AuthLoginRequestDto } from "./dto/auth-login-request.dto";
import { AuthLoginResponseDto } from "./dto/auth-login-response.dto";
import { JwtPayloadDto } from "./dto/jwt-payload.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(request: AuthLoginRequestDto): Promise<UserDto> {
    console.log(request);
    const existUser = await this.usersService.findOneUserByUsername({
      username: request.username,
    });

    return existUser;
  }

  async login(request: AuthLoginRequestDto): Promise<AuthLoginResponseDto> {
    const existUser = await this.validateUser({ username: request.username });
    if (!existUser) {
      throw new HttpException(
        {
          code: "NOT_YET_CHATTING_SERVER_USER",
          status: HttpStatus.UNAUTHORIZED,
          message: `가입 되지 않은 사용자`,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const payload = { ...existUser } as JwtPayloadDto;
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

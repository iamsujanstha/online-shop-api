import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { stringify } from 'qs';
import { plainToInstance } from 'class-transformer';
import { AxiosResponse } from 'axios';
import { firstValueFrom, map } from 'rxjs';
import { TokenService } from '@token/services/token.service';
import { UserService } from '@user/services/user.service';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { AuthResponseDto } from '@auth/dto/auth-response.dto';
import { CreateTokenDto } from '@token/dto/create-token.dto';
import { GoogleToken } from '@auth/interfaces/google-token.interface';
import { GoogleUser } from '@auth/interfaces/google-user.interface';
import { HashingService } from './hashing.service';

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  private readonly googleClientId: string;
  private readonly googleClientSecret: string;
  private readonly googleRedirectUri: string;
  private readonly googleTokenUrl: string;
  private readonly googleGrantType: string;
  private readonly googleApiUrl: string;

  public constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly hashingService: HashingService,
  ) {
    this.googleClientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    this.googleClientSecret = this.configService.get<string>(
      'GOOGLE_CLIENT_SECRET',
    )!;
    this.googleRedirectUri = this.configService.get<string>(
      'GOOGLE_REDIRECT_URI',
    );
    this.googleTokenUrl = this.configService.get<string>('GOOGLE_TOKEN_URL');
    this.googleGrantType = this.configService.get<string>('GOOGLE_GRANT_TYPE');
    this.googleApiUrl = this.configService.get<string>('GOOGLE_API_URL');
  }

  public async authenticateWithGoogle(
    code: string,
    state: string,
  ): Promise<AuthResponseDto> {
    this.logger.log(
      `Received OAuth callback with code: ${code} and state: ${state}`,
    );

    const oAuthTokens = await this.fetchGoogleOAuthTokens(code);
    const googleUser = await this.fetchGoogleUser(
      oAuthTokens.id_token,
      oAuthTokens.access_token,
    );

    return this.processGoogleUser(googleUser, state);
  }

  private async processGoogleUser(
    googleUser: GoogleUser,
    state: string,
  ): Promise<AuthResponseDto> {
    this.logger.log(`Processing Google user with email: ${googleUser.email}`);
    const userDto = await this.createUserDto(googleUser, state);
    const user = await this.userService.createUser(userDto);

    const userWithoutPassword = plainToInstance(CreateTokenDto, user, {
      excludeExtraneousValues: true,
    });
    const result = await this.authorizeWithGoogle(userWithoutPassword);

    if (!result.refreshToken) {
      this.logger.warn(
        `Failed to authorize Google user with email: ${googleUser.email}`,
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(
      `Successfully processed Google user with email: ${googleUser.email}`,
    );
    return result;
  }

  private async fetchGoogleOAuthTokens(code: string): Promise<GoogleToken> {
    this.logger.log(`Fetching Google OAuth Tokens with code: ${code}`);

    const response = await firstValueFrom(
      this.httpService
        .post<GoogleToken>(
          this.googleTokenUrl,
          stringify(this.getOAuthValues(code)),
        )
        .pipe(map((response: AxiosResponse<GoogleToken>) => response.data)),
    );

    if (!response) {
      this.logger.error(`Failed to fetch OAuth tokens with code: ${code}`);
      throw new BadRequestException('Failed to fetch OAuth tokens');
    }

    this.logger.log(`Received OAuth tokens successfully`);
    return response;
  }

  private async fetchGoogleUser(
    id_token: string,
    access_token: string,
  ): Promise<GoogleUser> {
    this.logger.log(`Fetching Google user info`);

    const response = await this.getGoogleUserResponse(id_token, access_token);

    if (!response) {
      this.logger.error(
        `Failed to fetch Google user with id_token: ${id_token}`,
      );
      throw new UnauthorizedException('Failed to fetch Google user');
    }

    this.logger.log(`Fetched Google user info successfully`);
    return response;
  }

  private async getGoogleUserResponse(
    id_token: string,
    access_token: string,
  ): Promise<GoogleUser> {
    return firstValueFrom(
      this.httpService
        .get<GoogleUser>(`${this.googleApiUrl}=${access_token}`, {
          headers: { Authorization: `Bearer ${id_token}` },
        })
        .pipe(map((response: AxiosResponse<GoogleUser>) => response.data)),
    );
  }

  private async authorizeWithGoogle(
    tokenPayload: CreateTokenDto,
  ): Promise<AuthResponseDto> {
    this.logger.log(
      `Authorizing Google user with email: ${tokenPayload.email}`,
    );
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.generateAccessToken(tokenPayload),
      this.tokenService.generateRefreshToken(tokenPayload),
    ]);

    this.logger.log(`Authorized Google user with email: ${tokenPayload.email}`);
    return {
      accessToken,
      refreshToken,
      user: tokenPayload,
    };
  }

  private getOAuthValues(code: string) {
    return {
      code,
      client_id: this.googleClientId,
      client_secret: this.googleClientSecret,
      redirect_uri: this.googleRedirectUri,
      grant_type: this.googleGrantType,
    };
  }

  private async createUserDto(
    googleUser: GoogleUser,
    role: string,
  ): Promise<CreateUserDto> {
    this.logger.log(
      `Creating user DTO for Google user with email: ${googleUser.email}`,
    );
    const password = await this.generateRandomPassword();

    const hashedPassword = await this.hashingService.hashPassword(password);

    return {
      role,
      name: googleUser.given_name,
      surname: googleUser.family_name,
      email: googleUser.email,
      profile_picture: googleUser.picture,
      password: hashedPassword,
    };
  }

  private async generateRandomPassword(): Promise<string> {
    return Math.random().toString(36).substring(2, 15);
  }
}

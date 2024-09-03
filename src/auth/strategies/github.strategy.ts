import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: 'Ov23li1u3qRUM4V111SU', // Replace with your GitHub client ID
      clientSecret: '18335c94af7521a5ea4361b8d00fb8b9d19523b4', // Replace with your GitHub client secret
      callbackURL: 'http://localhost:3000/auth/github/redirect',
      scope: ['email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function): Promise<any> {
    const { username, emails, photos } = profile;
    const user = {
      email: emails[0].value,
      username,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}

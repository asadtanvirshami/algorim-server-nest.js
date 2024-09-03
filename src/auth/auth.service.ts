import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return 'No user from Google';
    }

    return {
      message: 'User info from Google',
      user: req.user,
      token: this.jwtService.sign(req.user),
    };
  }

  githubLogin(req) {
    if (!req.user) {
      return 'No user from GitHub';
    }

    return {
      message: 'User info from GitHub',
      user: req.user,
      token: this.jwtService.sign(req.user),
    };
  }

  async signup(
    lname: string,
    fname: string,
    email: string,
    password: string,
    blocked: boolean,
  ): Promise<any> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      fname,
      lname,
      email,
      blocked,
      password: hashedPassword,
    });
    console.log(user);

    await user.save();

    return this.generateToken(user);
  }

  async signin(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    console.log(user);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user);
  }

  private generateToken(user: UserDocument) {
    const payload = { email: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

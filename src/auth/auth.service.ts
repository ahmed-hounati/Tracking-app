import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from './dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/user/schema/user.schema';
import { SignInDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignUpDto) {
    const { firstName, lastName, email, password, birthDate, role } = signupDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      birthDate,
      role: role,
    });

    await user.save();

    const id = user?.id;

    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { secret: process.env.JWT_SECRET },
    );
    return { id, token };
  }

  async signin(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({
      email,
    });

    const id = user?.id;

    if (!user) throw new UnauthorizedException('invalid email or password');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new UnauthorizedException('invalid email or password');
    const token = this.jwtService.sign(
      { id: user.id, email: user.email },
      { secret: process.env.JWT_SECRET },
    );
    return { id, token };
  }
}

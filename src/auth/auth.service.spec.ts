import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

const mockUserModel = {
  create: jest.fn().mockImplementation((dto) => ({
    ...dto,
    id: 'mockUserId',
    save: jest.fn(),
  })),
  findOne: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mocked_token'),
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken('User'), useValue: mockUserModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should sign up a user and return token', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('mocked_hashed_password');

    const result = await authService.signUp({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      password: 'password',
      birthDate: new Date(),
      role: 'user',
    });

    expect(result).toEqual({ id: 'mockUserId', token: 'mocked_token' });
    expect(mockUserModel.create).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
  });

  it('should sign in a user successfully', async () => {
    const mockUser = { id: 'mockUserId', password: 'hashedPassword' };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.signin({
      email: 'test@example.com',
      password: 'password',
    });

    expect(result).toEqual({ id: 'mockUserId', token: 'mocked_token' });
    expect(mockUserModel.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
  });

  it('should throw UnauthorizedException if password is incorrect', async () => {
    const mockUser = { id: 'mockUserId', password: 'hashedPassword' };
    mockUserModel.findOne.mockResolvedValue(mockUser);

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.signin({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);

    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrongpassword',
      'hashedPassword',
    );
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {
  MockJwtService,
  MockUserSchema,
  MockUsersService,
  accessToken,
  hashedPassword,
} from '../../testHelpers/tests.helper';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: MockUsersService,
        },
        {
          provide: JwtService,
          useValue: MockJwtService,
        },
      ],
    }).compile();
    authService = module.get<AuthService>(AuthService);
  });

  describe('ValidateUser Function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should successfully return user details', async () => {
      const validateUserSpy = jest.spyOn(authService, 'validateUser');
      const result = await authService.validateUser(
        MockUserSchema.username,
        MockUserSchema.password,
      );
      expect(validateUserSpy).toHaveBeenCalledWith(
        MockUserSchema.username,
        MockUserSchema.password,
      );
      expect(result).toEqual({ ...MockUserSchema, password: hashedPassword });
    });

    it('should throw not found exception when user not found', async () => {
      MockUsersService.findByUsername.mockRejectedValueOnce(
        new NotFoundException('User not found'),
      );
      await expect(
        authService.validateUser(
          MockUserSchema.username,
          MockUserSchema.password,
        ),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });

    it('should throw unauthorized exception when password is incorrect', async () => {
      MockUsersService.findByUsername.mockRejectedValueOnce(
        new UnauthorizedException('Incorrect details'),
      );
      await expect(
        authService.validateUser(
          MockUserSchema.username,
          MockUserSchema.password,
        ),
      ).rejects.toThrow(new UnauthorizedException('Incorrect details'));
    });
  });

  describe('Login Function', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      const loginSpy = jest.spyOn(authService, 'login');
      const result = await authService.login(MockUserSchema);
      expect(loginSpy).toHaveBeenCalledWith(MockUserSchema);
      expect(result).toEqual({
        accessToken,
        user: {
          username: MockUserSchema.username,
          id: MockUserSchema._id,
          name: MockUserSchema.name,
        },
      });
    });
  });
});

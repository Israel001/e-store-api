import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../modules/users/users.service';
import {
  MockUserSchema,
  MockUserSchemaWithHashedPassword,
  MockUsersModel,
  MockUsersModel2,
} from '../testHelpers/tests.helper';
import { CreateUserDto } from '../modules/users/users.dto';
import { User } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersService2: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUsersModel,
        },
      ],
    }).compile();
    const module2: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: MockUsersModel2,
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
    usersService2 = module2.get<UsersService>(UsersService);
  });

  describe('CreateUser Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      const createUserSpy = jest.spyOn(usersService, 'createUser');
      const user = new CreateUserDto();
      user.password = 'password';
      const result = await usersService.createUser(user);
      expect(createUserSpy).toHaveBeenCalledWith(user);
      expect(result).toEqual(MockUserSchemaWithHashedPassword);
    });

    it('should throw conflict exception when username is already taken', async () => {
      const user = new CreateUserDto();
      user.password = 'password';
      await expect(usersService2.createUser(user)).rejects.toThrow(
        new ConflictException(`Username: ${user.username} is already taken`),
      );
    });
  });

  describe('FindByUsername Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      const findByUsernameSpy = jest.spyOn(usersService2, 'findByUsername');
      const result = await usersService2.findByUsername(
        MockUserSchema.username,
      );
      expect(findByUsernameSpy).toHaveBeenCalledWith(MockUserSchema.username);
      expect(result).toEqual(MockUserSchemaWithHashedPassword);
    });
  });
});

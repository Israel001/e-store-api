import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../modules/users/users.service';
import {
  MockUserSchema,
  MockUserSchemaWithHashedPassword,
  MockUsersModel,
} from '../testHelpers/tests.helper';
import { CreateUserDto } from '../modules/users/users.dto';
import { User } from '../schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;

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
    usersService = module.get<UsersService>(UsersService);
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
      MockUsersModel.findOne.mockReturnValue(
        () => MockUserSchemaWithHashedPassword,
      );
      const user = new CreateUserDto();
      user.password = 'password';
      await expect(usersService.createUser(user)).rejects.toThrow(
        new ConflictException(`Username: ${user.username} is already taken`),
      );
    });
  });

  describe('FindByUsername Method', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response', async () => {
      MockUsersModel.findOne.mockResolvedValueOnce(
        () => MockUserSchemaWithHashedPassword,
      );
      const findByUsernameSpy = jest.spyOn(usersService, 'findByUsername');
      const result = await usersService.findByUsername(MockUserSchema.username);
      console.log(result);
      expect(findByUsernameSpy).toHaveBeenCalledWith(MockUserSchema.username);
      expect(result).toEqual(MockUserSchemaWithHashedPassword);
    });
  });
});

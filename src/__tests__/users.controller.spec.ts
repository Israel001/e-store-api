import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../modules/users/users.controller';
import { CreateUserDto } from '../modules/users/users.dto';
import { UsersService } from '../modules/users/users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersController,
        {
          provide: UsersService,
          useFactory: () => ({
            createUser: jest.fn(() => {}),
          }),
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should call create method', async () => {
    const request = new CreateUserDto();
    expect(usersController.create(request)).not.toEqual(null);
    expect(usersService.createUser).toHaveBeenCalledWith(request);
  });
});

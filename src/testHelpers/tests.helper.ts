import { ObjectId } from 'mongodb';

export const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
export const hashedPassword =
  '$2b$12$6O/o3sDvmMmOi0zTdhZfVeKR5w8ZuTK/9rMuCFeySFg8LqeQAWxUS';

export const MockUserSchema = {
  name: 'Israel',
  username: 'izzy',
  password: 'password',
  store: [],
  _id: new ObjectId('6548fd31bcab8291bf88fdcd'),
};

export const MockUserSchemaWithHashedPassword = {
  name: 'Israel',
  username: 'izzy',
  password: hashedPassword,
  store: [],
  _id: new ObjectId('6548fd31bcab8291bf88fdcd'),
};

export const MockUsersService = {
  createUser: jest.fn(() => MockUserSchema),
  findByUsername: jest.fn(() => {
    return Promise.resolve({
      ...MockUserSchema,
      password: hashedPassword,
    });
  }),
};

export const MockJwtService = {
  sign: jest.fn(() => accessToken),
};

export class MockUsersModel {
  static findOne = jest.fn(() => {
    return undefined;
  });

  save() {
    return MockUserSchemaWithHashedPassword;
  }
}

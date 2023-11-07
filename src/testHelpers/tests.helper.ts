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

export const MockStoreSchema = {
  name: 'Jumia Store',
  products: [],
  user: MockUserSchema,
  _id: new ObjectId('6548fd31bcab8291bf88fdcd'),
};

export const MockPagination = (data: any) => {
  return {
    data,
    pagination: { limit: 20, page: 1, total: 0, size: 0, pages: 0 },
  };
};

export const AuthContext = {
  userId: MockUserSchema._id.toString(),
  username: MockUserSchema.username,
  name: MockUserSchema.name,
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

export const DeleteResult = {
  acknowledged: true,
  deletedCount: 1,
};

export const MockJwtService = {
  sign: jest.fn(() => accessToken),
};

export class MockUsersModel {
  static findOne = jest.fn(() => {
    return undefined;
  });

  static findById = jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn(() => {
        return {
          ...MockUserSchema,
          save: jest.fn(),
        };
      }),
    };
  });

  save() {
    return MockUserSchemaWithHashedPassword;
  }
}

export class MockStoresModel {
  static find = jest.fn().mockImplementation(() => {
    return {
      populate: jest.fn(() => {
        return {
          sort: jest.fn(() => {
            return {
              exec: jest.fn(() => {
                return [];
              }),
            };
          }),
        };
      }),
    };
  });

  static findOne = jest.fn().mockImplementation(() => {
    return {
      populate: jest.fn(() => {
        return {
          exec: jest.fn(() => undefined),
        };
      }),
    };
  });

  static deleteMany = jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn(),
    };
  });

  static deleteOne = jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn(() => {
        return DeleteResult;
      }),
    };
  });

  save() {
    return {
      toObject: jest.fn(() => MockStoreSchema),
    };
  }
}

export class MockProductsModel {
  static deleteMany = jest.fn().mockImplementation(() => {
    return {
      exec: jest.fn(),
    };
  });
}

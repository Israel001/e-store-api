export interface IAuthContext {
  username: string;
  userId: string;
  name: string;
}

export enum OrderDir {
  ASC = 'asc',
  DESC = 'desc',
}

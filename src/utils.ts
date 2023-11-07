import { BasePaginatedResponseDto } from './base/dto';

export const buildResponseDataWithPagination = <T>(
  data: T[],
  total: number,
  pagination: { limit: number; page: number },
): BasePaginatedResponseDto<T> => {
  return {
    data: cleanupObjectProperties(data),
    pagination: {
      limit: Number(pagination.limit),
      page: Number(pagination.page),
      total,
      size: data.length,
      pages: Number((total / pagination.limit).toFixed()) || (total && 1) || 0,
    },
  };
};

export const cleanupObjectProperties = (
  data: any,
  shouldCheckNested = true,
) => {
  if (data && Array.isArray(data)) {
    return data.map((d) => cleanupObjectProperties(d));
  } else if (data && typeof data == 'object' && Object.keys(data).length) {
    if (shouldCheckNested) {
      // nested objects/array cleanup
      const dataValues = Object.values(data);
      for (let val of dataValues) {
        if (Array.isArray(val)) {
          val = val.map((d) => cleanupObjectProperties(d));
        } else if (typeof val == 'object') {
          // setting shouldCheckNested as false to avoid a deeper level of recursion,
          // which could lead to maximum call stack size being exceeded in js
          val = cleanupObjectProperties(val, false);

          // explicit cleanup for the `products` object whenever it is found,
          // some properties needs to be explicitly cleaned up,
          // because of the unstable structure returned from the response
          if ((val as any).products !== undefined) {
            (val as any).products = cleanupObjectProperties(
              (val as any).products,
            );
          }
        }
      }
    }

    if (data.__v !== undefined) {
      data.__v = undefined;
    }
    if (data._id !== undefined) {
      data.id = data._id;
      data._id = undefined;
    }
    return data;
  }
};

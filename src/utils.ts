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

export const cleanupObjectProperties = (data: any) => {
  if (data && Array.isArray(data)) {
    return data.map(cleanupObjectProperties);
  } else if (data && typeof data == 'object') {
    const dataValues = Object.values(data);
    for (let val of dataValues) {
      if (typeof val == 'object') {
        if ((val as any).__v !== undefined) {
          (val as any).__v = undefined;
        }
        if ((val as any)._id !== undefined) {
          (val as any).id = (val as any)._id;
          (val as any)._id = undefined;
        }
        if ((val as any).products !== undefined) {
          (val as any).products = cleanupObjectProperties(
            (val as any).products,
          );
        }
      } else if (Array.isArray(val)) {
        val = val.map(cleanupObjectProperties);
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

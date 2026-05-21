export const successResponse = (res, data = null, meta = {}) => {
  return res.status(200).json({
    success: true,
    data,
    meta,
  });
};

export const paginatedResponse = (res, data, pagination) => {
  return res.status(200).json({
    success: true,
    data,
    meta: { pagination },
  });
};

const successResponse = (res, data, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, message = "Error occurred", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
  });
};

const paginatedResponse = (res, data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return res.json({
    success: true,
    data,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
};

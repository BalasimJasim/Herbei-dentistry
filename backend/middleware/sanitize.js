export const sanitizeData = (req, res, next) => {
  // Skip for GET requests
  if (req.method === "GET") {
    return next();
  }

  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].replace(/<[^>]*>/g, "");
      }
    }
  }
  next();
};

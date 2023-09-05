module.exports = {
  formatDateMiddleware: (req, res, next) => {
    if (req.body && req.body.startDate && req.body.endDate) {
      req.body.startDate = new Date(req.body.startDate)
        .toISOString()
        .split("T")[0];
      req.body.endDate = new Date(req.body.endDate).toISOString().split("T")[0];
    }
    next();
  },
};

exports.isAdmin = (req, res, next) => {
  if (req.admin.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. Vous devez être administrateur.' });
  }
  next();
};
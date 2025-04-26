export const protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await getUserById(decoded.id); // You'll need to implement getUserById
        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
      }
    }
    if(!token) res.status(401).json({ message: 'Not authorized, no token' });
  };
  
  export const admin = (req, res, next) => {
    if(req.user && req.user.role === 1) {
      next();
    } else {
      res.status(401).json({ message: 'Not authorized as admin' });
    }
  };
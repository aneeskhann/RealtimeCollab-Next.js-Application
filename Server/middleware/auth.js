import authService from '../services/authService.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("🛡️ Auth Header:", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = authService.verifyToken(token); // returns payload (e.g., { userId })

    const user = await authService.getCurrentUser(decoded.userId); // should return user from DB

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Inject normalized user into req
    req.user = {
      ...user,
      id: user._id?.toString?.() || user._id
    };

    req.token = token;
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error);
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Optional auth middleware
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = authService.verifyToken(token);
      const user = await authService.getCurrentUser(decoded.userId);

      if (user) {
        req.user = {
          ...user,
          id: user._id?.toString?.() || user._id
        };
        req.token = token;
      }
    }

    next();
  } catch (error) {
    // Do not block request
    next();
  }
};

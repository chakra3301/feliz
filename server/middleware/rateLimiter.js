// Simple rate limiter middleware
// For production, consider using express-rate-limit package

const rateLimitStore = new Map();

export const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    if (rateLimitStore.size > 10000) {
      const cutoff = now - windowMs;
      for (const [key, value] of rateLimitStore.entries()) {
        if (value.resetTime < cutoff) {
          rateLimitStore.delete(key);
        }
      }
    }
    
    const key = `${ip}-${req.path}`;
    const record = rateLimitStore.get(key);
    
    if (!record || record.resetTime < now) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return next();
    }
    
    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Please try again in ${Math.ceil((record.resetTime - now) / 1000)} seconds.`
      });
    }
    
    record.count++;
    next();
  };
};


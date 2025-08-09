/**
 * Authentication middleware
 */

export const authMiddleware = (req: any, res: any, next: any) => {
  // Mock auth middleware
  req.user = { id: 'user_123', role: 'employer' };
  next();
};

export const validateRequest = (schema: any) => {
  return (req: any, res: any, next: any) => {
    // Mock validation middleware
    next();
  };
};

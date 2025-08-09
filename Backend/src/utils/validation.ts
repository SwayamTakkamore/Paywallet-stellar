/**
 * Request validation middleware
 */

export const validateRequest = (schema: any) => {
  return (req: any, res: any, next: any) => {
    // Mock validation - in real implementation would use Joi
    next();
  };
};

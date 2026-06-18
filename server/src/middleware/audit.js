import prisma from '../prismaClient.js';

export const auditLogger = async (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    res.send = originalSend;
    const response = res.send(body);

    // Log the action if it's a mutation or important action
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const action = `${req.method} ${req.originalUrl}`;
      const type = req.originalUrl.split('/')[2] || 'system';
      
      prisma.activityLog.create({
        data: {
          action,
          type,
        }
      }).catch(err => console.error('Audit log failed:', err));
    }

    return response;
  };

  next();
};

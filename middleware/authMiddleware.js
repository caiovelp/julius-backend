const authMiddleware = (req, res, next) => {
  // If AUTH_ENABLED is not set to 'true', skip authentication
  if (process.env.AUTH_ENABLED !== 'true') {
    return next();
  }

  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.slice(7); // Remove 'Bearer ' prefix

  // TODO: Validate Firebase ID token when using firebase-admin
  // For now, attach a dummy user object so controllers can check ownership
  // In production, verify token against Firebase:
  // admin.auth().verifyIdToken(token)
  //   .then(decodedToken => {
  //     req.user = { uid: decodedToken.uid };
  //     next();
  //   })
  //   .catch(err => res.status(401).json({ error: 'Invalid token' }));

  // Placeholder: decode token or mock user
  try {
    // For now, assume token contains JSON Web Token format (if needed)
    // In production: const decodedToken = admin.auth().verifyIdToken(token);
    req.user = { uid: 'mock-user-id' }; // TODO: Replace with real Firebase verification
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token validation failed', details: error.message });
  }
};

module.exports = authMiddleware;

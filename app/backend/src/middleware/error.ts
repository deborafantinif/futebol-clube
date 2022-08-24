import { ErrorRequestHandler } from 'express';

const error: ErrorRequestHandler = (err, _req, res, _next) => {
  const { message, name } = err;
  switch (name) {
    case 'Not Authorization':
      res.status(401).json({ message: 'Token must be a valid token' });
      break;
    default:
      res.status(500).json({ message });
      break;
  }
};

export default error;

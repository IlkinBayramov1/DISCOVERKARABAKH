import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy and running 🚀',
    timestamp: new Date(),
  });
});

export default router;

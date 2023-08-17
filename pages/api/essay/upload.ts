import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import express, { Request, Response } from 'express';
import { JWT_SECRET } from '@/components/hooks/envs';
import path from 'path';
import multer, { MulterError } from 'multer';

const prisma = new PrismaClient();
const router = express.Router();

interface JwtPayload {
  id: number;
  [key: string]: any;
}

const storage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req: Request, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage: storage }).single('avatar');

router.get('/', async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let userId: number;
  try {
    const payload = verify(token, JWT_SECRET!) as JwtPayload;
    userId = payload.id;
  } catch (error) {
    return res.status(401).send({ message: 'Invalid Token' });
  }

  const essay = await prisma.essay.findFirst({
    where: { userId: userId }
  });

  return res.json(essay);
});

router.post('/', (req: Request, res: Response) => {
  upload(req, res, async (err: any) => {
    if (err instanceof MulterError) {
      console.error("Multer error: ", err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error("Other error: ", err);
      return res.status(500).json({ error: err.message });
    }

    const file = req.file as Express.Multer.File;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    return res.json({
      avatar_path: `/uploads/${file.filename}`,
      avatar_name: file.originalname,
      avatar_type: file.mimetype
    });
  });
});

export default router;

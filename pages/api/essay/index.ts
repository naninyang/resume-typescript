import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT_SECRET } from '@/components/hooks/envs';
import multer from 'multer';
import express from 'express';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });

  const upload = multer({ storage: storage });

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let userId: number;
  try {
    const payload = verify(token, JWT_SECRET!) as JwtPayload;
    userId = payload.userId;
  } catch (error) {
    return res.status(401).send({ message: 'Invalid Token' });
  }

  if (req.method === 'GET') {
    const essay = await prisma.essay.findFirst({
      where: { userId: userId },
    });
    return res.json(essay);
  }

  if (req.method === 'POST') {
    const expressReq = req as unknown as express.Request;
    const expressRes = res as unknown as express.Response;

    upload.single('avatar')(expressReq, expressRes, async (err) => {
      console.log('req.body: ', req.body);
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { avatar_name, avatar_path, avatar_type, eng_name, eng_occupation, title, bio, show } = req.body;
      const newEssay = await prisma.essay.create({
        data: {
          avatar_name,
          avatar_path,
          avatar_type,
          eng_name,
          eng_occupation,
          title,
          bio,
          show,
          userId,
        },
      });
      return res.json(newEssay);
    });
  }
}

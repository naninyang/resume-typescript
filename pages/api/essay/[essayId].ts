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
  const { essayId } = req.query;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let userId;
  try {
    const payload = verify(token, JWT_SECRET!) as JwtPayload;
    userId = payload.id;
  } catch (error) {
    return res.status(401).send({ message: 'Invalid Token' });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage: storage });
  const expressReq = req as unknown as express.Request;
  const expressRes = res as unknown as express.Response;

  if (req.method === 'PUT') {
    upload.single('avatar')(expressReq, expressRes, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { avatar_name, avatar_path, avatar_type, eng_name, eng_occupation, title, bio, show } = req.body;

      const updatedEssay = await prisma.essay.update({
        where: { id: Number(essayId) },
        data: {
          avatar_name,
          avatar_path,
          avatar_type,
          eng_name,
          eng_occupation,
          title,
          bio,
          show
        }
      });

      return res.json(updatedEssay);
    });
  }
}

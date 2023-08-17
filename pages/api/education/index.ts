import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const payload = verify(token, JWT_SECRET!) as JwtPayload;
  const userId = payload.id;

  switch (req.method) {
    case 'GET':
      try {
        const educations = await prisma.education.findMany({
          where: {
            userId: userId,
          },
        });
        res.status(200).json(educations);
      } catch (error) {
        console.error('Failed to fetch educations:', error);
        res.status(500).json({ message: 'Failed to fetch educations' });
      }
      break;

    case 'POST':
      try {
        const createdEducation = await prisma.education.create({
          data: {
            ...req.body,
            userId: userId
          },
        });
        res.status(201).json(createdEducation);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the education.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Only GET and PUT methods are allowed' });
      break;
  }

}

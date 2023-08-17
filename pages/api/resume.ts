import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let userId: number;
  try {
    const payload = verify(token, JWT_SECRET!) as any;
    userId = Number(payload.id);
  } catch (e) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        educations: true,
        military_services: true,
        activities: true,
        languages: true,
        awards: true,
        certificates: true,
        skills: true,
        references: true,
        essays: true,
        careers: {
          include: {
            projects: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user) {
      delete (user as any).password;
      res.status(200).json(user);
    } else {
      res.status(404).send({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user resume:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

import { PrismaClient } from '@prisma/client';
import { verify, JsonWebTokenError } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  try {
    const payload = verify(token, JWT_SECRET!) as any;

    const userId: number = Number(payload.id);

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

    if (user) {
      delete (user as any).password;
      return res.status(200).json(user);
    } else {
      return res.status(404).send({ message: 'User not found' });
    }

  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return res.status(200).send({ message: 'Invalid token' });
    }

    console.error('Error fetching user resume:', error);
    return res.status(500).send({ message: 'Internal server error' });
  }
}

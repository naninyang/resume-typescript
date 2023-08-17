import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let payload;
  try {
    payload = verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(401).send({ message: 'Invalid token' });
  }

  const userId = payload.id;

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

    delete user.password;

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user resume:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
}

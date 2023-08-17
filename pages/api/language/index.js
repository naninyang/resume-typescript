import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const payload = verify(token, JWT_SECRET);
  const userId = payload.id;

  switch (req.method) {
    case 'GET':
      try {
        const languages = await prisma.language.findMany({
          where: {
            userId: userId,
          },
        });

        res.status(200).json(languages);
      } catch (error) {
        console.error('Failed to fetch languages:', error);
        res.status(500).json({ message: 'Failed to fetch languages' });
      }
      break;

    case 'POST':
      try {
        const createdLanguage = await prisma.language.create({
          data: {
            ...req.body,
            userId: userId
          },
        });
        res.status(201).json(createdLanguage);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the language.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Only GET and PUT methods are allowed' });
      break;
  }
}

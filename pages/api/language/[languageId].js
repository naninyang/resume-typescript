import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const languageId = req.query.languageId;

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const payload = verify(token, JWT_SECRET);
  const userId = payload.id;

  switch (req.method) {
    case 'PUT':
      try {
        const updatedLanguage = await prisma.language.update({
          where: { id: req.body.id },
          data: {
            lang_name: req.body.lang_name,
            exam_name: req.body.exam_name,
            point: req.body.point,
            userId: userId,
          },
        });
        res.status(200).json(updatedLanguage);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the language.' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.language.delete({
          where: { id: Number(languageId) },
        });
        res.status(200).json({ message: 'Deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the language.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Method not allowed' });
      break;
  }
}

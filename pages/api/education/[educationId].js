import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const educationId = req.query.educationId;

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
        const updatedEducation = await prisma.education.update({
          where: { id: req.body.id },
          data: {
            school: req.body.school,
            major: req.body.major,
            category: req.body.category,
            stats: req.body.stats,
            degree: req.body.degree,
            degree_num: req.body.degree_num,
            record: req.body.record,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            userId: userId,
          },
        });
        res.status(200).json(updatedEducation);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the education.' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.education.delete({
          where: { id: Number(educationId) },
        });
        res.status(200).json({ message: 'Deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the education.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Method not allowed' });
      break;
  }
}

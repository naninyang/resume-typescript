import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const activityId = req.query.activityId;

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
        const updatedSkill = await prisma.activity.update({
          where: { id: req.body.id },
          data: {
            organization: req.body.organization,
            position: req.body.position,
            description: req.body.description,
            classification: req.body.classification,
            start_date: req.body.start_date,
            start_time: req.body.start_time,
            end_date: req.body.end_date,
            end_time: req.body.end_time,
            userId: userId,
          },
        });
        res.status(200).json(updatedSkill);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the activity.' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.activity.delete({
          where: { id: Number(activityId) },
        });
        res.status(200).json({ message: 'Deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the activity.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Method not allowed' });
      break;
  }
}

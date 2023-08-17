import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const awardId = req.query.awardId;

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
        const updatedAward = await prisma.award.update({
          where: { id: req.body.id },
          data: {
            award_name: req.body.award_name,
            award_level: req.body.award_level,
            award_career: req.body.award_career,
            userId: userId,
          },
        });
        res.status(200).json(updatedAward);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the award.' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.award.delete({
          where: { id: Number(awardId) },
        });
        res.status(200).json({ message: 'Deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the award.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Method not allowed' });
      break;
  }
}

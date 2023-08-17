import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const awardId = req.query.awardId as string;

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const payload = verify(token, JWT_SECRET!) as JwtPayload;
  const userId = payload.id;

  switch (req.method) {
    case 'PUT':
      try {
        const updatedAward = await prisma.award.update({
          where: { id: Number(req.body.id) },
          data: {
            award_name: req.body.award_name,
            description: req.body.description,
            issue_date: req.body.issue_date,
            organization: req.body.organization,
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

import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const getUserId = (req) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;
    const payload = verify(token, JWT_SECRET);
    return payload.id;
  };

  const { careerId } = req.query;
  const userId = getUserId(req);

  if (!userId) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  switch (req.method) {
    case 'PUT':
      try {
        const updatedCareer = await prisma.career.update({
          where: { id: parseInt(careerId) },
          data: {
            org_name: req.body.org_name,
            team: req.body.team,
            role: req.body.role,
            occupation: req.body.occupation,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            description: req.body.description,
            userId,
          },
        });
        res.json(updatedCareer);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong' });
      }
      break;

    case 'DELETE':
      try {
        const projects = await prisma.project.findMany({
          where: {
            careerId: Number(careerId),
          },
        });

        for (let project of projects) {
          await prisma.project.delete({
            where: {
              id: project.id,
            },
          });
        }

        await prisma.career.delete({
          where: {
            id: Number(careerId),
          },
        });

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(405).end();
      break;
  }
};

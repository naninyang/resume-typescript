import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const careerId = req.query.careerId;

  if (typeof careerId !== 'string') {
    return res.status(400).send({ message: 'Invalid careerId' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const projects = await prisma.project.findMany({
          where: { careerId: parseInt(careerId) }
        });
        res.json(projects);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong' });
      }
      break;

    case 'POST':
      try {
        const newProject = await prisma.project.create({
          data: {
            ...req.body,
            careerId: parseInt(careerId)
          }
        });
        res.json(newProject);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong' });
      }
      break;

    default:
      res.status(405).end();
      break;
  }
}

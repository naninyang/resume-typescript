import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const projectId = req.query.projectId;

  if (typeof projectId !== 'string') {
    return res.status(400).send({ message: 'Invalid projectId' });
  }

  switch (req.method) {
    case 'PUT':
      try {
        const updatedProject = await prisma.project.update({
          where: { id: parseInt(projectId) },
          data: req.body
        });
        res.json(updatedProject);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Something went wrong' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.project.delete({
          where: { id: parseInt(projectId) }
        });
        res.status(204).end();
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { careerId } = req.query;

  switch (req.method) {
    case 'GET':
      const projects = await prisma.project.findMany({
        where: { careerId: parseInt(careerId) }
      });
      res.json(projects);
      break;

    case 'POST':
      const newProject = await prisma.project.create({
        data: {
          ...req.body,
          careerId: parseInt(careerId)
        }
      });
      res.json(newProject);
      break;

    default:
      res.status(405).end();
      break;
  }
}

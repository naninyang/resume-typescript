import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { projectId } = req.query;

  switch (req.method) {
    case 'PUT':
      const updatedProject = await prisma.project.update({
        where: { id: parseInt(projectId) },
        data: req.body
      });
      res.json(updatedProject);
      break;

    case 'DELETE':
      await prisma.project.delete({
        where: { id: parseInt(projectId) }
      });
      res.status(204).end();
      break;

    default:
      res.status(405).end();
      break;
  }
}

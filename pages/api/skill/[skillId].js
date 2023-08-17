import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const skillId = req.query.skillId;

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
        const updatedSkill = await prisma.skill.update({
          where: { id: req.body.id },
          data: {
            skill_name: req.body.skill_name,
            skill_level: parseInt(req.body.skill_level, 10),
            skill_career: req.body.skill_career,
            userId: userId,
          },
        });
        res.status(200).json(updatedSkill);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update the skill.' });
      }
      break;

    case 'POST':
      try {
        const createdSkill = await prisma.skill.create({
          data: {
            ...req.body,
            userId: userId
          },
        });
        res.status(201).json(createdSkill);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the skill.' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.skill.delete({
          where: { id: Number(skillId) },
        });
        res.status(200).json({ message: 'Deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the skill.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Method not allowed' });
      break;
  }
}

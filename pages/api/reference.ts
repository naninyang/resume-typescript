import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { verify, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const references = await prisma.reference.findMany();
      res.status(200).json(references);
    } catch (error) {
      console.error('Failed to fetch references:', error);
      res.status(500).json({ message: 'Failed to fetch references' });
    }
  } else if (req.method === 'POST') {
    try {
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        res.status(401).send({ message: 'Unauthorized' });
        return;
      }

      const payload = verify(token, JWT_SECRET!) as any;

      const {
        github, blog, velog, instagram, twitter, facebook, leadme, brunch,
        tistory, pinterest, linkedin, dribble, postype, homepage
      } = req.body;

      const reference = await prisma.reference.findUnique({
        where: { userId: Number(payload.id) },
      });

      if (!reference) {
        await prisma.reference.create({
          data: {
            github, blog, velog, instagram, twitter, facebook, leadme, brunch,
            tistory, pinterest, linkedin, dribble, postype, homepage,
            user: { connect: { id: Number(payload.id) } },
          },
        });
      } else {
        await prisma.reference.update({
          where: { userId: Number(payload.id) },
          data: {
            github, blog, velog, instagram, twitter, facebook, leadme, brunch,
            tistory, pinterest, linkedin, dribble, postype, homepage,
          },
        });
      }

      res.status(200).json({ message: 'Reference updated successfully', status: 'success' });
    } catch (error) {
      console.error('Failed to create reference:', error);
      res.status(500).json({ message: 'Failed to create reference' });
    }
  } else {
    res.status(405).send({ message: 'Only GET and POST methods are allowed' });
  }
}

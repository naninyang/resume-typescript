import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: number;
  [key: string]: any;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }

  const payload = verify(token, JWT_SECRET!) as JwtPayload;
  const userId = payload.id;

  switch (req.method) {
    case 'GET':
      try {
        const certificates = await prisma.certificate.findMany({
          where: {
            userId: userId,
          },
        });
        res.status(200).json(certificates);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
        res.status(500).json({ message: 'Failed to fetch certificates' });
      }

    case 'POST':
      try {
        const createdCertificate = await prisma.certificate.create({
          data: {
            ...req.body,
            userId: userId
          },
        });
        res.status(201).json(createdCertificate);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the certificate.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Only GET and PUT methods are allowed' });
  }
}

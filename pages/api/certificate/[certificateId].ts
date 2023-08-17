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
  const certificateId = req.query.certificateId;

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
        const updatedCertificate = await prisma.certificate.create({
          data: {
            ...req.body,
            userId: userId
          },
        });
        res.status(201).json(updatedCertificate);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create the education.' });
      }
      break;

    case 'DELETE':
      try {
        await prisma.certificate.delete({
          where: { id: Number(certificateId) },
        });
        res.status(200).json({ message: 'Deleted successfully.' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete the certificate.' });
      }
      break;

    default:
      res.status(405).send({ message: 'Method not allowed' });
      break;
  }
}

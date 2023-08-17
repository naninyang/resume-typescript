import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { verify, JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const militaryServices = await prisma.military_service.findMany();
      res.status(200).json(militaryServices);
    } catch (error) {
      console.error('Failed to fetch military services:', error);
      res.status(500).json({ message: 'Failed to fetch military services' });
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
        militaryStats,
        militaryShow,
        conscriptionExemption,
        militaryGroup,
        branch,
        rank,
        discharge,
        startDate,
        endDate,
      } = req.body;

      const militaryService = await prisma.military_service.findUnique({
        where: { userId: Number(payload.id) },
      });

      if (!militaryService) {
        await prisma.military_service.create({
          data: {
            military_stats: militaryStats,
            military_show: militaryShow,
            conscription_exemption: conscriptionExemption,
            military_group: militaryGroup,
            branch: branch,
            rank: rank,
            discharge: discharge,
            start_date: startDate,
            end_date: endDate,
            user: { connect: { id: Number(payload.id) } },
          },
        });
      } else {
        await prisma.military_service.update({
          where: { userId: Number(payload.id) },
          data: {
            military_stats: militaryStats,
            military_show: militaryShow,
            conscription_exemption: conscriptionExemption,
            military_group: militaryGroup,
            branch: branch,
            rank: rank,
            discharge: discharge,
            start_date: startDate,
            end_date: endDate,
          },
        });
      }

      res.status(200).json({ message: 'Military service updated successfully', status: 'success' });
    } catch (error) {
      console.error('Failed to create militaryService:', error);
      res.status(500).json({ message: 'Failed to create military service' });
    }
  } else {
    res.status(405).send({ message: 'Only GET and POST methods are allowed' });
  }
}

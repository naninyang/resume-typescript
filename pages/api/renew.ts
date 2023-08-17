import jwt, { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { JWT_SECRET } from '@/components/hooks/envs';

const prisma = new PrismaClient();

type ResponseData = {
  status?: string;
  message?: string;
  token?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Only POST method is allowed' });
    return;
  }

  const token = req.body.token as string;

  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload & { id?: string };

    const user = await prisma.user.findUnique({
      where: { userid: decoded.id },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newToken = jwt.sign({ id: user.userid }, JWT_SECRET!, { expiresIn: '14d' });
    res.status(200).json({ status: 'success', token: newToken });

  } catch (error) {
    res.status(401).json({ message: 'renew: Invalid token' });
  }
}

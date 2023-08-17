import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '@/components/utilities/envs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST method is allowed' });
    return;
  }

  const token = req.body.token;

  if (!token) {
    res.status(401).send({ message: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { userid: decoded.id },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const newToken = jwt.sign({ id: user.userid }, JWT_SECRET, { expiresIn: '14d' });
    res.status(200).json({ status: 'success', token: newToken });

  } catch (error) {
    res.status(401).send({ message: 'renew: Invalid token' });
  }
}

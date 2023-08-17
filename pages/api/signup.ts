import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type ResponseData = {
  status: string;
  data?: number;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  const { userid, username, email, password } = req.body as {
    userid: string;
    username: string;
    email: string;
    password: string;
  };

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        userid: userid,
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    console.log(`A row has been inserted with rowid ${newUser.id}`);
    res.status(200).json({ status: 'success', data: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
}

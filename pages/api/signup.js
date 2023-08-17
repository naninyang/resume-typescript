import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userid, username, email, password } = req.body;

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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

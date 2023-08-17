import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '@/components/hooks/envs';
import multer from 'multer';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })

  const upload = multer({ storage: storage });

  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'Unauthorized' });
  }

  let userId;
  try {
    const payload = verify(token, JWT_SECRET);
    userId = payload.id;
  } catch (error) {
    return res.status(401).send({ message: 'Invalid Token' });
  }

  if (req.method === 'GET') {
    const essay = await prisma.essay.findFirst({
      where: { userId: userId }
    });
    return res.json(essay);
  }

  if (req.method === 'POST') {
    upload.single('avatar')(req, res, async (err) => {
      console.log('req.body: ', req.body)
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { avatar_name, avatar_path, avatar_type, eng_name, eng_occupation, title, bio, show } = req.body;
      const newEssay = await prisma.essay.create({
        data: {
          avatar_name,
          avatar_path,
          avatar_type,
          eng_name,
          eng_occupation,
          title,
          bio,
          show,
          userId
        }
      });
      return res.json(newEssay);
    });
  }
}

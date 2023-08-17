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

  const { essayId } = req.query;
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

  if (req.method === 'PUT') {
    upload.single('avatar')(req, res, async (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      const { avatar_name, avatar_path, avatar_type, eng_name, eng_occupation, title, bio, show } = req.body;
      const updatedEssay = await prisma.essay.update({
        where: { id: Number(essayId) },
        data: {
          avatar_name,
          avatar_path,
          avatar_type,
          eng_name,
          eng_occupation,
          title,
          bio,
          show
        }
      });

      return res.json(updatedEssay);
    });
  }
}

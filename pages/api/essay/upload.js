import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JWT_SECRET } from '@/components/hooks/envs';
import path from 'path';
import multer from 'multer';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: storage }).single('avatar');

export default async function handler(req, res) {

  if (req.method === 'GET') {
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
    const essay = await prisma.essay.findFirst({
      where: { userId: userId }
    });
    return res.json(essay);
  }

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error: ", err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error("Other error: ", err);
      return res.status(500).json({ error: err.message });
    }

    const { file } = req;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    return res.json({
      avatar_path: `/uploads/${file.filename}`,
      avatar_name: file.originalname,
      avatar_type: file.mimetype
    });
  });
}

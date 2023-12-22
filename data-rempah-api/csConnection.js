import { Storage } from '@google-cloud/storage';
import multer from 'multer';

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: './keys.json',
});

const bucket = storage.bucket('gambar-rempah-spicefy');

// Konfigurasi Multer untuk menyimpan file
const multerStorage = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

const uploadToGCP = async (file) => {
  const gcpFileName = `${Date.now()}_${file.originalname}`;
  const gcpFile = bucket.file(gcpFileName);

  const stream = gcpFile.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
    resumable: false,
  });

  return new Promise((resolve, reject) => {
    stream.on('error', (err) => {
      reject(err);
    });

    stream.on('finish', () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${gcpFileName}`;
      resolve(publicUrl);
    });

    stream.end(file.buffer);
  });
};

export { upload, uploadToGCP };
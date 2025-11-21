const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');

const USE_S3 = process.env.USE_S3 === 'true'; // toggle in env vars
let storage;

if (USE_S3) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION
  });
  const s3 = new AWS.S3();

  storage = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET,
    acl: 'public-read',
    key: (req, file, cb) => {
      cb(null, `portfolio/${Date.now()}_${file.originalname}`);
    }
  });
} else {
  const UPLOAD_ROOT = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(UPLOAD_ROOT)) fs.mkdirSync(UPLOAD_ROOT, { recursive: true });
  const PORTFOLIO_PATH = path.join(UPLOAD_ROOT, 'portfolio');
  if (!fs.existsSync(PORTFOLIO_PATH)) fs.mkdirSync(PORTFOLIO_PATH, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, PORTFOLIO_PATH),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      cb(null, `refutalent_${uniqueSuffix}${ext}`);
    }
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});

module.exports = upload;

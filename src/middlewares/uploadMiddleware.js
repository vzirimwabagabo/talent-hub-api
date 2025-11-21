// const multer = require('multer');
// const multerS3 = require('multer-s3');
// const AWS = require('aws-sdk');
// const path = require('path');
// const fs = require('fs');

// const isProd = process.env.NODE_ENV === 'production';
// let storage;

// // -------------------------
// // 1. PRODUCTION (Vercel) – S3 ONLY
// // -------------------------
// if (isProd) {
//   AWS.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY,
//     secretAccessKey: process.env.AWS_SECRET_KEY,
//     region: process.env.AWS_REGION
//   });

//   const s3 = new AWS.S3();

//   storage = multerS3({
//     s3,
//     bucket: process.env.AWS_BUCKET,
//     acl: 'public-read',
//     key: (req, file, cb) => {
//       cb(null, `portfolio/${Date.now()}_${file.originalname}`);
//     }
//   });
// }

// // -------------------------
// // 2. DEVELOPMENT – LOCAL DISK
// // -------------------------
// else {
//   const UPLOAD_ROOT = path.join(__dirname, '../../uploads');
//   const PORTFOLIO_PATH = path.join(UPLOAD_ROOT, 'portfolio');

//   if (!fs.existsSync(PORTFOLIO_PATH)) {
//     fs.mkdirSync(PORTFOLIO_PATH, { recursive: true });
//   }

//   storage = multer.diskStorage({
//     destination: (req, file, cb) => cb(null, PORTFOLIO_PATH),
//     filename: (req, file, cb) => {
//       const ext = path.extname(file.originalname);
//       const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
//       cb(null, `refutalent_${uniqueSuffix}${ext}`);
//     }
//   });
// }

// const upload = multer({
//   storage,
//   limits: { fileSize: 50 * 1024 * 1024 }
// });

// module.exports = upload;

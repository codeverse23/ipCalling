const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region:process.env.region , // Verify this matches your S3 bucket's region
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});



const getMulterStorage = (storagePath) => {
    const s3Storage = multerS3({
        s3: s3,
        bucket: process.env.bucket,
        metadata: (req, file, cb) => {
            cb(null, { fieldname: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `${storagePath}/${file.fieldname}_${Date.now()}_${file.originalname}`;
            console.log("fileNamefileName::",fileName)
            cb(null, fileName);
        },
    });

    const multerInstanceForUpload = multer({
        storage: s3Storage,
    });

    return multerInstanceForUpload;
};

module.exports = getMulterStorage;

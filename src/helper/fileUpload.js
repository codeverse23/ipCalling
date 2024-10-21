const  multer= require('multer');
const multerS3 = require ('multer-s3');
const { S3Client } =require('@aws-sdk/client-s3');

const s3 = new S3Client({
    region: "eu-north-1",
    credentials: {
        accessKeyId: "AKIA4MTWIR3R3PZD2RMF",
        secretAccessKey:"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"
    }
});
const getMulterStorage = (storagePath) => {
    const s3Storage = multerS3({
        s3: s3,
        bucket: "cell121",
        metadata: (req, file, cb) => {
            cb(null, { fieldname: file.fieldname });
        },
        key: (req, file, cb) => {
            const fileName = `${storagePath}/${file.fieldname}_${Date.now()}_${file.originalname}`;
            cb(null, fileName);
        },
    });

    const multerInstanceForUpload = multer({
        storage: s3Storage,
    });

    return multerInstanceForUpload;
};

module.exports = getMulterStorage;
const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const crypto = require("crypto");

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3Client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const uploadFile = (fileBuffer, fileName, mimetype) => {
    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: mimetype,
    };

    return s3Client.send(new PutObjectCommand(uploadParams));
};

const deleteFile = (fileName) => {
    const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
    };

    return s3Client.send(new DeleteObjectCommand(deleteParams));
};

const getObjectSignedUrl = async (key) => {
    const params = {
        Bucket: bucketName,
        Key: key,
    };

    const url = await getSignedUrl(s3Client, new GetObjectCommand(params), {
        expiresIn: 60,
    });
    return url;
};

const generateFileName = (bytes = 32) => {
    return crypto.randomBytes(bytes).toString("hex");
};

module.exports = {
    uploadFile,
    deleteFile,
    getObjectSignedUrl,
    generateFileName,
};

const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();
const sharp = require("sharp");

const filterImages = async (req, res, next) => {
    if (!req.file) {
        next();
    } else {
        try {
            const { file } = req;
            const fileBuffer = await sharp(file.buffer)
                .resize({ height: 1920, width: 1080, fit: "cover" })
                .toBuffer();

            const baseEncoding = fileBuffer.toString("base64");

            const [result] = await client.safeSearchDetection({
                image: { content: baseEncoding },
            });
            const detections = result.safeSearchAnnotation;
            console.dir(detections, { depth: null });
            if (
                detections.adult === "VERY_LIKELY" ||
                detections.adult === "LIKELY" ||
                detections.violence === "VERY_LIKELY" ||
                detections.violence === "LIKELY" ||
                detections.racy === "VERY_LIKELY" ||
                detections.racy === "LIKELY"
            ) {
                console.log(
                    "Image filtered, adult, violence, or racy content detected."
                );
                return res.status(400).json({
                    message: "Image not allowed",
                });
            } else {
                console.log("Image passed filter.");
                next();
            }
        } catch (error) {
            return res.status(400).json({
                message: "Failed on filterImages, Internal Error.",
            });
        }
    }
};

module.exports = { filterImages };

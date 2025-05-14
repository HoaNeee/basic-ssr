const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// config cloud
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
//End config cloud

module.exports.upload = async (req, res, next) => {
  // Upload an image
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          {
            folder: "learn-node",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    //CHU Y DOAN NEXT
    async function upload(req) {
      let result = await streamUpload(req);
      req.body.thumbnail = result.url;
      next();
    }
    upload(req);
  } else {
    next();
  }
};

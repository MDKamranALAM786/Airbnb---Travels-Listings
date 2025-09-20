import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});
export {cloudinary};

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder : "wanderLust_WebDev",
        allowedFormats : ["png", "jpg", "jpeg"] // supports promises as well
    }
});

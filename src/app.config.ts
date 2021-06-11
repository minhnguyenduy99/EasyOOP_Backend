import { join } from "path";
// Defines the variable key
export const APP_CONFIG_KEY = {
    HOST: "APP_HOST",
    PORT: "APP_PORT",
    ROOT_DIR: "ROOT_DIR",
    PUBLIC_FOLDER: "PUBLIC_FOLDER",
    HTTPS: "HTTPS",
    FIREBASE_CONFIG_FILE: "FIREBASE_FILENAME",
    CLOUDINARY_URL: "CLOUDINARY_URL",
    CLOUDINARY_CONFIG: "CLOUDINARY.CONFIG",
};

// Get the value from environment and set it to a variable
export const AppConfig = () => ({
    [APP_CONFIG_KEY.HOST]: process.env.HOST || "localhost",
    [APP_CONFIG_KEY.PORT]: parseInt(process.env.PORT) || 3000,
    [APP_CONFIG_KEY.ROOT_DIR]: join(__dirname, ".."),
    [APP_CONFIG_KEY.PUBLIC_FOLDER]: process.env.PUBLIC_FOLDER,
    [APP_CONFIG_KEY.HTTPS]: process.env.IS_HOST_HTTPS || false,
    [APP_CONFIG_KEY.FIREBASE_CONFIG_FILE]: process.env.FIREBASE_CONFIG_FILE,
    [APP_CONFIG_KEY.CLOUDINARY_URL]: process.env.CLOUDINARY_URL,
    [APP_CONFIG_KEY.CLOUDINARY_CONFIG]: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        rootFolder: process.env.CLOUDINARY_ROOT_FOLDER,
    },
});

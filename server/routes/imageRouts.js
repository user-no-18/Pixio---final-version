import express from 'express'
import { generateImage , enhanceImage,
  removeBackground,
  removeText,
  uncropImage,
  replaceBackground,cleanup} from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'
import multer from "multer";

const imageRouter = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

imageRouter.post('/generate-image',userAuth,generateImage)
imageRouter.post("/enhance-image", userAuth, upload.single("image"), enhanceImage);
imageRouter.post("/remove-background", userAuth, upload.single("image"), removeBackground);
imageRouter.post("/remove-text", userAuth, upload.single("image"), removeText);
imageRouter.post("/uncrop-image", userAuth, upload.single("image"), uncropImage);
imageRouter.post("/replace-background", userAuth, upload.single("image"), replaceBackground);
imageRouter.post("/cleanup", userAuth, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'mask', maxCount: 1 }
]), cleanup);
export default imageRouter


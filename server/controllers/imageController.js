import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const generateImage = async (req, res) => {
  try {
   const { prompt } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!prompt) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    const formData = new FormData()
    formData.append("prompt", prompt)
    const response = await axios.post('https://clipdrop-api.co/text-to-image/v1' , formData , {
        headers:{
            'x-api-key' : process.env.CLIPDROP_API,
        },
        responseType : 'arraybuffer'
     })
     const buffer = response.data
     const base64Image = Buffer.from(buffer).toString("base64");
     const resultImage = `data:image/png;base64,${base64Image}`
     await userModel.findByIdAndUpdate(user._id,{creditBalance:user.creditBalance-1,resultImage})
     res.json({success:true , message:"Image Generated",creditBalance:user.creditBalance-1,resultImage})

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Enhance Image
export const enhanceImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image provided" });
    }

    // Get target dimensions from request or use default 2x upscale
    const targetWidth = req.body.target_width || 2048;
    const targetHeight = req.body.target_height || 2048;

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("target_width", targetWidth.toString());
    formData.append("target_height", targetHeight.toString());

    const response = await axios.post(
      "https://clipdrop-api.co/image-upscaling/v1/upscale",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );

    const buffer = response.data;
    const base64Image = Buffer.from(buffer).toString("base64");
    
    // Determine content type from response headers
    const contentType = response.headers['content-type'] || 'image/jpeg';
    const resultImage = `data:${contentType};base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Enhanced",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log("Enhance Image Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      success: false, 
      message: error.response?.data?.error || error.message 
    });
  }
};
// Remove Background
export const removeBackground = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image provided" });
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const buffer = response.data;
    const base64Image = Buffer.from(buffer).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Background Removed",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Remove Text
export const removeText = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image provided" });
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      "https://clipdrop-api.co/remove-text/v1",
      formData,
      {
           headers: {
      ...formData.getHeaders(),
      "x-api-key": process.env.CLIPDROP_API,
    },
        responseType: "arraybuffer",
      }
    );

    const buffer = response.data;
    const base64Image = Buffer.from(buffer).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Text Removed",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Uncrop Image
export const uncropImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image provided" });
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      "https://clipdrop-api.co/uncrop/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const buffer = response.data;
    const base64Image = Buffer.from(buffer).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Image Uncropped",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Replace Background
export const replaceBackground = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (!prompt) {
      return res.json({ success: false, message: "Missing prompt" });
    }

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.file) {
      return res.json({ success: false, message: "No image provided" });
    }

    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });
    formData.append("prompt", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/replace-background/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const buffer = response.data;
    const base64Image = Buffer.from(buffer).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Background Replaced",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const cleanup = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.creditBalance <= 0) {
      return res.json({
        success: false,
        message: "No credit balance",
        creditBalance: user.creditBalance,
      });
    }

    if (!req.files?.image || !req.files?.mask) {
      return res.json({
        success: false,
        message: "Image file and mask file are required",
      });
    }

    const imageFile = req.files.image[0];
    const maskFile = req.files.mask[0];

    const formData = new FormData();
    formData.append("image_file", imageFile.buffer, {
      filename: imageFile.originalname,
      contentType: imageFile.mimetype,
    });
    formData.append("mask_file", maskFile.buffer, {
      filename: maskFile.originalname,
      contentType: maskFile.mimetype,
    });

    formData.append("mode", "quality");

    const response = await axios.post(
      "https://clipdrop-api.co/cleanup/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const buffer = response.data;
    const base64Image = Buffer.from(buffer).toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    await userModel.findByIdAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      message: "Cleanup completed (Quality mode)",
      creditBalance: user.creditBalance - 1,
      resultImage,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.json({
      success: false,
      message: "Cleanup failed",
    });
  }
};

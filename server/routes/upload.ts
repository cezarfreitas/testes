import { RequestHandler } from "express";
import { UploadResponse } from "@shared/seo";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
const ensureUploadDir = () => {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
};

// Simple image compression (resize and optimize)
const compressImage = async (inputBuffer: Buffer, maxWidth: number = 1200): Promise<Buffer> => {
  // For now, we'll just return the original buffer
  // In a production app, you'd use a library like sharp or jimp
  // This is a placeholder that maintains the file structure
  return inputBuffer;
};

// Generate unique filename
const generateFilename = (originalName: string, buffer: Buffer): string => {
  const hash = createHash('md5').update(buffer).digest('hex').substring(0, 8);
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  return `${hash}_${timestamp}${ext}`;
};

// Handle file upload
export const uploadImage: RequestHandler = async (req, res) => {
  try {
    ensureUploadDir();
    
    // In a real application, you'd use multer or similar middleware
    // For this example, we'll handle base64 uploads
    const { image, filename, type } = req.body;
    
    if (!image || !filename) {
      const response: UploadResponse = {
        success: false,
        message: "Imagem e nome do arquivo são obrigatórios"
      };
      return res.status(400).json(response);
    }
    
    // Validate image type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (type && !validTypes.includes(type)) {
      const response: UploadResponse = {
        success: false,
        message: "Tipo de arquivo não suportado. Use JPEG, PNG, WebP ou GIF"
      };
      return res.status(400).json(response);
    }
    
    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Compress image
    const compressedBuffer = await compressImage(imageBuffer);
    
    // Generate unique filename
    const uniqueFilename = generateFilename(filename, compressedBuffer);
    const filePath = path.join(UPLOAD_DIR, uniqueFilename);
    
    // Save file
    fs.writeFileSync(filePath, compressedBuffer);
    
    // Return URL
    const fileUrl = `/uploads/${uniqueFilename}`;
    
    const response: UploadResponse = {
      success: true,
      url: fileUrl,
      message: "Imagem enviada com sucesso"
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error uploading image:", error);
    const response: UploadResponse = {
      success: false,
      message: "Erro ao fazer upload da imagem"
    };
    
    res.status(500).json(response);
  }
};

// Delete uploaded image
export const deleteImage: RequestHandler = (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(UPLOAD_DIR, filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ success: true, message: "Imagem removida com sucesso" });
    } else {
      res.status(404).json({ success: false, message: "Imagem não encontrada" });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ success: false, message: "Erro ao remover imagem" });
  }
};

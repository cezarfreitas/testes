import { RequestHandler } from "express";
import { SEOConfig, SEOResponse } from "@shared/seo";
import fs from "fs";
import path from "path";

const SEO_CONFIG_PATH = path.join(process.cwd(), "data", "seo-config.json");

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(SEO_CONFIG_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Default SEO configuration
const defaultSEOConfig: SEOConfig = {
  title: "",
  description: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  ogType: "website",
  ogUrl: "",
  twitterCard: "summary_large_image",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
  twitterSite: "",
  favicon: "",
  appleTouchIcon: "",
  canonical: "",
  robots: "index, follow",
  language: "pt-BR",
  companyName: "",
  socialLinks: {}
};

// Get SEO configuration
export const getSEOConfig: RequestHandler = (req, res) => {
  try {
    ensureDataDir();
    
    if (fs.existsSync(SEO_CONFIG_PATH)) {
      const configData = fs.readFileSync(SEO_CONFIG_PATH, "utf-8");
      const config: SEOConfig = JSON.parse(configData);
      
      const response: SEOResponse = {
        success: true,
        data: config
      };
      
      res.json(response);
    } else {
      // Return default config if file doesn't exist
      const response: SEOResponse = {
        success: true,
        data: defaultSEOConfig
      };
      
      res.json(response);
    }
  } catch (error) {
    console.error("Error reading SEO config:", error);
    const response: SEOResponse = {
      success: false,
      message: "Erro ao carregar configurações SEO"
    };
    
    res.status(500).json(response);
  }
};

// Update SEO configuration
export const updateSEOConfig: RequestHandler = (req, res) => {
  try {
    ensureDataDir();
    
    const config: SEOConfig = req.body;
    
    // Validate required fields
    if (!config.title || !config.description) {
      const response: SEOResponse = {
        success: false,
        message: "Título e descrição são obrigatórios"
      };
      
      return res.status(400).json(response);
    }
    
    // Save configuration to JSON file
    fs.writeFileSync(SEO_CONFIG_PATH, JSON.stringify(config, null, 2));
    
    const response: SEOResponse = {
      success: true,
      data: config,
      message: "Configurações SEO salvas com sucesso"
    };
    
    res.json(response);
  } catch (error) {
    console.error("Error saving SEO config:", error);
    const response: SEOResponse = {
      success: false,
      message: "Erro ao salvar configurações SEO"
    };
    
    res.status(500).json(response);
  }
};

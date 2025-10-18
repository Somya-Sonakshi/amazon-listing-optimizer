import express from "express";
import { fetchAmazonProduct } from "../scraping/fetchAmazonProduct.js";
import db from "../config/db.js";
import { optimizeText } from "../utils/huggingfaceClient.js";

const router = express.Router();

router.get("/optimize/:asin", async (req, res) => {
  const { asin } = req.params;

  try {
      if (!asin) {
  return res.status(400).json({ success: false, message: "ASIN is required" });
}
    console.log(` Received optimize request for ASIN: ${asin}`);
    const product = await fetchAmazonProduct(asin);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch product details. Please check the ASIN.",
      });
    }

    console.log("Product fetched:", product.asin);

    const [existing] = await db.query(
      "SELECT asin FROM products WHERE asin = ?",
      [product.asin]
    );

    if (existing.length === 0) {
      await db.query(
        `INSERT INTO products (asin, title, description) VALUES (?, ?, ?)`,
        [product.asin, product.title, product.description]
      );
      console.log("Product inserted into products table");
    } else {
      console.log("Product already exists, skipping insert");
    }

   
   const optimizedContent = await optimizeText(`
You are an assistant that optimizes Amazon product listings.
ALWAYS respond ONLY with valid JSON, no text before or after it.
The JSON MUST follow this exact format:

{
  "title": "Optimized product title",
  "description": "Optimized product description",
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}

Title to optimize: "${product.title}"
Description to optimize: "${product.description}"
Bullet points to optimize:
${product.bullets.join("\n")}

Also, generate 5–10 high-value SEO keywords relevant to the product and include them in the "keywords" array.
`);

    if (!optimizedContent) {
      console.error(" AI returned null or invalid response");
      return res.status(500).json({
        success: false,
        message: "AI failed to return valid optimization. Please retry.",
      });
    }


    const {
      title: optTitle,
      description: optDesc,
      bullets: optBullets = [],
      keywords: optKeywords = [],
    } = optimizedContent;

    try {
      await db.query(
        `
        INSERT INTO optimizations 
        (asin, original_title, original_bullets, original_description, optimized_title, optimized_bullets, optimized_description, optimized_keywords) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          product.asin,
          product.title,
          JSON.stringify(product.bullets),
          product.description,
          optTitle,
          JSON.stringify(optBullets),
          optDesc,
          JSON.stringify(optKeywords),
        ]
      );
      console.log("Optimization stored successfully");
    } catch (dbErr) {
      console.error("Error storing optimization in DB:", dbErr);
    }
    res.status(200).json({
      success: true,
      message: "Product optimized successfully",
      data: {
        asin: product.asin,
        original_title: product.title,
        original_bullets: product.bullets,
        original_description: product.description,
        optimized_title: optTitle,
        optimized_bullets: optBullets,
        optimized_description: optDesc,
        optimized_keywords: optKeywords,
      },
    });
  } catch (err) {
    console.error("Error in /optimize route:", err);
    res.status(500).json({
      success: false,
      message: "Failed to optimize product",
      error: err.message,
    });
  }
});


router.get("/history/:asin", async (req, res) => {
  const { asin } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT id, asin, original_title, original_bullets, original_description,
              optimized_title, optimized_bullets, optimized_description, optimized_keywords, created_at
       FROM optimizations
       WHERE asin = ?
       ORDER BY created_at DESC`,
      [asin]
    );
    const parsed = rows.map(r => ({
      id: r.id,
      asin: r.asin,
      original_title: r.original_title,
      original_bullets: r.original_bullets ? JSON.parse(r.original_bullets) : [],
      original_description: r.original_description,
      optimized_title: r.optimized_title,
      optimized_bullets: r.optimized_bullets ? JSON.parse(r.optimized_bullets) : [],
      optimized_description: r.optimized_description,
      optimized_keywords: r.optimized_keywords ? JSON.parse(r.optimized_keywords) : [],
      created_at: r.created_at,
    }));
    console.log(parsed)
    res.status(200).json({ success: true, data: parsed });
  } catch (err) {
    console.error("Error fetching history:", err);
    res.status(500).json({ success: false, message: "Failed to fetch history" });
  }
});


export default router;

# 🛍️ Amazon Listing Optimizer

This project is a full-stack web application that optimizes Amazon product listings using AI.  
It fetches product details by **ASIN**, enhances them with an AI model (via Hugging Face), and stores optimization history in **MySQL** for later viewing.

---

## 🚀 Features

- Fetches Amazon product details (title, bullets, description) by ASIN  
- Uses AI (Hugging Face model) to:
  - Rewrite titles to be keyword-rich  
  - Improve bullet points for clarity  
  - Enhance descriptions persuasively  
  - Suggest SEO keywords  
- Displays side-by-side comparison of original vs. optimized listings  
- Saves each optimization run in MySQL  
- Provides a history page for each ASIN to track past optimizations  

---

## 🛠️ Tech Stack

- **Backend:** Node.js + Express  
- **Frontend:** React + Axios + Tailwind CSS  
- **Database:** MySQL  
- **AI:** Hugging Face Inference API  

---

## 🗄️ Database Setup

Run the schema file to create required tables:

```sql
-- schema.sql
CREATE DATABASE amazon_optimizer;

USE amazon_optimizer;

CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(20) UNIQUE NOT NULL,
  title TEXT,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE optimizations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  asin VARCHAR(20) NOT NULL,
  original_title TEXT,
  original_bullets JSON,
  original_description TEXT,
  optimized_title TEXT,
  optimized_bullets JSON,
  optimized_description TEXT,
  optimized_keywords JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (asin) REFERENCES products(asin)
);
```

## ⚙️ Environment Variables
Create a .env file inside backend/:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=amazon_optimizer
HF_TOKEN=your_huggingface_api_key


▶️ Running the Project
Backend

-- cd backend
-- npm install
-- node server.js

Backend runs on: http://localhost:5000

Frontend

-- cd frontend
-- npm install
-- npm start

Frontend runs on: http://localhost:3000


🧠 AI Prompt Design

We use a strict system prompt to enforce JSON output:

{
  "title": "Optimized product title",
  "description": "Optimized product description",
  "bullets": ["Bullet 1", "Bullet 2", "Bullet 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"]
}
Rules enforced:

No extra text outside JSON

Arrays required for bullets & keywords

Always return all four fields

This ensures the response can be parsed directly and stored in the database.

📜 API Endpoints
GET /api/optimize/:asin
Fetches product details, runs AI optimization, stores results, and returns comparison.

GET /api/history/:asin
Returns optimization history for a given ASIN.

🧪 Example Workflow
User enters ASIN B07H65KP63 in frontend

Backend scrapes Amazon → gets product title, bullets, description

AI returns optimized JSON (title, bullets, description, keywords)

Backend stores results in MySQL

Frontend shows before vs. after comparison

History page (/history/:asin) shows all past runs

📝 Notes
Use real ASINs for testing (e.g., B07H65KP63)

If scraping fails (due to Amazon restrictions), mock data can be used

Hugging Face free tier may have rate limits

📌 Future Improvements
Add user authentication

Export optimized listings as CSV/Excel

Add analytics (e.g., keyword frequency)

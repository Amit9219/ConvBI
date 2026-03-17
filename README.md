# Conversational BI Dashboard Generator

An intelligent MERN-stack SaaS application where non-technical users can generate dynamic, interactive dashboards using plain English queries connected to an LLM pipeline.

## Features
- **Authentication**: JWT secured protected routes.
- **Dataset Upload**: Drag and drop CSV uploads processed by Multer and CSV-Parser. Dynamic schema generation based on columns.
- **Conversational Queries**: Chat UI to interact with Google Gemini AI. Converts natural language queries into strict JSON aggregations and filter logic.
- **Dynamic Charting**: Automatically translates backend aggregation JSON responses into beautiful, interactive Recharts visualizations (Bar, Line, Pie, Scatter, Tables).
- **Dashboard Management**: Save and review past visualizations in an organized dashboard interface.

---

## 🚀 Setup Instructions

### 1. Backend Configuration
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file in the `backend` root with the following:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/convbi
   JWT_SECRET=super_secret_key_change_me
   GEMINI_API_KEY=your_google_ai_gemini_key
   ```
4. Start the backend: `node server.js`

### 2. Frontend Configuration
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the React development server: `npm run dev`

---

## ☁️ Deployment

- **Frontend (Vercel / Netlify):** 
  Link the `frontend` directory. The build command is `npm run build` and the output directory is `dist`.
- **Backend (Render / Railway):** 
  Link the `backend` directory. Ensure the start command is set to `node server.js`. Add your `.env` variables via the host dashboard.
- **Database (MongoDB Atlas):** 
  Create a free M0 tier cluster. Whitelist the IP addresses or allow all `0.0.0.0/0` if required by Render. Add the `MONGO_URI` to your backend `.env`.

---

## 🧠 Demo Flow
1. **Register** a new account and **Sign In**.
2. Navigate to the **Datasets** page and upload a `sample_sales.csv` with columns: `date`, `region`, `product`, `revenue`.
3. Go to the **New AI Query** page, ensure the dataset is selected, and try dropping these prompts:
   - *"Show me a pie chart of revenue across regions"*
   - *"Plot a line chart showing revenue over date"*
   - *"Show me a bar chart highlighting the product distribution"*

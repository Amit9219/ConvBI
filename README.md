# 📊 Conversational BI Dashboard Generator

An intelligent MERN-stack SaaS application that empowers non-technical users to generate dynamic, interactive dashboards using plain English queries connected to a Google Gemini AI pipeline.

---

## ✨ Features

- **🔐 Secure Authentication**: Robust JWT-based authentication system with protected API routes and frontend navigation.
- **📁 Dataset Onboarding**: Drag-and-drop CSV upload support with automatic schema detection and processing.
- **💬 Conversational Queries**: A dedicated chat interface powered by Google Gemini AI that translates natural language into precise JSON aggregation and filter logic.
- **📈 Dynamic Visualizations**: Automatically generates beautiful, interactive charts (Bar, Line, Pie, Scatter, Area) and data tables using Recharts.
- **🏠 Dashboard Management**: Personalized user workspace to save, view, and organize historical visualizations.
- **🎨 Premium UI/UX**: Modern, responsive design crafted with Tailwind CSS and enhanced with smooth Framer Motion animations.

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: [React.js](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: Context API / Zustand

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **AI Integration**: [Google Gemini AI](https://ai.google.dev/)
- **Auth**: [JSON Web Tokens (JWT)](https://jwt.io/)
- **File Handling**: [Multer](https://github.com/expressjs/multer) & [CSV-Parser](https://csv.js.org/parser/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB instance
- Google AI (Gemini) API Key

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## ☁️ Deployment

- **Frontend**: Connect the `frontend` directory to Vercel or Netlify. Use `npm run build` and `dist` output directory.
- **Backend**: Deploy the `backend` directory to Render, Railway, or Heroku.
- **Database**: Use MongoDB Atlas for a managed cloud database solution.

---

## 🧠 Example Queries
Once a dataset is uploaded, try asking:
- *"Show me a bar chart of total sales per region"*
- *"Plot a line chart for monthly revenue trends"*
- *"Give me a pie chart showing the distribution of product categories"*


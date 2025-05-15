# InterProcess Interactions

A tool aimed at exploring inter-process interactions from event data. 
This project is built with a **Vite-powered React frontend** and a **Flask-based backend**.

---

## Project Structure

```bash
.
├── backend/ # Flask backend (Python)
│ ├── app/ # Backend source code
│ ├── run.py # Entry point
│ └── requirements.txt # Python dependencies
├── frontend/ # Frontend (Vite + React)
│ ├── src/ # Frontend source code
│ ├── public/ # Static assets
│ ├── index.html # App entry
│ ├── vite.config.js # Vite config
│ └── package.json # Node dependencies
├── example_data/ # Example event logs for demo or test
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/hudsonjychen/InterProcess-Interactions.git
cd InterProcess-Interactions-master
```

### 2. Set Up the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Macos:venv/bin/activate
pip install -r requirements.txt
python run.py              # Start Flask server
```

### 3. Set Up the Frontend
```bash
cd frontend
npm install
npm run dev
```


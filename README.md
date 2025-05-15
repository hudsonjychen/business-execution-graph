# InterProcess Interactions

A tool aimed at exploring inter-process interactions from event data. 
This project is built with a **Vite-powered React frontend** and a **Flask-based backend**.

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

### Prerequisites

- [Node.js](https://nodejs.org/) >= 16.x
- [Python](https://www.python.org/) >= 3.8
- [pip](https://pip.pypa.io/en/stable/)

### 1. Clone the Repository
```bash
git clone https://github.com/hudsonjychen/InterProcess-Interactions.git
cd InterProcess-Interactions-master
```

### 2. Set Up the Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate # MacOS:source venv/bin/activate
pip install -r requirements.txt
python run.py # Start Flask server
```

### 3. Set Up the Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Explore the Application
#### Import data
Import the example event log located in the example_data\ directory by clicking the **Import** button in the top-left corner of the page.
#### Navigate Between Views
Use the menu in the header to switch between the **Interaction Discovery** and **Process Knowledge** pages, gaining deeper insights from the event data.
#### Apply Filters
Utilize the **Object Type and Process Filters** located in the top-right corner of the page to easily refine the displayed interactions according to your preferences.
#### Experiment with Color Palette
Use the **Color Palette** tool to assign meaningful visual cues to node colors. Select a desired color, and the darkness of the node's color will represent the **intensity or number of related edges**. On the Process Knowledge page, color is used to differentiate between process nodes, object type nodes, and activity nodes.
#### Interact with the Graph
Engage with the graph by using the following interactions: zoom in and out to adjust the view, drag nodes to reposition them, and click on nodes to display their **information cards**.
#### Discover More in Settings
Additional functionalities are available in the settings drawer. Explore options ranging from assigning edge notations to applying advanced node filters.



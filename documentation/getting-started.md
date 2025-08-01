# Getting Started

Business Execution Graph is a tool that visualize inter-process interactions from a process-enriched object-centric event log (OCEL). It offers a clean interface and intuitive design, allowing users to get started quickly and efficiently.

To begin, follow the steps below.

## Installation and Set Up
### Prerequisties
- [Node.js](https://nodejs.org/) >= 16.x
- [Python](https://www.python.org/) >= 3.8
- [pip](https://pip.pypa.io/en/stable/)

### 1. Clone the Repository
```bash
git clone https://github.com/hudsonjychen/business-execution-graph.git
cd business-execution-graph
```

### 2. Set Up the Backend
#### Windows
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
```
#### macOS
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python run.py
```

### 3. Set Up the Frontend
```bash
cd frontend
npm install
npm run dev
```
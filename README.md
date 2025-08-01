# BEG (Business Execution Graph)

Business Execution Graph is the companion tool of [Procellar](https://github.com/hudsonjychen/procellar). It is a part of our framework that enhances analytical power of object-centric process mining (OCPM). You can learn more about our initiative in our paper.

**"Process-Level Aggregation and Analysis of Object-Centric Event Data"**  
*Shahrzad Khayatbashi, Majid Rafiei, Jiayuan Chen, and Amin Jalali*

Submitted to the [10th International Workshop on Process Querying, Manipulation, and Intelligence (PQMI 2025)](http://processquerying.com/pqmi2025/)

To take a look at our case study, please go to [Process-Level-OCPM](https://github.com/shahrzadkhayatbashi/Process-Level-OCPM).


## Project Structure

- `backend/app` - Backend source code
- `backend/requirements.txt` - Requirements txt for setting up
- `backend/run.py` - Entry point for starting the Flask server
- `documentation` - Documentation for Business Execution Graph
- `example-data` - Example process enriched OCEL
- `frontend/src` - Frontend source code
- `frontend/package.json` - Frontend dependencies and build scripts
- `README.md` - README

## Documentation
Refer to the documentation for a quick start and comprehensive information.



## Getting Started

### Prerequisites

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
python run.py # Start Flask server
```
#### macOS
```bash
cd backend
python -m venv venv
source venv/bin/activate
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



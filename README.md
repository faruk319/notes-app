# Notes App

## Setup

### Frontend
```bash
cd frontend
npm install
npm start
```

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Firebase Setup
1. Create Firebase project
2. Enable Authentication (Email/Password)
3. Generate service account key for backend
4. Update frontend/src/firebase.js with your config
5. Update backend/main.py with service account key path

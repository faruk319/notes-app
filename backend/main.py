from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import firebase_admin
from firebase_admin import credentials, auth
from typing import List, Optional
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
import os
if os.path.exists("serviceAccountKey.json"):
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
else:
    # Use default credentials or environment variable
    firebase_admin.initialize_app()

# In-memory storage (replace with database)
notes_db = {}

class Note(BaseModel):
    title: str
    content: str

class NoteResponse(BaseModel):
    id: str
    title: str
    content: str
    user_id: str

async def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid token")
    
    token = authorization.split("Bearer ")[1]
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.get("/notes", response_model=List[NoteResponse])
async def get_notes(user_id: str = Depends(get_current_user)):
    user_notes = [note for note in notes_db.values() if note['user_id'] == user_id]
    return user_notes

@app.post("/notes", response_model=NoteResponse)
async def create_note(note: Note, user_id: str = Depends(get_current_user)):
    note_id = f"{user_id}_{len(notes_db)}"
    new_note = {
        "id": note_id,
        "title": note.title,
        "content": note.content,
        "user_id": user_id
    }
    notes_db[note_id] = new_note
    return new_note

@app.put("/notes/{note_id}", response_model=NoteResponse)
async def update_note(note_id: str, note: Note, user_id: str = Depends(get_current_user)):
    if note_id not in notes_db or notes_db[note_id]['user_id'] != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    
    notes_db[note_id].update({"title": note.title, "content": note.content})
    return notes_db[note_id]

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str, user_id: str = Depends(get_current_user)):
    if note_id not in notes_db or notes_db[note_id]['user_id'] != user_id:
        raise HTTPException(status_code=404, detail="Note not found")
    
    del notes_db[note_id]
    return {"message": "Note deleted"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

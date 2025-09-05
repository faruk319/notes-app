import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const Notes = ({ user }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);

  const API_URL = 'http://localhost:8000';

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const token = await user.getIdToken();
      const response = await fetch(`${API_URL}/notes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return;
    
    try {
      const token = await user.getIdToken();
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/notes/${editingId}` : `${API_URL}/notes`;
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      
      setTitle('');
      setContent('');
      setEditingId(null);
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const deleteNote = async (id) => {
    try {
      const token = await user.getIdToken();
      await fetch(`${API_URL}/notes/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Notes</h1>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
      
      <div style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '5px 0' }}
        />
        <textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ width: '100%', padding: '10px', margin: '5px 0', height: '100px' }}
        />
        <button onClick={saveNote} style={{ padding: '10px 20px' }}>
          {editingId ? 'Update Note' : 'Add Note'}
        </button>
        {editingId && (
          <button onClick={() => { setTitle(''); setContent(''); setEditingId(null); }} style={{ padding: '10px 20px', marginLeft: '10px' }}>
            Cancel
          </button>
        )}
      </div>

      <div>
        {Array.isArray(notes) && notes.length > 0 ? (
          notes.map(note => (
            <div key={note.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
              <h3>{note.title}</h3>
              <p>{note.content}</p>
              <button onClick={() => editNote(note)} style={{ marginRight: '10px' }}>Edit</button>
              <button onClick={() => deleteNote(note.id)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No notes yet. Create your first note!</p>
        )}
      </div>
    </div>
  );
};

export default Notes;

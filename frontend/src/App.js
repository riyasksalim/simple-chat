import React, { useState } from 'react';
import Chat from './components/Chat';
import Login from './components/Login';
import { Container } from '@mui/material';

function App() {
  const [username, setUsername] = useState('');

  return (
    <Container
    
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Ensure full viewport height
        padding: 0,
      }}
    >
      {username ? (
        <Chat username={username} />
      ) : (
        <Login setUsername={setUsername} />
      )}
    </Container>
  );
}

export default App;
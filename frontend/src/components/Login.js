
import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';

function Login({ setUsername }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    if (name.trim()) {
      setUsername(name.trim());
    } else {
      setError('Name cannot be empty');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleJoin();
    }
  };

  return (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleJoin();
      }}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Enter your name
      </Typography>
      <TextField
        variant="outlined"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        onKeyDown={handleKeyDown}
        error={!!error}
        helperText={error}
        fullWidth
        style={{ marginBottom: '1rem', maxWidth: '400px' }}
        autoFocus
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleJoin}
        size="large"
        type="submit"
      >
        Join Chat
      </Button>
    </Box>
  );
}

export default Login;
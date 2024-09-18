
import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Button,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import materialLight from 'react-syntax-highlighter/dist/esm/styles/prism/material-light';

function Chat({ username }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit('join', username, (response) => {
      if (response.error) {
        console.error(response.error);
      }
    });

    socket.on('message', (data) => {
      console.log('Received message:', data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off('message');
    };
  }, [username]);

  useEffect(() => {
    // Scroll to the bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { text: message });
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch((err) => {
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Ensure the container takes full height
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Messages Area */}
      <Box
        sx={{
          flex: 1, // Take up available space
          overflowY: 'auto',
          padding: '1rem',
        }}
      >
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent:
                msg.user === username ? 'flex-end' : 'flex-start',
              marginBottom: '1rem',
            }}
          >
            <Paper
              sx={{
                padding: '1rem',
                maxWidth: '100%',
                backgroundColor:
                  msg.user === username ? '#DCF8C6' : '#FFFFFF',
                position: 'relative',
              }}
            >
              <SyntaxHighlighter
                language="javascript"
                style={materialLight}
                customStyle={{
                  margin: 0,
                  backgroundColor: 'transparent',
                }}
                wrapLines
                wrapLongLines
              >
                {msg.text}
              </SyntaxHighlighter>
              <IconButton
                size="small"
                onClick={() => copyToClipboard(msg.text)}
                sx={{ position: 'absolute', top: 0, right: 0 }}
                aria-label="Copy message"
              >
                <ContentCopyIcon fontSize="small" />
              </IconButton>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '0.5rem',
                }}
              >
                {/* <Box component="span" sx={{ fontSize: '0.8rem', color: 'gray' }}>
                  {msg.user}
                </Box> */}
                {/* <Box component="span" sx={{ fontSize: '0.8rem', color: 'gray' }}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Box> */}
              </Box>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        sx={{
          padding: '1rem',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #e0e0e0',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Type your code here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            fullWidth
            autoFocus
            InputProps={{
              style: { fontFamily: 'monospace' },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            sx={{ marginLeft: '1rem' }}
            endIcon={<SendIcon />}
            type="submit"
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default Chat;
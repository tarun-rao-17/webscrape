import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Grid2, 
  CircularProgress, 
  Card, 
  CardMedia 
} from '@mui/material';

const App = () => {
  const [url, setUrl] = useState('');
  const [loading, setloading] = useState(false);
  const [result, setresult] = useState(null);

  const handlesubmit = async (e) => {
    setloading(true);
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/scrape/', { url });
      setresult(response.data);
    } catch (error) {
      console.error(error);
      alert('There was an error');
    }
    setloading(false);
  };

  const containerStyle = {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'

  };

  const headerStyle = {
    color: '#2c3e50',
    marginBottom: '30px',
    textAlign: 'center',
    fontWeight: '600'
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '30px'
  };

  const buttonStyle = {
    marginTop: '20px',
    padding: '12px 24px',
    fontSize: '16px',
    width: '200px',
    display: 'block',
    margin: '20px auto 0'
  };

  const resultContainerStyle = {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginTop: '30px'
  };

  const resultTitleStyle = {
    color: '#2c3e50',
    marginBottom: '20px',
    fontWeight: '500'
  };

  const imageCardStyle = {
    transition: 'transform 0.2s',
    cursor: 'pointer',
    ':hover': {
      transform: 'scale(1.05)'
    },
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  return (
    <Container style={containerStyle}>
      <Typography variant="h4" style={headerStyle} gutterBottom>
        Web Scraper
      </Typography>
      
      <form onSubmit={handlesubmit} style={formStyle}>
        <TextField
          fullWidth
          label="Enter URL"
          variant="outlined"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          margin="normal"
          required
          style={{ marginBottom: '20px' }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? <CircularProgress size={24} /> : 'Scrape'}
        </Button>
      </form>

      {result && (
        <div style={resultContainerStyle}>
          <Typography variant="h5" style={resultTitleStyle} gutterBottom>
            {result.title}
          </Typography>
          <Typography 
            variant="body1" 
            style={{ marginBottom: '20px', lineHeight: '1.6' }}
          >
            {result.description}
          </Typography>
          <Typography 
            variant="body2" 
            style={{ marginBottom: '20px', color: '#666' }}
          >
            Found {result.images.length} images
          </Typography>
          
          <Grid2 container spacing={3}>
            {result.images.map((img, index) => (
              <Grid2 item xs={12} sm={6} md={4} key={index}>
                <Card style={imageCardStyle}>
                  <CardMedia
                    component="img"
                    image={img}
                    height="200"
                    alt={`Scraped ${index}`}
                    style={{ objectFit: 'cover' }}
                  />
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </div>
      )}
    </Container>
  );
};

export default App;
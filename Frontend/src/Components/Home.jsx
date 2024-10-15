import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Box, Button, Card, CardMedia, CardContent, Typography, LinearProgress, Grid, Container } from '@mui/material';
import Carousel from 'react-material-ui-carousel';

function Home() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [error, setError] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/campgrounds');
        setCampgrounds(response.data.campgrounds);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Handle scroll progress for the linear progress bar
  const handleScroll = useCallback(() => {
    const progress = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // Truncate description to 50 words
  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 10 ? words.slice(0, 50).join(' ') + '...' : description;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Campground List
      </Typography>

      <Grid container spacing={3} justifyContent="center" direction="row"> {/* Center cards */}
        {campgrounds.map((campground) => (
          <Grid item xs={12} sm={6} md={6} key={campground._id}> {/* Responsive card layout */}
            <Card 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginBottom: '20px', 
                width: '100%', 
                maxWidth: '600px', // Fixed width for the card
                height: '500px' // Fixed height for equal size
              }}
            >
              {campground.images && campground.images.length > 0 ? (
                <Carousel>
                  {campground.images.map((image, index) => (
                    <CardMedia
                      key={index}
                      component="img"
                      sx={{
                        height: '300px',  // Fixed height for images
                        objectFit: 'cover' // Maintain aspect ratio
                      }}
                      image={image.url}
                      alt={`Image of ${campground.title}`}
                    />
                  ))}
                </Carousel>
              ) : (
                <CardMedia
                  component="img"
                  sx={{
                    height: '300px',  // Fixed height for images
                    objectFit: 'cover' // Maintain aspect ratio
                  }}
                  image="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={`Default image for ${campground.title}`}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}> {/* Ensure CardContent grows to fill space */}
                <Typography variant="h5" component="div" gutterBottom>
                  {campground.title}
                </Typography>
                
                <Typography variant="body2" color="textSecondary">
                  {truncateDescription(campground.description)} {/* Show truncated description */}
                </Typography>

                <Typography variant="subtitle1">
                  <strong>Location:</strong> {campground.location}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Price:</strong> ${campground.price}
                </Typography>
                <Typography variant="subtitle1">
                  <strong>Author ID:</strong> {campground.author}
                </Typography>
                <Box sx={{ flexGrow: 1 }} /> {/* Spacer to push button down */}
                <Button
                  variant="contained"
                  color="primary"
                  href={`/campgrounds/${campground._id}`}
                  style={{ marginTop: '10px' }}
                >
                  View {campground.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <LinearProgress variant="determinate" value={scrollProgress} style={{ marginTop: '20px' }} />
    </Container>
  );
}

export default Home;


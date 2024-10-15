import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, Card, CardMedia, CardContent, Typography, Grid, Container } from '@mui/material';

function Home() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/campgrounds'); // Adjust API endpoint
        setCampgrounds(response.data.campgrounds);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  // Truncate description to 10 words to keep card content concise
  const truncateDescription = (description) => {
    const words = description.split(' ');
    return words.length > 10 ? words.slice(0, 10).join(' ') + '...' : description;
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Campground List
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {campgrounds.map((campground) => (
          <Grid item xs={12} key={campground._id}> {/* Always full width on all screen sizes */}
            <Card 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                marginBottom: '20px', 
                width: '100%', 
                maxWidth: '800px', // Set a max width for the card
                margin: '0 auto',  // Center-align the card
                height: '450px'  // Adjust height for consistent layout
              }}
            >
              {campground.images && campground.images.length > 0 ? (
                <CardMedia
                  component="img"
                  sx={{
                    height: '250px',  // Set a fixed height for the images
                    objectFit: 'cover'
                  }}
                  image={campground.images[0].url} // First image from the images array
                  alt={`Image of ${campground.title}`}
                />
              ) : (
                <CardMedia
                  component="img"
                  sx={{
                    height: '250px',  // Set a fixed height for the placeholder image
                    objectFit: 'cover'
                  }}
                  image="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt={`Default image for ${campground.title}`}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="div" gutterBottom>
                  {campground.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {truncateDescription(campground.description)} {/* Short description */}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  {campground.location}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  href={`/campgrounds/${campground._id}`}
                  sx={{ marginTop: '10px' }}
                >
                  View {campground.title}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;

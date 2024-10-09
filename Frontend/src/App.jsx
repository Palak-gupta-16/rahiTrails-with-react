import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'


function App() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace 'YOUR_API_URL' with your actual API endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/campgrounds');
        console.log(response.data)
        setCampgrounds(response.data);
      } catch (err) {
        setError(err.message);
      } 
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   axios.get('http://localhost:3000/campgrounds')
  // .then(response => {
  //   console.log('Data fetched:', response.data);
  // })
  // .catch(error => {
  //   console.error('Error fetching data:', error);
  // });
  // }, []);

  return (
    <>
    
    <div>
    <h1>Campground List</h1>
    <ul>
      {(
        campgrounds.map((campground) => (
          <li key={campground._id}>
            <h2>{campground.title}</h2>
            <p>{campground.description}</p>
            <p><strong>Location:</strong> {campground.location}</p>
            <p><strong>Price:</strong> ${campground.price}</p>
            <p><strong>Author ID:</strong> {campground.author}</p>

            {/* Render images */}
            {/* {campground.images && campground.images.length > 0 && (
              <div>
                <h3>Images:</h3>
                <ul>
                  {campground.images.map((image) => (
                    <li key={image._id}>
                      <img
                        src={image.url}
                        alt={campground.title}
                        style={{ width: '200px', height: 'auto' }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
          </li>
        ))
      ) }
    </ul>
  </div>
  </>
  )
}

export default App

import axios from 'axios';
import { useEffect } from 'react';
// 커밋중
const Home = () => {
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKSERVER}/schedules`)
      .then((response) => {
        console.log('Schedules:', response.data);
      })
      .catch((error) => {
        console.error('Error fetching schedules:', error);
      });
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple home page component.</p>
    </div>
  );
};

export default Home;

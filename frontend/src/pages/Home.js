import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SongCard from '../components/SongCard';

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [currentAudioSrc, setCurrentAudioSrc] = useState(null);

  useEffect(() => {
    axios.post('http://localhost:5000/songs/allsongs')
      .then((res) => {
        setSongs(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error('Error fetching songs:', err);
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎵 All Songs</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap',flexDirection:'column' }}>
        {songs.map((song) => (
          <SongCard
            key={song._id}
            song={song}
            currentAudioSrc={currentAudioSrc}
            setCurrentAudioSrc={setCurrentAudioSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

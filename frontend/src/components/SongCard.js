import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const SongCard = ({ song, currentAudioSrc, setCurrentAudioSrc }) => {
  const audioRef = useRef(null);
  const [like, setLike] = useState(song.likes);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeDisplay, setTimeDisplay] = useState('0:00 / 0:00');
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) return;
    axios
      .put(
        'http://localhost:5000/songs/updateLike',
        { id: song._id },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4N2E3OWE5OTczMmRmMmNjMTgzNDAzMCIsImVtYWlsIjoicmV2YW50aEBnbWFpbC5jb20iLCJpYXQiOjE3NTM0NTk1NTUsImV4cCI6MTc1MzU0NTk1NX0.gojryzKpTMSplBaEOF6acKSkLVp1EXGV2h5HqXyVgAI`,
          },
        }
      )
      .then(() => {
        setLike(like + 1);
        setLiked(true);
      })
      .catch((err) => console.error('Like failed:', err));
  };

  const togglePlay = () => {
    if (!song.filePath) return;

    const normalizedPath = song.filePath.replace(/\\/g, '/');
    const filename = normalizedPath.split('/').pop();
    const streamUrl = `http://localhost:5000/songs/stream/${filename}`;

    if (currentAudioSrc === streamUrl) {
      setIsPlaying((prev) => !prev);
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((e) =>
          console.warn('Playback error:', e)
        );
      }
    } else {
      setCurrentAudioSrc(streamUrl);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      const current = formatTime(audio.currentTime);
      const total = formatTime(audio.duration || 0);
      setTimeDisplay(`${current} / ${total}`);
    };

    audio.addEventListener('timeupdate', updateTime);
    return () => {
      audio.removeEventListener('timeupdate', updateTime);
    };
  }, [currentAudioSrc]);

  useEffect(() => {
    if (!audioRef.current) return;

    const normalizedPath = song.filePath?.replace(/\\/g, '/');
    const filename = normalizedPath?.split('/').pop();
    const streamUrl = `http://localhost:5000/songs/stream/${filename}`;

    if (currentAudioSrc === streamUrl) {
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setTimeDisplay('0:00 / 0:00');
    }
  }, [currentAudioSrc, isPlaying, song.filePath]);

  if (!song.filePath) {
    return (
      <div style={styles.card}>
        <h3 style={styles.title}>{song.title}</h3>
        <p style={styles.artist}><strong>Artist:</strong> {song.artist}</p>
        <p style={styles.warning}>⚠️ No song file available</p>
      </div>
    );
  }

  const normalizedPath = song.filePath.replace(/\\/g, '/');
  const filename = normalizedPath.split('/').pop();
  const audioUrl = `http://localhost:5000/songs/stream/${filename}`;

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{song.title}</h3>
      <p style={styles.artist}>{song.artist}</p>

      <div style={styles.controls}>
        <button onClick={togglePlay} style={styles.playBtn}>
          {currentAudioSrc === audioUrl && isPlaying ? '⏸️' : '▶️'}
        </button>

        {currentAudioSrc === audioUrl && (
          <>
            <audio ref={audioRef} src={audioUrl} />
            <span style={styles.timer}>{timeDisplay}</span>
          </>
        )}
      </div>

      <div style={styles.likeRow}>
        <p style={styles.likes}>❤️ {like || 0}</p>
        <button
          onClick={handleLike}
          style={{
            ...styles.likeBtn,
            backgroundColor: liked ? '#1db954' : '#fff',
            color: liked ? '#fff' : '#000',
          }}
        >
          {liked ? 'Liked 💚' : 'Like'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#121212',
    color: '#fff',
    padding: '1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
    width: '320px',
    margin: '1rem auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.7rem',
    fontFamily: "'Segoe UI', sans-serif",
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  artist: {
    color: '#bbb',
    marginBottom: '0.3rem',
  },
  warning: {
    color: '#ff6b6b',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  playBtn: {
    backgroundColor: '#1db954',
    color: '#fff',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '1.2rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  timer: {
    fontSize: '0.9rem',
    color: '#ccc',
  },
  likeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likes: {
    margin: 0,
    fontSize: '0.95rem',
  },
  likeBtn: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '0.4rem 0.8rem',
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  },
};

export default SongCard;

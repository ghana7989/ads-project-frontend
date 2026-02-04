import { Box, Button, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <Box
      onClick={onStart}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      <Button
        variant="contained"
        size="large"
        startIcon={<PlayArrowIcon />}
        onClick={onStart}
        sx={{
          fontSize: '1.5rem',
          padding: '20px 40px',
          borderRadius: '50px',
          textTransform: 'none',
          backgroundColor: 'primary.main',
          '&:hover': {
            backgroundColor: 'primary.dark',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        Click to Start Display
      </Button>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          mt: 3,
          fontSize: '1.1rem',
        }}
      >
        Click anywhere to begin playback
      </Typography>
    </Box>
  );
}

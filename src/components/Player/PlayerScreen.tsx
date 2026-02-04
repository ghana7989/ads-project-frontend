import { Box, IconButton } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SequencePlayer from './SequencePlayer';
import ConnectionStatus from '../Status/ConnectionStatus';
import { useFullscreen } from '../../hooks/useFullscreen';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useState } from 'react';

export default function PlayerScreen() {
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { isConnected } = useWebSocket();
  const [showControls, setShowControls] = useState(false);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        overflow: 'hidden',
      }}
      onMouseMove={() => {
        setShowControls(true);
        setTimeout(() => setShowControls(false), 3000);
      }}
    >
      <SequencePlayer />

      {/* Connection Status */}
      <ConnectionStatus isConnected={isConnected} />

      {/* Fullscreen Toggle (hidden by default, shown on hover) */}
      {showControls && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              },
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
        </Box>
      )}
    </Box>
  );
}

import { Box, Typography } from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import WifiOffIcon from '@mui/icons-material/WifiOff';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export default function ConnectionStatus({ isConnected }: ConnectionStatusProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        right: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        padding: '4px 8px',
        borderRadius: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
      }}
    >
      {isConnected ? (
        <WifiIcon sx={{ color: '#4caf50', fontSize: 16 }} />
      ) : (
        <WifiOffIcon sx={{ color: '#f44336', fontSize: 16 }} />
      )}
      <Typography variant="caption" sx={{ color: 'white' }}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </Typography>
    </Box>
  );
}

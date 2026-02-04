import { useState } from 'react';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material';
import { useLoginMutation } from '../../app/api/clientApi';
import { useAppDispatch } from '../../app/hooks';
import { setCredentials } from './authSlice';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [login, { isLoading, error }] = useLoginMutation();
  const [loginId, setLoginId] = useState('DISPLAY001');
  const [password, setPassword] = useState('client123');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ loginId, password }).unwrap();
      dispatch(setCredentials({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));
    } catch {
      // Error is handled by RTK Query
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#121212',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', backgroundColor: '#1e1e1e' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center" color="white">
            Run-Ads
          </Typography>
          <Typography
            variant="subtitle1"
            color="grey.400"
            gutterBottom
            textAlign="center"
          >
            Client Display Login
          </Typography>

          {!!error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Invalid login ID or password
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Login ID"
              fullWidth
              margin="normal"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              required
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.600' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                },
                '& .MuiInputLabel-root': { color: 'grey.400' },
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.600' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                },
                '& .MuiInputLabel-root': { color: 'grey.400' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="grey.500"
            display="block"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            Sample: DISPLAY001 / client123
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

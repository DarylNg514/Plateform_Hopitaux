import { Container, Grid, Paper, Button, Typography, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';

export const ScrollableContainer = styled(Container)({
    maxHeight: '80vh',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
        width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#888',
        borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: '#555',
    },
});
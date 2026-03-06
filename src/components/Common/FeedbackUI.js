import { Backdrop, CircularProgress, Snackbar, Alert } from '@mui/material';

export function LoadingBackdrop({ open }) {
  return (
    <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}

export function FeedbackSnackbar({ snackbar, onClose }) {
  if (!snackbar) return null;
  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={onClose}
      autoHideDuration={6000}
    >
      <Alert {...snackbar} onClose={onClose} />
    </Snackbar>
  );
}

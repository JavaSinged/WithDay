import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function ParticipationFeedback({ feedback, onClose }) {
  return (
    <Snackbar
      open={Boolean(feedback)}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      {feedback ? (
        <Alert
          severity={feedback.severity}
          variant="filled"
          onClose={onClose}
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      ) : (
        <span />
      )}
    </Snackbar>
  );
}

export default ParticipationFeedback;

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "../../../shared/ui/Button/Button";

export default function ParticipationModal({
  open,
  title,
  description,
  confirmLabel = "확인",
  cancelLabel = "닫기",
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent sx={{ color: "#475569", lineHeight: 1.6 }}>
        {description}
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button variant="outline" size="sm" disabled={loading} onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="accent" size="sm" disabled={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

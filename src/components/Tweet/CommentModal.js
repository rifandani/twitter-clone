import React, { forwardRef, useState } from 'react';
// material-ui
import TextField from '@material-ui/core/TextField';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CommentModal = ({ isOpen, title, sendAction, closeAction, comment }) => {
  const [commentText, setCommentText] = useState(comment ? comment.text : '');

  function handleSendAction(commentText) {
    sendAction(commentText);
    setCommentText('');
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closeAction}
      maxWidth="md"
      keepMounted
      TransitionComponent={Transition}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="dense"
          label="Tweet your reply"
          type="text"
          variant="outlined"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeAction} color="secondary">
          Cancel
        </Button>
        <Button onClick={() => handleSendAction(commentText)} color="primary">
          Reply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;

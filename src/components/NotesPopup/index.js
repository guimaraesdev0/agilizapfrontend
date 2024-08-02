import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';


const NotesPopup = ({ showNotes, setShowNotes, ticketId }) => {

  const [notes, setNotas] = useState(ticketId)
  
  const handleSave = () => {
    // Save notes logic here if needed
    setShowNotes(false);
  };

  return (
    <Dialog open={showNotes} onClose={() => setShowNotes(false)}>
      <DialogTitle>Anotações para esse ticket</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="notes"
          label="Notes"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={ticketId}
          onChange={(e) => setNotas(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setShowNotes(false)} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotesPopup;

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { UsersFilter } from "../../components/UsersFilter";
import api from '../../services/api';
import { toast } from 'react-toastify';
import { Box } from '@mui/material';

const AddAgentDialog = ({ open, onClose, onAddUser, ticketid }) => {
  const [users, setUsers] = useState([]);

  const handleAddUser = async () => {
    console.log(`Adding users to ticket ${ticketid}:`, users);
    try {
      await api.post('/addUserInTicket', {ticketid, users});
      toast.success("Usuário(s) adicionado com sucesso.");
      setUsers([]); // Limpar usuários após adicionar
    } catch (error) {
      toast.error("Ocorreu um erro ao adicionar o usuário no ticket");
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Adicionar agente ao ticket {ticketid}</DialogTitle>
      <DialogContent>
        <Box sx={{ 
          maxHeight: '300px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <UsersFilter
            padding={{ padding: "10px 0px 0px" }}
            placeholder={"Adicionar um usuário no ticket"}
            fullWidth
            onFiltered={(users) => setUsers(users)}
            initialUsers={users}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: 'gray' }}>
          Cancelar
        </Button>
        <Button onClick={handleAddUser} style={{ backgroundColor: 'green', color: 'white' }}>
          Adicionar usuário
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAgentDialog;

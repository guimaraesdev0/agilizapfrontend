import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";
import toastError from "../../errors/toastError";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Badge,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  list: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: 0,
  },
  adminTag: {
    background: "green",
    color: "#FFF",
    marginLeft: theme.spacing(1),
    padding: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    borderRadius: 3,
    fontSize: "0.8em",
    whiteSpace: "nowrap",
  },
  listItem: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '&:first-child': {
      paddingTop: theme.spacing(0.5),
    },
    '&:last-child': {
      paddingBottom: theme.spacing(0.5),
    },
  },
  listItemAlternate: {
    backgroundColor: theme.palette.action.hover,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    '&:not(:last-child)': {
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '&:first-child': {
      paddingTop: theme.spacing(0.5),
    },
    '&:last-child': {
      paddingBottom: theme.spacing(0.5),
    },
  },
  dialogContent: {
    minWidth: 400,
    padding: theme.spacing(2), // Ajuste de padding
  },
  dialogTitle: {
    paddingBottom: 0, // Remover padding inferior para alinhar com o conteúdo
  },
  loading: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
}));

export default function TicketAgentsDialog({ open, handleClose, ticketId }) {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    let delayDebounceFn = null;
    if (open) {
      setLoading(true);
      delayDebounceFn = setTimeout(() => {
        const fetchUsers = async () => {
          try {
            const usersList = await api.get(`/usersInTicket/${ticketId}`);
            setUserList(usersList.data.users);
            setLoading(false);
            console.log("Lista de usuarios retornado " + JSON.stringify(usersList.data.users));
          } catch (err) {
            setLoading(false);
            toastError(err);
          }
        };
        fetchUsers();
      }, 500);
    }
    return () => {
      if (delayDebounceFn !== null) {
        clearTimeout(delayDebounceFn);
      }
    };
  }, [ticketId, open]);

  return (
    <Dialog maxWidth="md" onClose={handleClose} open={open}>
      <DialogTitle className={classes.dialogTitle}>Lista de agentes nesse ticket</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {loading ? (
          <div className={classes.loading}>
            <CircularProgress />
            <Typography variant="body1" style={{ marginLeft: 8 }}>
              Carregando...
            </Typography>
          </div>
        ) : (
          <List className={classes.list}>
            {userList.map((user, index) => (
              <ListItem
                key={user.id}
                className={index % 2 === 0 ? classes.listItem : classes.listItemAlternate}
              >
                <ListItemText primary={user.name} />
                {user.profile === "admin" && <Badge className={classes.adminTag}>Admin</Badge>}
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Badge from "@material-ui/core/Badge";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Box } from "@material-ui/core";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsListCustom";
import TabPanel from "../TabPanel";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";
import { Button } from "@material-ui/core";
import { TagsFilter } from "../TagsFilter";
import { UsersFilter } from "../UsersFilter";
import api from "../../services/api";
import { DataFilter } from "../DataFilter";
import { StatusFilter } from "../StatusFilter";


const useStyles = makeStyles(theme => ({
  ticketsWrapper: {
    position: "relative",
    display: "flex",
    height: "100%",
    flexDirection: "column",
    overflow: "hidden",
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 0,
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",

  },
  filterItem: {
    flex: 1,
  },
  tabsHeader: {
    flex: "none",
    backgroundColor: theme.palette.tabHeaderBackground,
  },

  tabsInternal: {
    flex: "none",
    backgroundColor: theme.palette.tabHeaderBackground
  },

  settingsIcon: {
    alignSelf: "center",
    marginLeft: "auto",
    padding: 8,
  },

  tab: {
    minWidth: 120,
    width: 120,
  },

  internalTab: {
    minWidth: 120,
    width: 120,
    padding: 5
  },

  ticketOptionsBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: theme.palette.optionsBackground,
    padding: theme.spacing(1),
  },

  ticketSearchLine: {
    padding: theme.spacing(1),
  },

  serachInputWrapper: {
    flex: 1,
    background: theme.palette.total,
    display: "flex",
    borderRadius: 40,
    padding: 4,
    marginRight: theme.spacing(1),
  },

  searchIcon: {
    color: "grey",
    marginLeft: 6,
    marginRight: 6,
    alignSelf: "center",
  },

  searchInput: {
    flex: 1,
    border: "none",
    borderRadius: 30,
  },

  insiderTabPanel: {
    height: '100%',
    marginTop: "-72px",
    paddingTop: "72px"
  },

  insiderDoubleTabPanel: {
    display: "flex",
    flexDirection: "column",
    marginTop: "-72px",
    paddingTop: "72px",
    height: "100%"
  },

  labelContainer: {
    width: "auto",
    padding: 0
  },
  iconLabelWrapper: {
    flexDirection: "row",
    '& > *:first-child': {
      marginBottom: '3px !important',
      marginRight: 16
    }
  },
  insiderTabLabel: {
    [theme.breakpoints.down(1600)]: {
      display: 'none'
    }
  },
  smallFormControl: {
    '& .MuiOutlinedInput-input': {
      padding: "12px 10px",
    },
    '& .MuiInputLabel-outlined': {
      marginTop: "-6px"
    }
  }
}));

const TicketsManagerTabs = () => {
  const classes = useStyles();
  const history = useHistory();

  const [searchParam, setSearchParam] = useState("");
  const [tab, setTab] = useState("open");
  const [tabOpen, setTabOpen] = useState("open");
  const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
  const [showAllTickets, setShowAllTickets] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);
  const searchInputRef = useRef();
  const { user } = useContext(AuthContext);
  const { profile } = user;

  const [openCount, setOpenCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [queueIdTotal, setqueueTotal] = useState([])

  //Pega todos os IDS das filas para que todos possam ver os tickets
  /*   const userQueueIds = user.queues.map((q) => q.id);
   */

  const [selectedQueueIds, setSelectedQueueIds] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedbyData, setselectedbyData] = useState("DESC");
  const [selectedStatus, setselectedStatus] = useState();
  const [refreshKey, setRefreshKey] = useState(0);



  useEffect(() => {
    setRefreshKey(prevKey => prevKey + 1); // Atualize a chave para forçar re-renderização
  }, [selectedStatus, selectedTags, selectedUsers, selectedbyData]);

  useEffect(async () => {



    // Pega todos os Queue (filas) e seta para usuário, assim permitindo que ele veja todos os tickets mesmo não estando na fila
    const { data } = await api.get('/queue/')
    setSelectedQueueIds(data.map((queue) => queue.id))


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (tab === "search") {
      searchInputRef.current.focus();
    }
  }, [tab]);

  let searchTimeout;

  const handleSearch = (e) => {
    const searchedTerm = e.target.value.toLowerCase();

    clearTimeout(searchTimeout);

    if (searchedTerm === "") {
      setSearchParam(searchedTerm);
      setTab("open");
      return;
    }

    searchTimeout = setTimeout(() => {
      setSearchParam(searchedTerm);
    }, 500);
  };

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
  };

  const handleChangeTabOpen = (e, newValue) => {
    setTabOpen(newValue);
  };

  const applyPanelStyle = (status) => {
    if (tabOpen !== status) {
      return { width: 0, height: 0 };
    }
  };

  const handleCloseOrOpenTicket = (ticket) => {
    setNewTicketModalOpen(false);
    if (ticket !== undefined && ticket.uuid !== undefined) {
      history.push(`/tickets/${ticket.uuid}`);
    }
  };

  const handleSelectedTags = (selecteds) => {
    const tags = selecteds.map((t) => t.id);
    setSelectedTags(tags);
  };

  const handleSelectedUsers = (selecteds) => {
    const users = selecteds.map((t) => t.id);
    setSelectedUsers(users);
  };

  const handleSelectTime = (selecteds) => {
    setselectedbyData(selecteds)
  }

  const handleSelectedStatus = (selecteds) => {
    if (selecteds == "unread") {
      setUnreadMessages(true);
      setselectedStatus("open");
    } else {
      setUnreadMessages(false);
      setselectedStatus(selecteds);
    }
  }

  return (
    <Paper elevation={0} variant="outlined" className={classes.ticketsWrapper}>
      <NewTicketModal
        modalOpen={newTicketModalOpen}
        onClose={(ticket) => {

          handleCloseOrOpenTicket(ticket);
        }}
      />
      <Paper elevation={0} square className={classes.tabsHeader}>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          aria-label="icon label tabs example"
        >
          <Tab
            value={"open"}
            icon={<MoveToInboxIcon />}
            label={i18n.t("tickets.tabs.open.title")}
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"closed"}
            icon={<CheckBoxIcon />}
            label={i18n.t("tickets.tabs.closed.title")}
            classes={{ root: classes.tab }}
          />
          <Tab
            value={"search"}
            icon={<SearchIcon />}
            label={i18n.t("tickets.tabs.search.title")}
            classes={{ root: classes.tab }}
          />
        </Tabs>
      </Paper>
      <Paper square elevation={0} className={classes.ticketOptionsBox}>
        {tab === "search" ? (
          <div className={classes.serachInputWrapper}>
            <SearchIcon className={classes.searchIcon} />
            <InputBase
              className={classes.searchInput}
              inputRef={searchInputRef}
              placeholder={i18n.t("tickets.search.placeholder")}
              type="search"
              onChange={handleSearch}
            />
          </div>
        ) : (
          <>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setNewTicketModalOpen(true)}
            >
              {i18n.t("ticketsManager.buttons.newTicket")}
            </Button>
            <Can
              role={user.profile}
              perform="tickets-manager:showall"
              yes={() => (
                <FormControlLabel
                  label={i18n.t("tickets.buttons.showAll")}
                  labelPlacement="start"
                  control={
                    <Switch
                      size="small"
                      checked={showAllTickets}
                      onChange={() =>
                        setShowAllTickets((prevState) => !prevState)
                      }
                      name="showAllTickets"
                      color="primary"
                    />
                  }
                />
              )}
            />
          </>
        )}
        <TicketsQueueSelect
          style={{ marginLeft: 6 }}
          selectedQueueIds={selectedQueueIds}
          userQueues={user?.queues}
          onChange={(values) => setSelectedQueueIds(values)}
        />
      </Paper>
      <TabPanel value={tab} name="open" className={classes.ticketsWrapper}>
        <Tabs
          value={tabOpen}
          onChange={handleChangeTabOpen}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label={
              <Badge
                className={classes.badge}
                badgeContent={openCount}
                color="primary"
              >
                {i18n.t("ticketsList.assignedHeader")}
              </Badge>
            }
            value={"open"}
          />
          <Tab
            label={
              <Badge
                className={classes.badge}
                badgeContent={pendingCount}
                color="secondary"
              >
                {i18n.t("ticketsList.pendingHeader")}
              </Badge>
            }
            value={"pending"}
          />
        </Tabs>
        <Paper className={classes.ticketsWrapper}>
          <TicketsList
            status="open"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setOpenCount(val)}
            style={applyPanelStyle("open")}
          />
          <TicketsList
            status="pending"
            showAll={showAllTickets}
            selectedQueueIds={selectedQueueIds}
            updateCount={(val) => setPendingCount(val)}
            style={applyPanelStyle("pending")}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
        <TicketsList
          status="closed"
          showAll={showAllTickets}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
      <TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
        <TagsFilter onFiltered={handleSelectedTags} />

        {profile === "admin" && (
          <UsersFilter padding={{ padding: "0px 10px 10px" }} onFiltered={handleSelectedUsers} placeholder={"Filtro por usuário"} />
        )}

        <DataFilter onFiltered={handleSelectTime} className={classes.filterItem} />
        <StatusFilter onFiltered={handleSelectedStatus} className={classes.filterItem} />

        <TicketsList
          key={refreshKey}
          searchParam={searchParam}
          unreadMessages={unreadMessages}
          showAll={showAllTickets}
          orderBy={selectedbyData}
          status={selectedStatus}
          tags={selectedTags}
          users={selectedUsers}
          selectedQueueIds={selectedQueueIds}
        />
      </TabPanel>
    </Paper>
  );
};

export default TicketsManagerTabs;

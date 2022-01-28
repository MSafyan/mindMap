import React, { useContext } from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {Button,Drawer,Avatar} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import SubscriptionsIcon from '@material-ui/icons/Subscriptions';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import IconButton from '@material-ui/core/IconButton';

import {gray} from '../consts/test'
import StopDialog from './StopDialog';
import PeopleDialog from './PeopleDialog';
import Agenda from './Agenda';
// import Link from '@material-ui/core/Link';
import {Link} from 'react-router-dom'
import { RecordingContext,AppContext } from '../context';
import { toast } from "react-toastify";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    boxShadow:null,
    background:'white',
    color:'black',
    // zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    background:'#001318',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  Icons:{
    color:'gray',
    minWidth:'0px',
    margin:'auto'
  },
  spaceDiv:{
    width: theme.spacing(7) + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

export default function MiniDrawer({ CompleteTask, selectedElement, startTask,children}) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const {recording,setRecording} = useContext(RecordingContext)
  const {durationElements} = useContext(AppContext)
 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        >
        <Toolbar style={{display:'flex',justifyContent:'space-between'}}>
          <div>
          <Link to='/' style={{ textDecoration: 'none' }}>
            <Typography style={{color:'black',paddingLeft:'80px'}} variant="h6" noWrap>
              Agenda Map
            </Typography>
          </Link>
          </div>
          <div >
            <Button
              variant="contained"
              style = {{background:gray}}
              startIcon={<CheckBoxOutlineBlankIcon style={{color:'black'}}/>}
              onClick={()=>{
                if(recording){
                  CompleteTask()
                }else{
                  toast.warn('plaase start recording first')
                }
              }}>
              Mark Complete
            </Button>
            {
              !recording ? (
                <Button
                variant="contained"
                className={classes.button}
                style = {{background:'#b6ffff'}}
                startIcon={<FiberManualRecordIcon style={{color:"#FF7272"}}/>}
                onClick={()=>{
                  console.log(selectedElement);
                  if(selectedElement === undefined || selectedElement === null){
                    toast.warn('Please select a Node before starting the timer');
                  }else{
                    setRecording(true);
                    startTask();
                  }
                }}
              >
                Start Recording
              </Button>
              ):(
                <StopDialog/>
                )
              }
              {
                durationElements.length>0 && <>
                  <Link onClick={()=>{toast.warn("will clear the progress")}} to='/agenda' style={{ textDecoration: 'none' }}>
                  <IconButton>
                    <FormatListBulletedIcon/>
                  </IconButton>
                </Link>
                <Agenda/>
                </>
              }
            
            <PeopleDialog/>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >

        <Divider />
        <List>
          <ListItem button>
            <ListItemIcon className={classes.Icons}> 
              <Avatar alt="Remy Sharp" src="output.png" />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon className={classes.Icons}> 
              <DashboardOutlinedIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon className={classes.Icons}> 
              <SubscriptionsIcon />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon className={classes.Icons}>
              <Avatar alt="Remy Sharp" src="user-20.jpg" />
            </ListItemIcon>
          </ListItem>
          <ListItem button>
            <ListItemIcon className={classes.Icons}>
              <MoreHorizIcon />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
}

import React from 'react';
import { withRouter, NavLink } from "react-router-dom";
import { FirebaseContext } from "../firebase";

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
}));

function Header() {
  const classes = useStyles();
  const anchor='left';
  const { user, firebase } = React.useContext(FirebaseContext);
  const [state, setState] = React.useState({ left: false });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
          <ListItem button key="Latest" >
            <NavLink to="/" >
              <ListItemText primary="Latest" />
            </NavLink>
          </ListItem>
          <ListItem button key="Most Loved" >
            <NavLink to="/top" >
              <ListItemText primary="Most Loved" />
            </NavLink>
          </ListItem>
          <ListItem button key="Search Links" >
            <NavLink to="/search" >
              <ListItemText primary="Search Links" />
            </NavLink>
          </ListItem>
          {user && (
          <>
            <ListItem button key="Share New Link" >
              <NavLink to="/create" >
                <ListItemText primary="Share New Link" />
              </NavLink>
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton onClick={toggleDrawer(anchor, true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)}>
            {list(anchor)}
          </Drawer>
          <Typography variant="h6" className={classes.title}>
            Knowledge Share
          </Typography>
          {user ? (
          <>
            <Typography variant="p">{user.displayName}</Typography>
            <div className="divider">|</div>
            <Button color="inherit" onClick={() => firebase.logout()}>
              logout
            </Button>
          </>
        ) : (
            <NavLink   to="/login"  >
              <Button sx={{ display: 'inline-block' }}>
              Login
              </Button>
              
            </NavLink>
          
        )}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Header)
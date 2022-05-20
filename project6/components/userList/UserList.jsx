import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  ListItemSecondaryAction,
  Badge

}
  from '@material-ui/core';
import './UserList.css';
import { Link } from 'react-router-dom';

import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import PhotoIcon from '@material-ui/icons/Photo';
import { green, red } from '@material-ui/core/colors';
/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

  }

  renderUser(user) {
    let full_name = user.first_name + " " + user.last_name;
    return (
      <ListItem button key={user._id} component={Link} to={"/users/" + user._id} divider={true} >
        <ListItemText primary={full_name} />
        <ListItemSecondaryAction>
          <IconButton aria-label="photos" component={Link} to={"/photos/" + user._id} >
            <Badge badgeContent={user.photos} ><PhotoIcon style={{ color: green[100] }} /></Badge>
          </IconButton>
          <IconButton aria-label="comments" component={Link} to={"/comments/" + user._id}>
            <Badge badgeContent={user.comments} ><ChatBubbleIcon style={{ color: red[100] }} /></Badge>
          </IconButton>

        </ListItemSecondaryAction>


      </ListItem>
    )
  }


  render() {
    return (
      <div>
        <Typography variant="body1">
          This is the list of our users:
        </Typography>
        <List component="nav">
          {this.props.users.map(user => this.renderUser(user))}
        </List>

      </div>
    );
  }
}

export default UserList;

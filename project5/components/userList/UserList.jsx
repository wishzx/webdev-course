import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
  from '@material-ui/core';
import './userList.css';
import { Link } from 'react-router-dom';

/**
 * Define UserList, a React componment of CS142 project #5
 */


class UserList extends React.Component {
  constructor(props) {
    super(props);
  }

  getUserList() {
    //Set vars
    const formattedUserList = [];
    const users = this.props.users;
    if (users) {
      //Append all formatted user links to list from model data
      for (let i = 0; i < users.length; i++) {
        //get user info
        const user = users[i];
        const userid = user._id;

        //Append user list item and divider
        formattedUserList.push((
          <ListItem
            key={userid}
            button onClick={this.props.onUserChange(userid)}
            component={Link}
            to={'/users/' + userid}
          >
            <ListItemText primary={user.first_name + " " + user.last_name} />
          </ListItem>
        ));
        formattedUserList.push((<Divider key={userid + "divider"} />));
      }
    } else {
      formattedUserList.push((
        <ListItem
          key="Error"
          alignItems="flex-start"
          justify="center"
        >
          <ListItemText primary={"Error: List Not Found"} />
        </ListItem>
      ));
      formattedUserList.push((<Divider key={"ErrorDivider"} />))
    }

    return formattedUserList;
  }

  render() {
    return (
      <div>
        <Typography variant="h5">
          Users
        </Typography>
        <List>
          {this.getUserList()}
        </List>
      </div>
    );
  }
}

export default UserList;
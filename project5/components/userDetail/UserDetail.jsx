import React from 'react';
import {
  Typography, Button, Divider
} from '@material-ui/core';
import './userDetail.css';
import { Link as RouterLink } from "react-router-dom";
import fetchModel from '../../lib/fetchModelData';

const WEBSERVER = "http://localhost:3000";


/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = { userdata: [] };

  }

  componentDidMount() {
    fetchModel("http://localhost:3000/user/" + this.props.match.params.userId).then((response) => {
      this.state.userdata = response.data;
      this.setState(this.state);
    });

  }

  render() {
    let user = this.state.userdata;
    let fullname = user.first_name + ' ' + user.last_name;

    return (
      <div>
        <Typography variant="h5"> {fullname} </Typography>
        <Typography variant="subtitle1">
          {user.location}
        </Typography>
        <Typography variant="body1">
          <b>Occupation:</b> {user.occupation}
        </Typography>
        <Typography variant="body1">
          <b className="userDetail-description">Description: </b>
          <span className="userDetail-description" dangerouslySetInnerHTML={{ __html: user.description }} />
        </Typography>
        <Divider />
        <Button
          component={RouterLink}
          to={'/users/' + user._id + '/photos'}
        >
          Photo Gallery
        </Button>
      </div>
    );
  }
}

export default UserDetail;
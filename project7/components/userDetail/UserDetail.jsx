import React from 'react';
import {
  Typography, Button, Divider, Box
} from '@material-ui/core';
import './UserDetail.css';
import axios from "axios";
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

  }

  fetchUser() {
    axios.get('http://localhost:3000/user/' + this.props.match.params.userId).then(response => this.setState({ userDetail: response.data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchUser();

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchUser();

    }


  }

  renderUserDetail() {
    const { _, first_name, last_name, location, description, occupation } = this.state.userDetail;
    const fullname = first_name + " " + last_name;

    return (
      <div>
        <Typography variant="h5"> {fullname} </Typography>
        <Typography variant="subtitle1">
          {location}
        </Typography>
        <Typography variant="body1">
          <b>Occupation:</b> {occupation}
        </Typography>
        <Typography variant="body1">
          <b>Description:</b> {description}
        </Typography>

        <Box m={2}><Divider /></Box >

        <Button variant="contained" component={Link} to={"/photos/" + this.props.match.params.userId}> View photos</Button>

      </div >

    );
  }

  render() {

    return (
      <div>
        {this.state.userDetail && this.renderUserDetail()}
      </div>
    );
  }
}
UserDetail.contextType = UserContext;
export default UserDetail;

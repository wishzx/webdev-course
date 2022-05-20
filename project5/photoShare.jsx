import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch, Redirect, useRouteMatch
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';

import fetchModel from './lib/fetchModelData';

const WEBSERVER = "http://localhost:3000";

function TopBarWithRightTitle() {
  let text = "";
  let match = useRouteMatch("/users/:userId");
  //let match = useRouteMatch("/photos/:userId");
  //let match = useRouteMatch()
  //console.log(match);
  //text = match && match.params.userId;
  return <TopBar navRightText={text} />;
}


class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserId: null,
      users: []
    };

    //currentUserId handler
    this.onUserChangeBound = userid => this.onUserChange.bind(this, userid);

  }
  onUserChange(userid) {
    this.setState({ currentUserId: userid });
  }

  componentDidMount() {
    fetchModel(WEBSERVER + "/user/list").then(response => {
      const users = response.data;
      this.setState({ users });
    });
  }

  render() {
    console.log("mao");
    return (

      <div>
        <Grid container spacing={8}>
          <Grid item xs={12}>

            <TopBarWithRightTitle></TopBarWithRightTitle>

          </Grid>
          <div className="cs142-main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="cs142-main-grid-item">
              <UserList users={this.state.users} onUserChange={this.onUserChangeBound} />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="cs142-main-grid-item">

              <Switch>
                <Route exact path="/users/:userId" render={props => <UserDetail {...props} />} />
                <Route path="/users"><UserList users={this.state.users} onUserChange={this.onUserChangeBound} /></Route>
                <Route exact path="/photos/:userId" render={props => <UserPhotos {...props} />} />
                <Route path="/:anythingelse"><Redirect to="/" /></Route>

              </Switch>
            </Paper>
          </Grid>
        </Grid>
      </div>

    );
  }
}


ReactDOM.render(
  <HashRouter>
    <PhotoShare />
  </HashRouter>,
  document.getElementById('photoshareapp'),
);

import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import './styles/main.css';

import axios from "axios";

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import UserComments from './components/userComments/UserComments';

const section = {
  height: "100%",
  paddingTop: 5,
  backgroundColor: "#fff"
}

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      useExtraFeatures: false
    };
  }
  componentDidMount() {
    let self = this;
    axios.get('http://localhost:3000/user/list')
      .then(response => self.setState({ users: response.data }))
      .catch(error => console.log(error));


  }

  handleChange() {
    this.setState({ useExtraFeatures: !this.state.useExtraFeatures });
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Switch>
                <Route path="/users/:userId"><TopBar checked={this.state.useExtraFeatures} handler={() => this.handleChange()} message="" users={this.state.users} /></Route>
                <Route path="/photos/:userId"><TopBar checked={this.state.useExtraFeatures} handler={() => this.handleChange()} message="Photos of " users={this.state.users} /></Route>
                <Route path="/comments/:userId"><TopBar checked={this.state.useExtraFeatures} handler={() => this.handleChange()} message="Comments of " users={this.state.users} /></Route>

                <Route ><TopBar checked={this.state.useExtraFeatures} handler={() => this.handleChange()} message="" /></Route>
              </Switch>


            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                {this.state.users && (<UserList users={this.state.users} />)}

              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>
                  <Route path="/users/:userId"
                    render={props => <UserDetail {...props} />}
                  />
                  <Route path="/photos/:userId/:photoNumber"
                    render={props => <UserPhotos {...props} useExtraFeatures={this.state.useExtraFeatures} handler={() => this.handleChange()} />}
                  />
                  <Route path="/photos/:userId"
                    render={props => <UserPhotos {...props} useExtraFeatures={this.state.useExtraFeatures} />}
                  />
                  <Route path="/comments/:userId"
                    render={props => <UserComments {...props} />}
                  />
                  <Route path="/users" component={UserList} />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);

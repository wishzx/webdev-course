import React, { useContext } from 'react';
import ReactDOM from 'react-dom';

import {
  HashRouter, Redirect, Route, Switch
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
import LoginRegister from './components/loginRegister/LoginRegister';

import UserContext from './context/UserContext';
import Cookies from 'universal-cookie';

const section = {
  height: "100%",
  paddingTop: 5,
  backgroundColor: "#fff"
}



class PhotoShare extends React.Component {

  constructor(props) {
    super(props);

    const cookies = new Cookies();
    const user = cookies.get("user_id");


    this.state = {
      user: user ? user : null,
      users: [],
      useExtraFeatures: false,
    };
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    console.log(this.state);

  }

  componentDidMount() {
    if (this.state.user) {
      axios.get('http://localhost:3000/user/list')
        .then(response => this.setState({ users: response.data }))
        .catch(error => {
          this.setState({ user: null });
          console.log(error);
        });
    }
  }

  componentDidUpdate(propsP, stateP, snapshot) {
    if (this.state.user != stateP.user)
      axios.get('http://localhost:3000/user/list')
        .then(response => this.setState({ users: response.data }))
        .catch(error => console.log(error));
  }

  logout() {
    let self = this;
    axios.post("http://localhost:3000/admin/logout").then(res => {
      self.setState({ user: null });
      const cookies = new Cookies();
      cookies.remove("user_id");
    });
  }

  login(e, username, password) {
    e.preventDefault();
    let self = this;
    axios.post("http://localhost:3000/admin/login", {
      username: username,
      password: password
    })
      .then(function (response) {
        const cookies = new Cookies();
        cookies.set("user_id", response.data);
        self.setState({ user: { user_id: response.data } });
      });

  }

  handleChange() {
    this.setState({ useExtraFeatures: !this.state.useExtraFeatures });


  }

  render() {
    const value = {
      user: this.state.user,
      login: this.login,
      logout: this.logout,

    };
    return (
      <UserContext.Provider value={value}>
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
                <Paper className="cs142-main-grid-item" style={{ maxHeight: '100%', overflow: 'auto' }}>
                  {this.state.user && this.state.users && (<UserList users={this.state.users} />)}

                </Paper>
              </Grid>
              <Grid item sm={9}>
                <Paper className="cs142-main-grid-item" style={{ maxHeight: '100%', overflow: 'auto' }} >
                  {
                    this.state.user ? (<Switch><Route path="/users/:userId" render={props => <UserDetail {...props} />} />
                      <Route path="/photos/:userId/:photoNumber" render={props => <UserPhotos {...props} useExtraFeatures={this.state.useExtraFeatures} handler={() => this.handleChange()} />} />
                      <Route path="/photos/:userId" render={props => <UserPhotos {...props} useExtraFeatures={this.state.useExtraFeatures} />} />
                      <Route path="/comments/:userId" render={props => <UserComments {...props} />} />
                      <Route path="/users" component={UserList} /></Switch>) : (<React.Fragment><Redirect to="/" /><Redirect to="/login-register" /></React.Fragment>)
                  }


                  {!this.state.user ? (<Route path="/login-register" render={props => <LoginRegister {...props} />} />) : <Redirect to="/" />}




                </Paper>
              </Grid>
            </Grid>
          </div>
        </HashRouter>
      </UserContext.Provider>

    );
  }
}


ReactDOM.render(
  <PhotoShare />
  ,
  document.getElementById('photoshareapp'),
);

import React from 'react';
import {
  AppBar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, FormGroup, Switch, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import { withRouter } from 'react-router-dom';
import UserContext from '../../context/UserContext';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "Gabriele Giganti",
      open: false
    };

  }
  renderMessage() {
    const user = this.props.users.find(x => x._id == this.props.match.params.userId);

    return user && this.props.message + user.first_name;
  }


  //this function is called when user presses the update button
  handleUploadButtonClicked(e) {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {

      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios.post('/photos/new', domForm)
        .then((res) => {
          this.setState({ open: false });
        })
        .catch(err => console.log(`POST ERR: ${err}`));
    }
  }
  dialog() {
    return (
      <Dialog open={this.state.open} onClose={() => this.setState({ open: false })}>
        <DialogTitle>Submit a new photo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select a photo to upload
        </DialogContentText>
          <input type="file" accept="image/*" ref={(domFileRef) => { this.uploadInput = domFileRef; }} />

        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.setState({ open: false })}>Cancel</Button>
          <Button onClick={(e) => this.handleUploadButtonClicked(e)}>Submit</Button>
        </DialogActions>
      </Dialog>)
  }

  render() {

    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Typography style={{ flex: 1 }} variant="h5">
            {this.state.owner}
          </Typography>
          <FormGroup >
            <FormControlLabel control={<Switch checked={this.props.checked} onChange={this.props.handler} />} label="Enable extra feature" />
          </FormGroup>
          {this.context.user && <Button onClick={(e) => this.context.logout()} color="inherit">Logout</Button>}
          {this.context.user && <Button onClick={(e) => this.setState({ open: true })} color="inherit">Add Photo</Button>}
          {this.context.user && this.dialog()}

          <Typography variant="h5" >
            {this.props.users && this.renderMessage()}
          </Typography>
        </Toolbar>
      </AppBar >
    );
  }
}
TopBar.contextType = UserContext;







export default withRouter(TopBar);




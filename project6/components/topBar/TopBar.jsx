import React from 'react';
import {
  AppBar, FormControlLabel, FormGroup, Switch, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';
import { withRouter } from 'react-router-dom';
/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "Gabriele Giganti",
    };
  }

  renderMessage() {
    const user = this.props.users.find(x => x._id == this.props.match.params.userId);

    return user && this.props.message + user.first_name;
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
          <Typography variant="h5" >
            {this.props.users && this.renderMessage()}
          </Typography>
        </Toolbar>
      </AppBar >
    );
  }
}

export default withRouter(TopBar);

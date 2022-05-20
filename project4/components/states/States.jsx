import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
    let states = window.cs142models.statesModel();
    this.state = {
      states: states,
      filtered_states: states,
      substring: "",
    };
  }

  handleNewSubstring(event) {


    let substring = event.target.value;
    let substring_lower_case = substring.toLowerCase()
    let states = this.state.states;

    let filtered_states = states.filter(string => string.toLowerCase().includes(substring_lower_case));


    //set new state
    this.setState({
      substring: substring,
      filtered_states: filtered_states,
    });
  }



  render() {
    return (
      <div className="container States">

        <input type="text" value={this.state.substring} onChange={e => this.handleNewSubstring(e)} />

        <h4 className="cs142-example-output">Substring used to filter : {this.state.substring}</h4>

        {this.state.filtered_states.length ? <ol className="cs142-states-ol">{this.state.filtered_states.map((d) => <li className="cs142-state-li" key={d}> {d}</li>)}</ol> : <p>No results found</p>}


      </div>
    );
  }
}

export default States;

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';

import States from './components/states/States';
import Example from './components/example/Example';
import Header from './components/header/Header';

class ViewController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bool: false
    };
  }

  switchView() {
    let bool = this.state.bool;
    this.setState({ bool: !bool });
  }

  getText() {
    return this.state.bool ? "States" : "Example";
  }

  render() {
    return (
      <div>
        <Header />
        <button className="container" type="button" onClick={e => { this.switchView() }}>
          Click to visualize {this.getText()}
        </button>
        {this.state.bool ? <Example /> : <States />}
      </div>
    )
  }
}


ReactDOM.render(<ViewController />, document.getElementById('reactapp'),
);

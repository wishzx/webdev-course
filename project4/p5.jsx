import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';
import './p5.css';

import { HashRouter, Route, Link } from "react-router-dom";

import States from './components/states/States';
import Example from './components/example/Example';
import Header from './components/header/Header';

class MenuBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      routes: [
        {
          name: "Home",
          path: "/",
          main: () => <div className="container"> Learning to use HashRouter ! </div>
        },
        {
          name: "Example",
          path: "/Example",
          main: () => <Example />
        },
        {
          name: "States",
          path: "/States",
          main: () => <States />
        }
      ]
    };
  }

  render() {
    return (
      <div>
        <Header />
        <HashRouter>

          <div className="container">
            {<ul className="menu-bar-items">
              {this.state.routes.map((route) => (
                <li> <Link to={route.path}> {route.name} </Link> </li>
              ))}
            </ul>}
          </div>


          {this.state.routes.map((route) => (
            <Route
              path={route.path}
              exact={true}
              children={<route.main />}
            />
          ))
          }
        </HashRouter>
      </div>
    );
  }
}

ReactDOM.render(
  <MenuBar />,
  document.getElementById('reactapp'),
);
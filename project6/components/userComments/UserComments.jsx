import React from 'react';
import axios from 'axios';

import { List } from '@material-ui/core';
import { Link } from 'react-router-dom';



class UserComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    fetchComments() {
        axios.get("http://localhost:3000/comments/" + this.props.match.params.userId).then(
            response => this.setState({ "comments": response.data }))
            .catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchComments();
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.match.params.userId !== this.props.match.params.userId) {
            this.fetchComments();

        }
    }

    render() {
        return (<div>{this.state.comments && JSON.stringify(this.state.comments)}</div>);
    }
}


export default (UserComments);
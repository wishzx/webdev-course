import React from 'react';
import axios from 'axios';

import { Box, Divider, Grid, List, ListItem, ListItemText, Paper } from '@material-ui/core';
import { Link } from 'react-router-dom';
import UserContext from '../../context/UserContext';



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
    renderPhoto(photo) {
        console.log(photo);
        return (
            <React.Fragment>
                <Grid item xs={3}>

                    <Paper style={{ "height": "100%" }}>
                        <Box
                            component="img"
                            sx={{
                                height: 233,
                                width: 350,
                                maxHeight: { xs: 233, md: 167 },
                                maxWidth: { xs: 350, md: 250 },
                            }}
                            alt="The house from the offer."
                            src={"../../images/" + photo.file_name}
                        />
                    </Paper>
                </Grid>


                <Grid item xs={9}>
                    <Paper style={{ "height": "100%" }} ><List>{photo.comments.map((comment) => this.renderComment(comment))}</List></Paper>

                </Grid>
            </React.Fragment >
        )
    }

    renderComment(comment) {
        return (

            <ListItem divider="true" key={comment._id}>
                <ListItemText>{comment.comment}</ListItemText>

            </ListItem>

        )

    }

    render() {
        console.log(this.state);

        return (<Grid container >{this.state.comments && this.state.comments.map((photo) => this.renderPhoto(photo))}</Grid>);
    }
}
UserComments.contextType = UserContext;


export default (UserComments);
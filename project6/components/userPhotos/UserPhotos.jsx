import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from '@material-ui/core';
import './UserPhotos.css';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1
    };

  }

  fetchPhotos() {
    axios.get('http://localhost:3000/photosOfUser/' + this.props.match.params.userId).then(response => this.setState({ userPhotos: response.data }))
      .catch(err => console.log(err))
      .then(() => {
        if (this.props.match.params.photoNumber) {
          this.setState({ page: parseInt(this.props.match.params.photoNumber) });
          this.props.handler();
        }

      }
      );
  }

  componentDidMount() {
    this.fetchPhotos();

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      this.fetchPhotos();

    }
  }

  handleChange(event, value) {
    this.setState({ page: value });
  }

  renderPhoto(photo) {
    const { _id, comments, date_time, file_name, user_id } = photo;
    const date = new Date(date_time);
    const dateString = date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
    return (
      <Grid item key={photo._id} >
        <Card className="cs142-photo-grid-item" style={{ maxWidth: 300 }}>
          <CardHeader
            subheader={dateString}
          />
          <CardMedia
            component="img"
            style={{ heigth: "auto" }}
            image={"../../images/" + file_name}
            alt={file_name}
          />
          <CardContent>
            <List >{comments.map(comment => this.renderComment(comment))}</List>

          </CardContent>
        </Card>


      </Grid >)
  }

  renderComment(comment) {
    return (
      <ListItem key={comment._id} alignItems="flex-start">

        <ListItemText
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="textPrimary"
              >
                {comment.user.first_name}
              </Typography>
              {"—" + comment.comment}
            </React.Fragment>
          }
        />
        <Divider></Divider>
      </ListItem>
    )
  }

  render() {
    const url = this.props.match.params.photoNumber ? this.props.match.url.split("/").slice(0, -1).join("/") : this.props.match.url
    return (
      <React.Fragment>
        <Button component={Link} to={'/users/' + this.props.match.params.userId}>Back</Button>
        { !this.props.useExtraFeatures ?
          (<Grid container spacing={5}>{this.state.userPhotos && this.state.userPhotos.map(photo => this.renderPhoto(photo))}</Grid>) :
          (<React.Fragment>
            {this.state.userPhotos && (< Pagination count={this.state.userPhotos.length} page={this.state.page} onChange={(event, value) => this.handleChange(event, value)} renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`${url}/${item.page}`}
                {...item}
              />
            )} />)}
            {this.state.userPhotos && this.renderPhoto(this.state.userPhotos[this.state.page - 1])}

          </React.Fragment>
          )

        }
      </React.Fragment >
    );
  }
}

export default withRouter(UserPhotos);

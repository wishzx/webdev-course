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
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  TextField
} from '@material-ui/core';
import './UserPhotos.css';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import UserContext from '../../context/UserContext';
import AddCommentIcon from '@material-ui/icons/AddComment';
/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      open_dialog: false,
      comment: "",
      photo_id: "",
      userPhotos: null
    };
    this.onCloseDialog = this.onCloseDialog.bind(this);
    this.openDialogg = this.openDialog.bind(this);
  }

  onCloseDialog(text) {
    console.log(text);
    if (text) {
      axios.post("http://localhost:3000/commentsOfPhoto/" + this.state.photo_id, { comment: text }).then(res => {
        this.fetchPhotos();
        //this.setState((prevState) => ({ userPhotos: prevState.userPhotos.concat(res.data), open_dialog: false }));
        this.setState({ open_dialog: false });

      });
    }
    else { this.setState({ open_dialog: false }); }

  }

  openDialog(id) {
    console.log(id);
    this.setState({ photo_id: id });
    this.setState({ open_dialog: true });

  }

  fetchPhotos() {
    axios.get('http://localhost:3000/photosOfUser/' + this.props.match.params.userId).then(response => this.setState({ userPhotos: response.data }))
      .catch(err => console.log(err))
      .then(() => {
        if (this.props.match.params.photoNumber) {
          this.setState({ page: parseInt(this.props.match.params.photoNumber) });
          //this.props.handler();
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
          <CardActions >
            <IconButton onClick={(e) => this.openDialog(photo._id)}>
              <AddCommentIcon />
            </IconButton>
          </CardActions>
        </Card>
        <CommentDialog onClose={this.onCloseDialog} selectedValue={this.state.comment} open={this.state.open_dialog} />
      </Grid >
    )
  }

  renderComment(comment) {
    return (
      <ListItem key={comment._id} alignItems="flex-start">

        <ListItemText
          secondary={
            <React.Fragment>
              <Typography
                sx={{ display: 'inline', "white-space": "normal" }}
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
    console.log(this.state);
    const url = this.props.match.params.photoNumber ? this.props.match.url.split("/").slice(0, -1).join("/") : this.props.match.url
    return (
      <React.Fragment>
        <Button component={Link} to={'/users/' + this.props.match.params.userId}>Back</Button>
        {!this.props.useExtraFeatures ?
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
UserPhotos.contextType = UserContext;



function CommentDialog(props) {
  const { onClose, selectedValue, open } = props;
  const [text, setText] = React.useState(selectedValue);

  const handleClose = () => {
    onClose();
  };

  const submitComment = () => {
    onClose(text);
  }



  return (
    <Dialog onClose={handleClose} aria-labelledby="comment-dialog-title" open={open}>
      <DialogTitle id="comment-dialog-title">Add comment</DialogTitle>
      <List>
        <ListItem  >
          <TextField multiline value={text} onChange={(e) => setText(e.target.value)} />
        </ListItem>
        <ListItem >
          <Button color="inherit" onClick={() => submitComment()} >Submit</Button>
        </ListItem>


      </List>
    </Dialog>
  );
}





export default withRouter(UserPhotos);

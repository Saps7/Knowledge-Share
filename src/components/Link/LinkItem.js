import React from "react";
import { Link, withRouter } from "react-router-dom";
import { getDomain } from "../../utils";
import distanceInWordsToNow from "date-fns/distance_in_words_to_now";
import FirebaseContext from "../../firebase/context";

import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

function LinkItem({ link, history }) {
  const { firebase, user } = React.useContext(FirebaseContext);
  const classes = useStyles();

  function handleVote() {
    if (!user) {
      history.push("/login");
    } else {
      const voteRef = firebase.db.collection("links").doc(link.id);
      voteRef.get().then((doc) => {
        if (doc.exists) {
          const previousVotes = doc.data().votes;
          const vote = { votedBy: { id: user.uid, name: user.displayName } };
          const updatedVotes = [...previousVotes, vote];
          const voteCount = updatedVotes.length;
          voteRef.update({ votes: updatedVotes, voteCount });
        }
      });
    }
  }

  function handleDeleteLink() {
    const linkRef = firebase.db.collection("links").doc(link.id);
    linkRef
      .delete()
      .then(() => {
        console.log(`Document with ID ${link.id} deleted`);
      })
      .catch((err) => {
        console.error("Error deleting document:", err);
      });
  }

  const postedByAuthUser = user && user.uid === link.postedBy.id;

  return (
    <Grid item xs={12} sm={6}>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography
            className={classes.title}
            color="textSecondary"
            gutterBottom
          >
            Posted {distanceInWordsToNow(link.created)} back
          </Typography>
          <Typography variant="h5" component="h2">
            <a href={link.url} className="black no-underline">
              {link.description}
            </a>
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            ({getDomain(link.url)})
          </Typography>
          <Typography variant="body2" component="p">
            Posted by {link.postedBy.name}
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            {link.voteCount} likes
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton aria-label="add to favorites" onClick={handleVote}>
            <FavoriteIcon />
          </IconButton>
          <Button size="large">
            <Link to={`/link/${link.id}`}>
              {link.comments.length > 0
                ? `${link.comments.length} comments`
                : "discuss"}
            </Link>
          </Button>
          {postedByAuthUser && (
            <IconButton aria-label="delete" onClick={handleDeleteLink}>
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Card>
    </Grid>
  );
}

export default withRouter(LinkItem);

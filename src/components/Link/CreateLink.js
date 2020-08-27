import React from "react";
import useFormValidation from "../Auth/useFormValidation";
import validateCreateLink from "../Auth/validateCreateLink";
import FirebaseContext from "../../firebase/context";

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';

const INITIAL_STATE = {
  description: "",
  url: ""
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  
}));

function CreateLink(props) {
  const { firebase, user } = React.useContext(FirebaseContext);
  const { handleSubmit, handleChange, values, errors } = useFormValidation(
    INITIAL_STATE,
    validateCreateLink,
    handleCreateLink
  );
  const classes = useStyles()

  function handleCreateLink() {
    if (!user) {
      props.history.push("/login");
    } else {
      const { url, description } = values;
      const newLink = {
        url,
        description,
        postedBy: {
          id: user.uid,
          name: user.displayName
        },
        voteCount: 0,
        votes: [],
        comments: [],
        created: Date.now()
      };
      firebase.db.collection("links").add(newLink);
      props.history.push("/");
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <div className={classes.paper}>
      < Avatar className={classes.avatar}>
          <NoteAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Post New Link
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form} >
          <TextField
            onChange={handleChange}
            value={values.description}
            variant="outlined"
            style={{ margin: 8 }}
            required
            fullWidth
            multiline
            name="description"
            label="A description for your link"
            placeholder="Description"
            autoComplete="off"
            type="text"
          />
          {errors.description && <Alert severity="error">{errors.description}</Alert>}
          <TextField
            onChange={handleChange}
            value={values.url}
            variant="outlined"
            style={{ margin: 8 }}
            required
            fullWidth
            multiline
            name="url"
            label="The URL for the link"
            placeholder="URL"
            autoComplete="off"
            type="url"
          />
          {errors.url && <Alert severity="error">{errors.url}</Alert>}
          <Button 
                fullWidth
                variant="contained"
                type="submit"
                color="primary"
                className={classes.submit}>
            Submit
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default CreateLink;

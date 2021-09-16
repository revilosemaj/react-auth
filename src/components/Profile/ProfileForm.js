import { useRef, useContext } from 'react';
import AuthContext from '../../store/Auth-context';
import { useHistory } from 'react-router-dom';
import classes from './ProfileForm.module.css';

const API_KEY = process.env.REACT_APP_API_KEY;

const ProfileForm = () => {
  const history = useHistory();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const idToken = authCtx.token;

  const submitHandler = event => {
    event.preventDefault();

    const enteredPassword = passwordInputRef.current.value;

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          idToken,
          password: enteredPassword,
          returnSecureToken: false
        }),
        headers: {
          'Content-type': 'application/json',
        }
      }).then(res => {
        history.replace('/');
      });
  }
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={passwordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;

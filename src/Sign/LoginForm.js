import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Button from 'react-bootstrap/Button'
import { Link } from "react-router-dom";
import Alert from '@mui/material/Alert';


const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

export default function SignInForm({ onButtonClick, error }) {
  const classes = useStyles();
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [isDisabled, setDiabled] = React.useState(true);
  const handleChange = (event) => {
    setEmail(event.target.value);
  };
  const handleChangePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleButtonClick = () => onButtonClick(Email, Password);
  useEffect(() => {
    if (Email !== "" && Password !== "") {
      setDiabled(false);
    } else {
      setDiabled(true);
    }
  });
  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      style={{alignContent:'center', backgroundColor: 'aliceblue', width: '100%', maxWidth: '400px', display: 'block', margin: '0 auto', marginTop: '100px', borderRadius: '30px'}}
    >
      
            <div className="regular" style={{color:'rgba(106, 196, 255)', fontWeight:'bolder',fontSize:'30px', direction:'rtl', marginTop: "70px"}}>התחברות</div>
            {error!="" ?  <Alert severity="error" style={{textAlign: 'center',direction:'rtl'}}>{error}</Alert> : ''}
      <div>
        <div>
          <TextField
            id="outlined-name"
            label="אימייל"
            value={Email}
            onChange={handleChange}
            variant="outlined"
           
          />
        </div>
        <div>
          <TextField
            id="outlined-name"
            label="סיסמא"
            type="password"
            onChange={handleChangePassword}
            variant="outlined"
          />
        </div>
        <div>
          <div className="regular" style={{fontSize:'15px', width:'180px', marginLeft:'110px', direction:'rtl', fontWeight:'bold'}}>
            משתמש חדש?
            <Link to={"/Register"} className="brand-logo" style= {{textDecoration: 'none', direction:'rtl', fontWeight:'bold', width:'100px'}}>
          לחץ כאן
          </Link>
          </div>
        <Button className="regular"  style={{position:'relative',zIndex:2,display:'inline',borderColor:'white', backgroundColor:'rgba(106, 196, 255)', color:'white', fontSize: '17px', borderRadius:'30px', width:'100px', height:'45px', fontWeight:'bolder' ,marginTop:'10px'}} onClick={handleButtonClick}>התחברות
        <div className="regular" style={{color:'red', fontSize:'10px', marginTop:'20px', width:'115px', marginRight:'30px'}}>
        </div>
        </Button>

        </div>
      </div>
    </form>
  );
}

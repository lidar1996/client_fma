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

export default function SignUpForm({ onButtonClick, error}) {
  const classes = useStyles();
  const [Name, setName] = React.useState("");
  const [Email, setEmail] = React.useState("");
  const [Password, setPassword] = React.useState("");
  const [isNameValid, setNameValid] = React.useState(false);
  const [isEmailValid, setEmailValid] = React.useState(false);
  const [isPasswordValid, setPasswordValid] = React.useState(false);

 
  const handleName = (event) => {
    setName(event.target.value);
  }; 

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  
  const handlePassword = (event) => {
    setPassword(event.target.value);
  }; 

  const handleButtonClick = () => onButtonClick(Name, Email,Password);
  useEffect(() => {
    if (Name !== "") {
      setNameValid(true);
    } else {
      setNameValid(false);
    }

    if (Email !== "") {
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
    
    if (Password !== "") {
      setPasswordValid(true);
    } else {
      setPasswordValid(false);
    }
  });
  return (
    <form
      className={classes.root}
      noValidate
      autoComplete="off"
      style={{alignContent:'center', backgroundColor: 'aliceblue', width: '100%', maxWidth: '400px', display: 'block', margin: '0 auto', marginTop: '100px', borderRadius: '30px'}}
    >
      <div className="regular" style={{color:'rgba(106, 196, 255)', fontWeight:'bolder',fontSize:'30px', direction:'rtl'}}>הירשמו עכשיו!</div>
      {error!="" ?  <Alert severity="error" style={{textAlign: 'center',direction:'rtl'}}>{error}</Alert> : ''}
      <div >
      <div>
          <TextField
            id="outlined-name"
            label="שם"
            value={Name}
            onChange={handleName}
            variant="outlined"
            style={{direction:'rtl'}}
          />
        </div>
        <div>
          <TextField
            id="outlined-name"
            label="אימייל"
            value={Email}
            type = "email"
            onChange={handleEmail}
            variant="outlined"
          />
        </div>
        <div>
          <TextField
            id="outlined-name"
            label="סיסמא"
            value={Password}
            onChange={handlePassword}
            variant="outlined"
            style={{direction:'rtl'}}
          />
        </div>
        <div>
        <div className="regular" style={{fontSize:'15px', width:'180px', marginLeft:'110px', direction:'rtl', fontWeight:'bold'}}>
            משתמש קיים?
            <Link to={"/Welcome"} className="brand-logo" style= {{textDecoration: 'none', direction:'rtl', fontWeight:'bold', width:'100px'}}>
          לחץ כאן
          </Link>
          </div>
        <Button className="regular"  style={{position:'relative',zIndex:2,display:'inline',borderColor:'white', backgroundColor:'rgba(106, 196, 255)', color:'white', fontSize: '17px', borderRadius:'30px', width:'100px', height:'45px', fontWeight:'bolder', marginTop:'10px'}} onClick={handleButtonClick}>הרשמה
        
        </Button>

        </div>
      </div>
    </form>
  );
}

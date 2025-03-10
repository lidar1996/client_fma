import React, { Component } from "react";
import { saveUser } from "../Action/SaveUser";
import { connect } from "react-redux";
import NavigationBar from "../Basic/navigationBar";
import LoginForm from "./LoginForm";
import Bottom from "../Basic/Bottom";
import BackgroundImage from '../img/BackgroungImage.jpg';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      succeded: false,
      submitted: false,
      error: "",
    };
    this.props.saveUser({
      isLoggedIn: false,
      user: {
        email: this.props.user.user.email,
        role: this.props.user.user.role,
        userName: this.props.user.user.userName,
        avatar: this.props.user.user.avatar,
        password: this.props.user.user.password
      },
    });
  }
  
  handleChange(event) {
    this.setState({ email: event.target.email });
  }
  handleChangePassword(event){
    this.setState({password: event.target.password})
  }

  render() {
    const handleButtonClick = async (Email,Password) => {
      this.setState({
        isInProgress: true,
      });
      await fetch(
        "http://localhost:5500/fma/users/login/" + Email
      )
        .then((response) => {
          console.log(response.status)
          if (response.status === 200) {
            this.setState({ succeded: true });
            response.json().then((d) => {
              const user = d;
              this.props.saveUser({
                isLoggedIn: true,
                
                user: {
                  email: Email,
                  role: d.role,
                  userName: d.username,
                  avatar: d.avatar,
                  password: d.password                },
              });
              
            if(this.props.user.user.password === Password){
              if (this.props.user.user.role === "MANAGER") {
                window.location.assign("/search")
              }
              if (this.props.user.user.role === "PLAYER") {
                window.location.assign("/search");
              }
              this.setState({ isLoggedIn: true, error: "" });
            }else{
              this.setState({isLoggedIn: false, error: "please insert the correct password"})
            }

            });
          } else {
            if (Email === "" ) {
              this.setState({
                isLoggedIn: false,
                error: "על מנת להתחבר למערכת עליך להזין נתונים מתאימים",
              });
            } else {
              this.setState({
                isLoggedIn: false,
                error:  "אחד או יותר מהנתונים שהוזנו אינם נכונים",
              });
             
            }
          }
        })
        .catch((error) => {
          console.error("Error:", error.data);
        });
    };

    return (
      <div style={{position: 'fixed',  width: '100%', height: '100%', backgroundImage: `url(${BackgroundImage})`, right: 0, left: 0, top: 0, bottom: 0}}>
        <div style={{position: 'fixed',backgroundImage: `url(${BackgroundImage})`, right: 0, left: 0, top: 0, bottom: 0, overflowY: 'auto'}}>
          <NavigationBar />
          <LoginForm
            onButtonClick={handleButtonClick}
            error={this.state.error}></LoginForm>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
function mapDispatchToProps(dispatch) {
  return {
    saveUser: (user) => dispatch(saveUser(user)),
  };
}

const SignIn = connect(mapStateToProps, mapDispatchToProps)(Login);
export default connect()(SignIn);

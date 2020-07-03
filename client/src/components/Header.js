import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions/users";
import { Button, Alert } from "rsuite";

class Header extends React.Component {
  componentDidMount() {
    // if (!this.props.auth.authenticated) {
    //   this.props.fetchToken();
    // }
  }

  handleClick = () => {
    this.props.logout();
    Alert.success("Logout Successfully.");
  };
  render() {
    console.log("header",this.props.user);
    return (
      <div className="content-header">
        <div>
          <h3>Hi, <span>{this.props.user.name}</span></h3>
          <p>Welcome to Tongli Supermarket - Eastgardens, Staffing Sytsem.</p>
        </div>
        <div>
          <Button
            onClick={this.handleClick}
            appearance="primary"
            className="header_btn"
          >
            Logout
          </Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, user }) => {
  return { auth, user: user.user };
};

export default connect(mapStateToProps, actions)(Header);

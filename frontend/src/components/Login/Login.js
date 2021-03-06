import React, { Component }  from 'react';
import '../../App.css';
import { Redirect } from 'react-router';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import Navbar from '../LandingPage/Navbar';
import logoSmall from '../../images/logoSmall.png';
import { getUserProfile } from '../Services/ControllerUtils';
import { loginQuery } from '../../queries/queries';
import { withApollo } from 'react-apollo';

//Define a Login Component
class Login extends Component {
    constructor(props) {
    super(props);
    this.state = {
        email:null,
        password:null
    };
  }


    onSubmit =async  (event) => {
        event.preventDefault();
        const {data} = await this.props.client.query({
            query: loginQuery,
            variables: { email: this.state.email,
                      password: this.state.password },
          });
          console.log("RESPONSE OBJECT FROM LOGIN:",data);
        this.setState({
            loginClicked: true,
            loginResp :data.login
        })
    }

    render() {
        let redirectVar,message = null;
        if (getUserProfile()) {
            redirectVar = <Redirect to="/home/s/dashboard" />
        }
        if (this.state.loginClicked) {
            if (this.state.loginResp && (this.state.loginResp.id || this.state.loginResp.name)) {
            // var decoded = jwt_decode(this.state.loginResp.token);
            // console.log("decoded msg - login - ", decoded, this.state.loginResp.token);
                localStorage.setItem("userProfile", JSON.stringify(this.state.loginResp));
                redirectVar = <Redirect to="/home/s/dashboard" />
            } else {
                message = "Whoops! We couldn't find an account for that email address and password. Maybe try again.";
            }
        }

        return (
            <React.Fragment>
                {redirectVar}
                <Navbar />
                <Container>
                    <div style={{color: 'indianred',margin:'auto',display:message?'block':'none',width:'55%'}}><Alert variant='danger'>{message}</Alert></div>
                    <Row>
                        <Col>
                            <img src={logoSmall} alt="logo" style={{ height: '65%', width: '50%', margin: '6rem',marginLeft:'16rem' }} />
                        </Col>
                        <Col>
                            <div style={{margin:'6rem', paddingTop:'4rem', paddingRight:'8rem',marginLeft:'2rem'}}>
                                <div className="panel">
                                    <h2 style={{color: '#999' , fontWeight: 'bold'}}>WELCOME TO SPLITWISE</h2>
                                </div><br />
                                <form onSubmit={this.onSubmit} method="post">
                                    <div className="form-group">
                                        <input type="email" className="form-control" onChange={(e) => this.setState({ email: e.target.value })} name="email_id" id="email_id" placeholder="Email Id" pattern="^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$'%&*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$" title="Please enter valid email address" required />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control" onChange={(e) => this.setState({ password: e.target.value })} name="password" placeholder="Password" required />
                                    </div>
                                    <button type="submit" className="btn btn-primary" style={{backgroundColor:'#FF6139',borderColor:'#FF6139'}}>Sign in</button><br /><br />
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        )
    }
}

export default withApollo(Login);
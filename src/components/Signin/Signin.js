import React from 'react';


class Signin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signInEmail: '',
            signInPassword: ''
        }
    }

    OnEmailChange = (event) => {
        this.setState({signInEmail: event.target.value});
    }
    OnPasswordChange = (event) => {
        this.setState({signInPassword: event.target.value});
    }

    onKeyPress = (event) => {
        // checks if enter has been pressed
        if (event.keyCode === 13 || event.which === 13) {
            this.onSubmitSignIn();
        }
    }

    onSubmitSignIn = () => {
        fetch('http://localhost:3000/signin', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(
                {
                    email: this.state.signInEmail,
                    password: this.state.signInPassword
                }
            )
        })
        .then(response => response.json())
        .then(user => {
            if (user.id) {
                this.props.loadUser(user)
                this.props.onRouteChange('home');
            }
        })
    }

    render() {
        const {onRouteChange} = this.props;
        return (
            <article className="br3 ba pv2 dark-gray b--black-10 mv5 w-100 w-50-m w-25-l mw6 shadow-5 center">
    
                <main className="pa4 black-80">
                    <div className="measure">
                        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                            <legend className="f3 fw6 ph0 mh0">Sign In</legend>
                            <div className="mv3 pv2">
                                <label className="db fw6 lh-copy f6 pv1" htmlFor="email-address">Email</label>
                                <input 
                                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="email"
                                    name="email-address"
                                    id="email-address"
                                    onChange = {this.OnEmailChange}
                                    onKeyDown={this.onKeyPress}
                                    />
                            </div>
                            <div className="mv3 pv2">
                                <label className="db fw6 lh-copy f6 pv1" htmlFor="password">Password</label>
                                <input
                                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                                    type="password" 
                                    name="password" 
                                    id="password" 
                                    onChange = {this.OnPasswordChange}
                                    onKeyDown={this.onKeyPress}
                                    />
                            </div>
                        </fieldset>
                        <div className="pv2">
                            <input onClick = {this.onSubmitSignIn} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" type="submit" value="Sign in" />
                        </div>
                        <div className="lh-copy mt3">
                            <p onClick = {() => onRouteChange('register')} className="f6 link dim black db pointer">Register</p>
                        </div>
                    </div>
                </main>
            </article>
        );
    }
}

export default Signin;
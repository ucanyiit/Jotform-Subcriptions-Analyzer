import React, { Component } from 'react';
import { connect } from "react-redux";
import {LoginPage, FormsPage} from './pages';

class HomePage extends Component {
    render() {
        if (this.props.loggedIn) return <FormsPage navigation={this.props.navigation}/>
        else return <LoginPage navigation={this.props.navigation}/>
    }
}

const mapStateToProps = state => {
    const loggedIn = state.user.loggedIn;
    return { loggedIn };
};

export default connect(mapStateToProps)(HomePage);
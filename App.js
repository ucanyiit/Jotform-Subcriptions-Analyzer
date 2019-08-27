import React from 'react';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import FormDetailsPage from './src/FormDetailsPage';
import FormsPage from './src/FormsPage';
import LoginPage from './src/LoginPage';
import RegisterPage from './src/RegisterPage';
import SubmissionDetailsPage from './src/SubmissionDetailsPage';
import SubmissionsPage from './src/SubmissionsPage';

const RootStack = createDrawerNavigator({
    FormDetails: FormDetailsPage,
    Forms: FormsPage,
    Login: LoginPage,
    Register: RegisterPage,
    SubmissionDetails: SubmissionDetailsPage,
    Submissions: SubmissionsPage
    },
    {
        initialRouteName: 'Login'
    }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
    render() {
        return <AppContainer />;
    }
}
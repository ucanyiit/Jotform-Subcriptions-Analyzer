import React from 'react';
import { createAppContainer, createDrawerNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducers from './reducers';
import { FormDetailsPage, FormsPage, LoginPage, RegisterPage, SubmissionDetailsPage, SubmissionsPage } from './components/pages';

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
const store = createStore(reducers)

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        )
    }
}
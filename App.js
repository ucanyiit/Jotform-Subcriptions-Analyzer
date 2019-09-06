import React from 'react';
import { createAppContainer, createDrawerNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { FormDetailsPage, FormsPage, LoginPage, RegisterPage, SubmissionDetailsPage, SubmissionsPage } from './components/pages';
import reducers from './redux/reducers';

export const FormsNav = createStackNavigator(
    {
        Forms: {
            screen: FormsPage
        },
        FormDetails: {
            screen: FormDetailsPage
        }
    },
    {
        headerMode: 'none'
    }
);

export const SubmissionsNav = createStackNavigator(
    {
        Submissons: {
            screen: SubmissionsPage
        },
        SubmissionDetails: {
            screen: SubmissionDetailsPage
        }
    },
    {
        headerMode: 'none'
    }
);

export const Drawer = createDrawerNavigator(
    {
        Forms: {
            screen: FormsNav
        },
        Submissions: {
            screen: SubmissionsNav
        }
    }
);

export const AppStack = createStackNavigator(
    {
        Login: {
            screen: LoginPage
        },
        Register: {
            screen: RegisterPage
        },
        Drawer: {
            screen: Drawer
        }
    },
    {
        headerMode: 'none'
    }
);


const AppContainer = createAppContainer(AppStack);
const store = createStore(reducers, applyMiddleware(thunk));

export default class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <AppContainer />
            </Provider>
        )
    }
}
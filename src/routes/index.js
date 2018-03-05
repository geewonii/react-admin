import React, { Component } from 'react'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import App from '../App'
import Page from '../components/Page'
import Dashboard from '../components/dashboard/Dashboard'
import NotFound from '../components/pages/NotFound'
import UserList from '../components/user/UserList'
import Rent from '../components/user/Rent'
import Driver from '../components/user/Driver'
import Violation from '../components/user/Violation'
import AllMessage from '../components/message/AllMessage'
import CustMessage from '../components/message/CustMessage'
import ListMessage from '../components/message/ListMessage'
import UserMessage from '../components/message/UserMessage'
import Arguments from '../components/system/Arguments'
import Password from '../components/system/Password'
import Login from '../components/pages/Login'
import Register from '../components/pages/Register'

export default class CRouter extends Component {
    render() {
        return (
            <Router history={hashHistory}>
                <Route path={'/'} components={Page}>
                    <IndexRedirect to="/login" />
                    <Route path={'register'} components={Register} />
                    <Route path={'login'} components={Login} />
                    <Route path={'404'} component={NotFound} />
                    
                    <Route path={'app'} component={App}>
                        <Route path={'dashboard/index'} component={Dashboard} />
                        <Route path={'user'}>
                            <Route path={'userList'} component={UserList} />
                            <Route path={'rent'} component={Rent} />
                            <Route path={'driver'} component={Driver} />
                            <Route path={'violation'} component={Violation} />
                        </Route>
                        <Route path={'message'}>
                            <Route path={'allMessage'} component={AllMessage} />
                            <Route path={'custMessage'} component={CustMessage} />
                            <Route path={'listMessage'} component={ListMessage} />
                            <Route path={'userMessage'} component={UserMessage} />
                        </Route>
                        <Route path={'system'}>
                            <Route path={'password'} component={Password} />
                            <Route path={'arguments'} component={Arguments} />
                        </Route>
                    </Route>
                </Route>
            </Router>
        )
    }
}
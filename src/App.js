import './styles'
import React, { Suspense, lazy } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import Loadable from 'components/loadable'
import store from 'store'
import { Provider } from 'mobx-react'
import Home from 'pages/Home'
// import PageLayout from 'layout'
import Base from './routes'
import zhCN from 'antd/es/locale-provider/zh_CN'
const Login = lazy(() => import('./routes/Login/index'))
const LayoutPage = lazy(() => import('./routes/Layout/main'))
class App extends React.Component {
  render () {
    return (
      <React.Fragment>
        <Provider {...store}>
          <LocaleProvider locale={zhCN}>
            <HashRouter>
              <Suspense fallback={Loadable}>
                <Switch>
                  <Route path='/login' component={Login} />
                  <Route path='/' component={({ match }) => (
                    <LayoutPage>
                      <Route exact path={match.url} component={Home} />
                      {Base}
                    </LayoutPage>
                  )} />
                </Switch>
              </Suspense>
            </HashRouter>
          </LocaleProvider>
        </Provider>
      </React.Fragment>
    )
  }
}
export default App

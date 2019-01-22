import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
// import IndexPage from './routes/IndexPage';
import Head from "./components/Head/Head";
import SiderMenu from "./components/Menu/Menu";
import Log from './routes/log/Log';
import LogAdd from './routes/log/LogAdd';
import LogModify from './routes/log/LogModify';
import Comment from './routes/comment/Comment';
import Admin from './routes/user/Admin';
// import SiteStats from './routes/siteStats/SiteStats';
import LogClass from './routes/log/LogClass';

import styles from './index.less';


function RouterConfig({ history }) {
  return (
    <Router history={history}>
        <div className={styles.wrapper}>
            <Head/>
            <div className={styles.main}>
            <SiderMenu/>
            <div className={styles.content}>
                <Switch>
                    {/* <Route path="/admin/sitestats" component={SiteStats} /> */}
                    <Route path="/admin/logclass" component={LogClass} />
                    <Route path="/admin/log" component={Log} />
                    <Route path="/admin/logadd"  component={LogAdd} />
                    <Route path="/admin/logedit"  component={LogModify} />
                    <Route path="/admin/user"  component={Admin} />
                    <Route path="/admin/comment"  component={Comment} />
                    <Redirect to="/admin/user"/> 
                </Switch>
            </div>
            </div>
        </div>
    </Router>
  );
}

export default RouterConfig;

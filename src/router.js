import React,{Component} from 'react';
import {HashRouter,Route,Switch} from "react-router-dom";
//Switch包裹的路由只会渲染一个
import App from './App';
import Login from './pages/login';
//import Login from './pages/supervision/map1';
import Register from './pages/login/register';
import loadable from "./utils/loadable";
const Takeout = loadable(()=>import('./pages/takeOut'));
const Control = loadable(()=>import('./pages/control'));

const Samplingstatistics = loadable(()=>import('./pages/samplingstatistics'));
const Quick1 = loadable(()=>import('./pages/quick1'));
const Routinecheck = loadable(()=>import('./pages/routinecheck'));

const GridSupervision=loadable(()=>import("./pages/grid/gridSupervision/index.js"))

const EnterpriseModular = loadable(()=>import('./pages/QRpage/enterpriseModular.js'));
const EnterpriseInfoNew = loadable(()=>import('./pages/QRpage/enterpriseInfoNew.js'));
const EnterpriseKnowledge = loadable(()=>import('./pages/QRpage/enterpriseKnowledge.js'));
class Router extends Component{
    render() {
        return (
            <HashRouter>
            <Switch>
                <Route path="/login" component={Login}/>
                {/* <Route path='/register' component={Register}/> */}
                <Route path='/takeOut' component={Takeout}/>
                <Route path='/control' component={Control}/>

                <Route path='/samplingstatistics' component={Samplingstatistics}/>
                <Route path='/quick' component={Quick1}/>
                <Route path='/check' component={Routinecheck}/>
                <Route path='/enterpriseModular' component={EnterpriseModular}/>
                <Route path='/enterpriseInfoNew' component={EnterpriseInfoNew}/>
                <Route exact path="/knowledge" component={EnterpriseKnowledge}/>
                <Route path='/gridSupervision' component={GridSupervision}/>
                <Route path='/' component={App}/>
            </Switch>
            </HashRouter>
        );
    }
}

export default Router;
import React,{Component} from 'react';
import './style.less';
import GovHome from './govHome';
import EnterpriseHome from './enterpriseHome';
import PersonHome from './personHome';
import QuickCheckHome from './quickCheckHome';
import SpotCheckHome from './spotCheckHome';
import connect from "react-redux/es/connect/connect";

@connect(
    state=>({
        userType:state.userType,
    })
)
class Home extends Component{
    state={}

    renderContent=()=>{
        switch (this.props.userType) {
            case 0 :
                return <GovHome/>
            case 2 :
                return <GovHome/>
            case 1 :
                return <EnterpriseHome/>
            case 3 :
                return <PersonHome/>
            case 4 :
                return <QuickCheckHome/>
            case 5 :
                return <SpotCheckHome/>
            default:
                return <div/>
        }
    }
    render() {
    return (
            <div>
            {this.renderContent()}
            </div>
        );
    }
}
export default Home;
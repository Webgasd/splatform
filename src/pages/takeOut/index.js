import React,{Component} from 'react';
import './style.less';
import TakeOutHeader from './takeOutHeader'
import StoreNumber from './storeNumber'
import ViolationRate from  './violationRate'
import ScanningDynamics from './scanningDynamics'
import ShopDistribution from './shopDistribution'
import RegulationsNumber from './regulationsNumber'
import QualifiedNumber from './qualifiedNumber'
import Processing from './processing'
import ViolationStatistics from './violationStatistics'
import WholeNumber from './wholeNumber'

class takeOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className='TakeOut' style={{backgroundImage: "url(" + require("./img/background.png") + ")"}}>
                <TakeOutHeader/>
                <div className='takeOutContent'>
                    <table>
                        <tr>
                            <td>
                                <StoreNumber/>
                            </td>
                            <td rowspan='2'><WholeNumber/></td>
                            <td rowspan='2' align="right">
                                <RegulationsNumber/>
                                <QualifiedNumber/>
                                <Processing/>
                            </td>
                        </tr>
                        <tr>
                            <td><ViolationRate/></td>
                        </tr>
                        <tr>
                            <td><ScanningDynamics/></td>
                            <td align="center" valign="middle"><ShopDistribution/></td>
                            <td align="right"><ViolationStatistics/></td>
                        </tr>
                    </table>
                </div>
            </div>
        )
    }
}

export default takeOut
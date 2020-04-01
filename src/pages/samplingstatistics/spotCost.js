import React,{Component} from 'react';
import CommonTableTitle from "./commonTableTitle";
import LeftBar from "./img/leftBar.png";
import RightBar from "./img/rightBar.png";

class SpotCost extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        const list=this.props.money||[];
        return (
            <div className='spotCost'>
                {/* <div style={{color:'#8ECED6',marginLeft:'auto'}}>
                    <img src={LeftBar} alt={''}/>抽检所耗费用<img src={RightBar} alt={''}/>
                </div> */}
                 <CommonTableTitle title={'抽检所耗费用'}/>
            <div className='tdDiv6'>
              
                <table>
                    {list.map((item,index)=>(
                    <tr>
                        <td>
                            <div className='outRound' style={{backgroundColor:'#f8f85b'}}>
                                <div className='inRound'>
                                    买样费(元)
                                    <p style={{color:'#f8f85b'}}>{item.buyMoney}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className='outRound' style={{backgroundColor:'#9AE4B9'}}>
                                <div className='inRound'>
                                    检测费用(元)
                                    <p style={{color:'#9AE4B9'}}>{item.checkMoney}</p>
                                </div>
                            </div>
                        </td>
                        <td>
                            <div className='outRound' style={{backgroundColor:'#F19C7F'}}>
                                <div className='inRound'>
                                    采样费(元)
                                    <p style={{color:'#F19C7F'}}>{item.sampleMoney}</p>
                                </div>
                            </div>
                        </td>
                    </tr>
                 ))}
                </table>
            </div>
            </div>
        )
    }
}

export default SpotCost
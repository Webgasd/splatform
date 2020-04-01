import React, {Component} from 'react';
import ReactEcharts from 'echarts-for-react';
import CommonTableTitle from "./commonTableTitle";
import echarts from "echarts/lib/echarts";

class foodType extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }


    render() {
        const list = this.props.list3 || [];
        return (
            <div>
                <CommonTableTitle title={'食品类别快检检查指标列表'}/>


                {/* <div className='boxHeader' style={{textAlign: 'center',color:'white'}}>食品类别快检检查指标列表</div> */}

                <div className='box' style={{height: 450, overflow: 'auto'}}>
                    <table className='detectionTable'>
                        <tbody>
                        <tr style={{height: '30px'}}>
                            <td style={{backgroundColor: '#2B395F', opacity: 1, color: 'white'}}>食品类别</td>
                            <td style={{backgroundColor: '#2B395F', opacity: 1, color: 'white'}}>快检总批次</td>
                            <td style={{backgroundColor: '#2B395F', opacity: 1, color: 'white'}}>合格/批次</td>
                            <td style={{backgroundColor: '#2B395F', opacity: 1, color: 'white'}}>不合格/批次</td>
                            <td style={{backgroundColor: '#2B395F', opacity: 1, color: 'white'}}>问题发现率</td>
                        </tr>

                        {list.map((item, index) => (
                            index % 3 == 0 ?
                                <tr key={index} style={{backgroundColor: '#3D3449', opacity: 1}}>
                                    <td style={{color: 'white'}}>{item.type}</td>
                                    <td style={{color: 'white'}}>{item.total}</td>
                                    <td style={{color: 'white'}}>{item.yes}</td>
                                    <td style={{color: 'white'}}>{item.no}</td>
                                    <td style={{color: 'white'}}>{item.percent}</td>
                                </tr> :
                                <tr key={index} style={{backgroundColor: '#3D3449', opacity: 1,}}>
                                    <td style={{color: 'white'}}>{item.type}</td>
                                    <td style={{color: 'white'}}>{item.total}</td>
                                    <td style={{color: 'white'}}>{item.yes}</td>
                                    <td style={{color: 'white'}}>{item.no}</td>
                                    <td style={{color: 'white'}}>{item.percent}</td>
                                </tr>
                        ))}
                        </tbody>
                    </table>

                </div>

            </div>
        )
    }
}

export default foodType
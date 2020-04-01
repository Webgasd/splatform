import React,{Component} from 'react';
import { DatePicker } from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import CommonTableTitle from './commonTableTitle'

const {  RangePicker } = DatePicker;

class shopDistribution extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div className='shopDistribution'>
                <CommonTableTitle title={'店铺分布'}/>
                <div className='tdDiv'>
                    <div className='leftTop'></div>
                    <div className='rightTop'></div>
                    <div className='leftBottom'></div>
                    <div className='rightBottom'></div>
                    <div className='shopDistributionHeader'>
                        <div className='left' style={{backgroundImage: "url(" + require("./img/distributionBorder.png") + ")"}}>未知区域企业数量:<strong>42</strong>家</div>
                        <div className='left' style={{backgroundImage: "url(" + require("./img/distributionBorder.png") + ")",marginLeft:'20px'}}>未入库企业数量:<strong>60</strong>家</div>
                        {/* <div className='right' ><RangePicker locale={locale}/></div> */}
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <td>平台名称</td>
                            <td>趵突泉</td>
                            <td>大明湖</td>
                            <td>甸柳</td>
                            <td>东关</td>
                            <td>建新新村</td>
                            <td>解放路</td>
                            <td>龙洞</td>
                            <td>千佛山</td>
                            <td>泉城路</td>
                            <td>文东</td>
                            <td>燕山</td>
                            <td>姚家</td>
                            <td>致远</td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>美团外卖</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                        </tr>
                        <tr>
                            <td>饿了么</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                            <td>60家</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default shopDistribution
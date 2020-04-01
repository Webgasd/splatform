import React,{Component} from 'react';
import './style.less';
import {Row, Col} from 'antd'
import SamplingHeader from './samplingHeader'
import FoodType from './foodType'
import CostTop from './costTop'
import FailedTop from './failedTop'
import SpotCost from './spotCost'
import AgencyCost from './agencyCost'
import PlaceSituation from './placeSituation'
import Combination from './combination'
import BusinessSituation from './businessSituation'
import axios from "../../axios";

class Samplingstatistics extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.ajax({
            url:'/spotCheckStatistics/getListAll',
            data:{
                params:{
                }
            }
        }).then((res)=>{
            if(res.status == 'success'){
                let office  = res.data.list1.map((item,i)=>{
                    item.key = i;
                    return item;})
                let team  = res.data.list2.map((item,i)=>{
                    item.key = i;
                    return item;})
                let teamitem=team.map((item,index)=>{
                    item.key=index;
                    return item.team;
                })
                let teamtotal=team.map((item,index)=>{
                    item.key=index;
                    return item.total;
                })
                let teamyes=team.map((item,index)=>{
                    item.key=index;
                    return item.yes;
                })
                let teamno=team.map((item,index)=>{
                    item.key=index;
                    return item.no;
                })
                let step  = res.data.list3.map((item,i)=>{
                    item.key = i;
                    return item;})
                let stepitem=step.map((item,index)=>{
                    item.key=index;
                    return item.step;
                })
                let steptotal=step.map((item,index)=>{
                    item.key=index;
                    return item.total;
                })
                let stepyes=step.map((item,index)=>{
                    item.key=index;
                    return item.yes;
                })
                let stepno=step.map((item,index)=>{
                    item.key=index;
                    return item.no;
                })
                let food  = res.data.list4.map((item,i)=>{
                    item.key = i;
                    return item;})
                let foodData=food.map((item,index)=>{
                    item.key=index;
                    return {
                        value:item.total,
                        name:item.type
                    };
                })
                let money  = res.data.list5.map((item,i)=>{
                    item.key = i;
                    return item;})
                let cost  = res.data.list8.map((item,i)=>{
                    item.key = i;
                    return item;})
                let costData=cost.map((item,index)=>{
                    item.key=index;
                    return {
                        value:item.total,
                        name:item.name
                    };
                })
                let failed  = res.data.list7.map((item,i)=>{
                    item.key = i;
                    return item;})
                let failedname  = failed.map((item,i)=>{
                    item.key = i;
                    return item.name;})
                let failedData=failed.map((item,index)=>{
                    item.key=index;
                    return {
                        value:item.no,
                        name:item.name
                    };
                })
                let expense  = res.data.list6.map((item,i)=>{
                    item.key = i;
                    return item;})
                let expenseorg  = expense.map((item,i)=>{
                    item.key = i;
                    return item.org;})
                let expensebuy  = expense.map((item,i)=>{
                    item.key = i;
                    return item.buy;})
                let expensesample  = expense.map((item,i)=>{
                    item.key = i;
                    return item.sample;})
                let expensecheck  = expense.map((item,i)=>{
                    item.key = i;
                    return item.checkMoney;})
                let totalteam  = res.data.list9.map((item,i)=>{
                    item.key = i;
                    return item;})
                let totalteamitem  = totalteam.map((item,i)=>{
                    item.key = i;
                    return item.team;})
                let totalstep  = res.data.list10.map((item,i)=>{
                    item.key = i;
                    return item;})
                let totalstepitem  = totalstep.map((item,i)=>{
                    item.key = i;
                    return item.step;})
                this.setState({
                    office:office,
                    teamitem:teamitem,
                    teamtotal:teamtotal,
                    teamyes:teamyes,
                    teamno:teamno,
                    stepitem:stepitem,
                    steptotal:steptotal,
                    stepyes:stepyes,
                    stepno:stepno,
                    foodData:foodData,
                    money:money,
                    costData:costData,
                    failedData:failedData,
                    failedname:failedname,
                    expenseorg:expenseorg,
                    expensebuy:expensebuy,
                    expensecheck:expensecheck,
                    expensesample:expensesample,
                    totalteam:totalteam,
                    totalteamitem:totalteamitem,
                    totalstep:totalstep,
                    totalstepitem:totalstepitem,
                })
                console.log(foodData)
            }
        })
    }
    render() {
        return (
            <div className='samplingstatistics' style={{backgroundImage: "url(" + require("./img/background.png") + ")",height:880}}>
                <SamplingHeader/>
                <div className='samplingContent'>
                  
                <div className='left'>
                        <div className='showBox' style={{ height: '250px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <FoodType foodData={this.state.foodData}/>
                            </div>
                            <div className='showBox' style={{ height: '250px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <CostTop costData={this.state.costData}/>
                        </div>
                        <div className='showBox' style={{ height: '255px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <FailedTop failedData={this.state.failedData} failedname={this.props.failedname}/>
                        </div>
                    </div>
                      
                            <div className='center'>
                            <div className='showBox' style={{ height: '420px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <PlaceSituation totalstepitem={this.state.totalstepitem} teamitem={this.state.teamitem} teamyes={this.state.teamyes} teamno={this.state.teamno} teamtotal={this.state.teamtotal}/>
                            
                                 <Combination office={this.state.office}/>
                            </div>
                            <div className='showBox' style={{ height: '350px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                            <BusinessSituation totalteamitem={this.state.totalteamitem} stepitem={this.state.stepitem} steptotal={this.state.steptotal} stepyes={this.state.stepyes} stepno={this.state.stepno}/>
                            </div>
                            </div>
                  
                            <div className='right'>
                            <div className='showBox' style={{ height: '240px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                                    <SpotCost money={this.state.money}/>
                                </div>
                                <div className='showBox' style={{ height: '530px' }}>
                            <div className='leftTop'></div>
                            <div className='rightTop'></div>
                            <div className='leftBottom'></div>
                            <div className='rightBottom'></div>
                                    <AgencyCost expenseorg={this.state.expenseorg} expensebuy={this.state.expensebuy} expensesample={this.state.expensesample} expensecheck={this.state.expensecheck}/>
                                </div>
                            </div>
                       
                </div>
            </div>
        )
    }
}

export default Samplingstatistics
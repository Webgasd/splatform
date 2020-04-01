import React,{Component} from 'react';
import {Form} from 'antd'
import axios from "../../../../axios";
import Office from './Office'
import Link from './Link'
import FoodType from './FoodType'
import Expense from './Expense'

class government extends Component{
    state={
        msgIndex:0,
    }

    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }
    params = {
        pageNo:1,
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
                let fooditem=food.map((item,index)=>{
                    item.key=index;
                    return item.type;
                })
                let foodtotal=food.map((item,index)=>{
                    item.key=index;
                    return item.total;
                })
                let foodyes=food.map((item,index)=>{
                    item.key=index;
                    return item.yes;
                })
                let foodno=food.map((item,index)=>{
                    item.key=index;
                    return item.no;
                })
                let money  = res.data.list5.map((item,i)=>{
                    item.key = i;
                    return item;})
                let buyMoney=money.map((item,index)=>{
                    item.key=index;
                    return item.buyMoney;
                })
                let sampleMoney=money.map((item,index)=>{
                    item.key=index;
                    return item.sampleMoney;
                })
                let checkMoney=money.map((item,index)=>{
                    item.key=index;
                    return item.checkMoney;
                })
                let expense  = res.data.list6.map((item,i)=>{
                    item.key = i;
                    return item;})
                this.setState({
                    office:office,
                    team:team,
                    teamitem:teamitem,
                    teamtotal:teamtotal,
                    teamyes:teamyes,
                    teamno:teamno,
                    step:step,
                    stepitem:stepitem,
                    steptotal:steptotal,
                    stepyes:stepyes,
                    stepno:stepno,
                    food:food,
                    fooditem:fooditem,
                    foodtotal:foodtotal,
                    foodyes:foodyes,
                    foodno:foodno,
                    money:money,
                    buyMoney:buyMoney,
                    sampleMoney:sampleMoney,
                    checkMoney:checkMoney,
                    expense:expense,
                })
                console.log(fooditem)
            }
        })
    }
    render(){
        return (
            <div>
                <div className='msgIndexBox1'>
                    <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>各所抽检统计数据</div>
                    <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>各环节抽检统计数据</div>
                    <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>食品类别统计数据</div>
                    <div className={this.state.msgIndex === 3?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,3)}>抽检费用统计数据</div>
                </div>
                <div>
                    <div style={{display:this.state.msgIndex === 0?'block':'none'}}><Office office={this.state.office} team={this.state.team} teamitem={this.state.teamitem} teamtotal={this.state.teamtotal} teamyes={this.state.teamyes} teamno={this.state.teamno}/></div>
                    <div style={{display:this.state.msgIndex === 1?'block':'none'}}><Link step={this.state.step} stepitem={this.state.stepitem} steptotal={this.state.steptotal} stepyes={this.state.stepyes} stepno={this.state.stepno}/></div>
                    <div style={{display:this.state.msgIndex === 2?'block':'none'}}><FoodType food={this.state.food} fooditem={this.state.fooditem} foodtotal={this.state.foodtotal} foodyes={this.state.foodyes} foodno={this.state.foodno}/></div>
                    <div style={{display:this.state.msgIndex === 3?'block':'none'}}><Expense expense={this.state.expense} buyMoney={this.state.buyMoney} checkMoney={this.state.checkMoney} sampleMoney={this.state.sampleMoney}/></div>
                </div>
            </div>
        );
    }
}

export default government;




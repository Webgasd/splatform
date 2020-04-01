import React,{Component} from 'react';
import axios from "../../../../axios";
import FoodBusiness from "./FoodBusiness";
import FoodCommon from './FoodCommon';
import FoodCirculate from './FoodCirculate';
import FoodProduce from './FoodProduce';
import './style.less';

class Additive extends Component{
    state={
        msgIndex:0
    }
    componentDidMount(){
        this.requestList();
    }
    changeMsgIndex(index){
        this.setState({
            msgIndex:index
        })
    }
    requestList = ()=>{     
        axios.ajax({
            url:'/quickCheckStatistics/getListAll',
            data:{
            }
        }).then((res)=>{
            if(res.status == "success"){   
                let list  = res.data.list2.map((item,i)=>{
                    item.key = i;
                    return item;
                })           
                let total2  =list.map((item)=>{
                    return item.total;
                })  
                let yes2 = list.map((item)=>{
                    return item.yes;
                })  
                let no2  = list.map((item)=>{
                    return item.no;
                })  
                let team2  = list.map((item)=>{
                    return item.team;
                })   
                let list3  = res.data.list3.map((item,i)=>{
                    item.key = i;
                    return item;
                }) 
                let total3  =list3.map((item)=>{
                    return item.total;
                })  
                let yes3 = list3.map((item)=>{
                    return item.yes;
                })  
                let no3  = list3.map((item)=>{
                    return item.no;
                })  
                let type3  = list3.map((item)=>{
                    return item.type;
                })    
                let list5  = res.data.list5.map((item,i)=>{
                    item.key = i;
                    return item;
                }) 
                let team5  = list5.map((item)=>{
                    return item.team;
                })  
                let buy5 = list5.map((item)=>{
                    return item.buy;
                })      
                let list6  = res.data.list6.map((item,i)=>{
                    item.key = i;
                    return item;
                }) 
                let market6 = list6.map((item)=>{
                    return item.market;
                })  
                let total6 = list6.map((item)=>{
                    return item.total;
                })  
                let yes6 = list6.map((item)=>{
                    return item.yes;
                })  
                let no6 = list6.map((item)=>{
                    return item.no;
                })                     
                this.setState({
                    total2,
                    no2,
                    yes2,
                    team2,
                    total3,
                    no3,
                    yes3,
                    type3,
                    team5,
                    buy5,
                    market6,
                    total6,
                    yes6,
                    no6
                })              
            }
        })
       
    }

    getContent =()=>{

        switch (this.state.msgIndex) {
            case 0:
                return <FoodBusiness 
                team2={this.state.team2}
                yes2={this.state.yes2}
                 no2={this.state.no2}
                 total2={this.state.total2}/>
            case 1:
                return <FoodCommon
                type3={this.state.type3}
                yes3={this.state.yes3}
                 no3={this.state.no3}
                 total3={this.state.total3}
                 />
            case 2:
                return <FoodCirculate
                team5={this.state.team5}
                buy5={this.state.buy5}
                />
            case 3:
                return <FoodProduce
                market6={this.state.market6}
                yes6={this.state.yes6}
                 no6={this.state.no6}
                 total6={this.state.total6}/>
        }
    }
    render() {

        return (

            <div>
            <div className='msgIndexBox'>
                <div className={this.state.msgIndex === 0?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,0)}>各所快检统计数据</div>
                <div className={this.state.msgIndex === 1?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,1)}>食品类别快检统计</div>
                <div className={this.state.msgIndex === 2?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,2)}>快检费用统计数据</div>
                <div className={this.state.msgIndex === 3?'msgIndex showIndex':'msgIndex'} onClick={this.changeMsgIndex.bind(this,3)}>农贸市场快检统计数据</div>
            </div>
            {/* {this.state.msgIndex===0?<MainMsg/>:<RewardMsg/>} */}
            { this.getContent()}
        </div>
  
    );
    }
}
export default  Additive;
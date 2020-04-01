import {Component} from "react";
import {Card, Button, Modal, Collapse, Upload, message, Row, Col, Table} from 'antd';
import axios from "../../../../axios";
import React from "react";
import BaseForm  from '../../../../components/BaseForm';
import Utils from "../../../../utils";
import Sources from './Sources';
const {Panel}=Collapse;
const form = [
    {
        type: 'TIME',
        label: '时间',
        field: '1',
    },
]
class Analysis extends Component{
    constructor(props) {
        super(props);
        this.state = {
            data1: [],
            data4: [],
            data3: []
        }
    }
    componentDidMount(){
       //this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        axios.PostAjax({
            url:'/complaintRecord/getListAll',
            data:{
                params:this.params
            }
        }).then((res)=>{
            if(res.status === "success"){
                let total = res.data.total
              
                // let list  = res.data.list2.map((item,i)=>{
                //     item.key = i;
                //     return item;
                // })
                let data1 = res.data.list1.map((item)=>{
                    return {
                        value: item.number,
                        name: item.type
                    };
                }) 
                let data2 = res.data.list2.map((item)=>{
                    return {
                        value: item.number,
                        name: item.type
                    };
                }) 
                let data3 = res.data.list3.map((item)=>{
                    return {
                        number: item.number,
                        type: item.type
                    };
                }) 
                let data4 = res.data.list4.map((item)=>{
                    return {
                        value: item.number,
                        name: item.type
                    };
                }) 
                  console.log(data4)
                // let team2  = list.map((item)=>{
                //     return item.team;
                // })
                // let list3  = res.data.list3.map((item,i)=>{
                //     item.key = i;
                //     return item;
                // })
                // let total3  =list3.map((item)=>{
                //     return item.total;
                // })
                // let yes3 = list3.map((item)=>{
                //     return item.yes;
                // })
                // let no3  = list3.map((item)=>{
                //     return item.no;
                // })
                // let type3  = list3.map((item)=>{
                //     return item.type;
                // })
                // let list5  = res.data.list5.map((item,i)=>{
                //     item.key = i;
                //     return item;
                // })
                // let team5  = list5.map((item)=>{
                //     return item.team;
                // })
                // let buy5 = list5.map((item)=>{
                //     return item.buy;
                // })
                // let list6  = res.data.list6.map((item,i)=>{
                //     item.key = i;
                //     return item;
                // })
                // let market6 = list6.map((item)=>{
                //     return item.market;
                // })
                // let total6 = list6.map((item)=>{
                //     return item.total;
                // })
                // let yes6 = list6.map((item)=>{
                //     return item.yes;
                // })
                // let no6 = list6.map((item)=>{
                //     return item.no;
                // })
                this.setState({
                    total,
                    data1,
                    data3,
                    data4,
                    data2
                })
            }
        })

    }

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        this.params = filterParams;
        this.requestList();
    };

    render() {
      
        return (

            <div className='indicators' style={{height:"1300px"}}>
                <Collapse accordion={true}>
                    <Panel header="选择查询时间" key="1">
                        <BaseForm formList={form} filterSubmit={this.handleFilterSubmit}/>
                    </Panel>
                </Collapse>
                <Sources
                 total={this.state.total}
                 data1={this.state.data1}
                 data2={this.state.data2}
                 data3={this.state.data3}
                 data4={this.state.data4}
                 />
            </div>
        )
    }

}
export default Analysis;
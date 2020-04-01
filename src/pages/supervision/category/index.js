import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';
import axios from "../../../axios";
import Utils from "../../../utils";



export default class category extends Component{
    state={industryList:[]}
    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/sys/industry/getList',
            data:{
                params:{}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    industryList:res.data
                })
            }
        })
    }

    render() {
        let _this=this;
        const quireList = [
            {
                type: 'INPUT',
                label: '名称',
                field: 'name'
            }, {
                type: 'SELECT',
                label: '所属行业',
                field: 'category',
                placeholder: '全部',
                initialValue: '0',
                width: 150,
                list: this.state.industryList
            }
        ];
        const baseColumns = [
            {
                title: '名称',
                dataIndex: 'name'
            }, {
                title: '编码',
                dataIndex: 'code'
            },  {
                title: '所属行业',
                dataIndex: 'industry',
                render(industry){
                    let data = _this.state.industryList.filter((item)=>item.id===industry).pop()||{};
                    return data.name;
                }
            }
        ];

        const formList = [
            {
                type: 'INPUT',
                label: '名称',
                field: 'name'
            },{
                type: 'INPUT',
                label: '编码',
                field: 'code'
            }, {
                type: 'INPUT',
                label: '顺序',
                field: 'seq'
            }, {
                type: 'SELECT',
                label: '所属行业',
                field: 'industry',
                width: '100%',
                list: this.state.industryList
            }
        ];
        return (
       <CommonPage
           quireList={quireList}
           baseColumns={baseColumns}
           formList={formList}
           baseUrl='/supervision/category'
       />
        );
    }
}


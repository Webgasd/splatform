import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';
import axios from "../../../axios";



export default class licence extends Component{
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
                type: 'SELECT',
                label: '行业类别',
                field: 'industry',
                width: 150,
                list: this.state.industryList
            },{
                type: 'INPUT',
                label: '发证机关名称',
                field: 'name',
            },
            {
                type: 'SELECT',
                label: '是否启用',
                field: 'status',
                width: 150,
                list: [{id: 0, name: '是'}, {id: 1, name: '否'}]
            },
        ];
        const baseColumns = [
            {
                title: '行业类型',
                dataIndex: 'industry',
                render(industry){
                    let data = _this.state.industryList.filter((item)=>item.id===industry).pop()||{};
                    return data.name;
                }
            }, {
                title: '发证编码',
                dataIndex: 'code'
            },  {
                title: '发证机关名称',
                dataIndex: 'name',
            },  {
                title: '是否启用',
                dataIndex: 'status',
            }
        ];
        const formList = [
            {
                type: 'INPUT',
                label: '发证机关名称',
                field: 'name'
            },
            {
                type: 'INPUT',
                label: '发证机关编码',
                field: 'code'
            },  {
                type: 'INPUT',
                label: '顺序',
                field: 'seq'
            },{
                type: 'SELECT',
                label: '行业类型',
                field: 'industry',
                width: '100%',
                list: this.state.industryList
            },{
                type: 'SELECT',
                label: '是否启用',
                field: 'status',
                width: '100%',
                list: [{id: 0, name: '是'}, {id: 1, name: '否'}]
            }
        ];
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/supervision/licence'
            />
        );
    }
}
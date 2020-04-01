import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';
import axios from "../../../axios";


export default class bigclass extends Component{
    state={}
    componentDidMount() {
        this.requestData();
    }
    requestData=()=>{
        axios.noLoadingAjax({
            url:'/supervision/bigClass/getList'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    bigList:res.data,
                })
            }
        })
    }
    render() {
        let _this=this;
        const quireList = [
            {
                type: 'SELECT',
                label: '食品、食品添加剂类别',
                field: 'parentId',
                width: 150,
                list: (this.state.bigList||[]).map((item)=>{return {id: item.id, name:item.name}})
            },{
                type: 'INPUT',
                label: '类别名称',
                field: 'name',
            }
        ];
        const baseColumns = [
            {
                title: '食品、食品添加剂类别',
                dataIndex: 'parentId',
                render(parentId){
                    let data = (_this.state.bigList||[]).find((item)=>item.id==parentId)||{};
                    return data.name;
                }
            }, {
                title: '类别编号',
                dataIndex: 'code'
            },  {
                title: '类别名称',
                dataIndex: 'name',
            }
        ];
        const formList = [
            {
                type: 'SELECT',
                label: '食品、食品添加剂类别',
                field: 'parentId',
                width: '100%',
                list: (this.state.bigList||[]).map((item)=>{return {id: item.id, name:item.name}})
            },{
                type: 'INPUT',
                label: '类别编号',
                field: 'code'
            },
            {
                type: 'INPUT',
                label: '类别名称',
                field: 'name'
            },  {
                type: 'INPUT',
                label: '备注',
                field: 'remark'
            }
        ];
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/supervision/subclass'
            />
        );
    }
}
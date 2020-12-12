import React from 'react';
import {Select, TreeSelect} from 'antd'
const Option = Select.Option;
let list = [];
let acls = {};
let checkChildren = false;
const { TreeNode } = TreeSelect;
export default {
    formatDate(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    },formatDateNoTime(time){
        if(!time)return '';
        let date = new Date(time);
        return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
    },
  // pagination(data,callback){
    pagination(res,callback){
        return {
            onChange:(current)=>{
                callback(current)
            },

            /* current:data.result.page,
             pageSize:data.result.page_size,
             total: data.result.total_count,
             showTotal:()=>{
                 return `共${data.result.total_count}条`
             },*/


            current:res.data.pageNo,
            pageSize:10,
            total: res.data.total,
           showTotal:()=>{
               return `共${res.data.total}条`
            },
            showQuickJumper:true
        }
    },
    // 格式化金额,单位:分(eg:430分=4.30元)
    formatFee(fee, suffix = '') {
        if (!fee) {
            return 0;
        }
        return Number(fee).toFixed(2) + suffix;
    },
    // 格式化公里（eg:3000 = 3公里）
    formatMileage(mileage, text) {
        if (!mileage) {
            return 0;
        }
        if (mileage >= 1000) {
            text = text || " km";
            return Math.floor(mileage / 100) / 10 + text;
        } else {
            text = text || " m";
            return mileage + text;
        }
    },
    // 隐藏手机号中间4位
    formatPhone(phone) {
        phone += '';
        return phone.replace(/(\d{3})\d*(\d{4})/g, '$1***$2')
    },
    // 隐藏身份证号中11位
    formatIdentity(number) {
        number += '';
        return number.replace(/(\d{3})\d*(\d{4})/g, '$1***********$2')
    },
    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>];
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    },
    /**
     * ETable 行点击通用函数
     * @param {*选中行的索引} selectedRowKeys
     * @param {*选中行对象} selectedItem
     */
    updateSelectedItem(selectedRowKeys, selectedRows, selectedIds) {
        // console.log(selectedRowKeys)
        // console.log(selectedRows)
       // console.log(selectedIds)
        if (selectedIds) {
            this.setState({
                selectedRowKeys,
                selectedIds: selectedIds,
                selectedItem: selectedRows
            })
        } else {
            this.setState({
                selectedRowKeys,
                selectedItem: selectedRows
            })
        }
    },updateSelectedItem1(selectedRowKeys1, selectedRows1, selectedIds1) {
        if (selectedIds1) {
            this.setState({
                selectedRowKeys1,
                selectedIds1: selectedIds1,
                selectedItem1: selectedRows1
            })
        } else {
            this.setState({
                selectedRowKeys1,
                selectedItem1: selectedRows1
            })
        }
    }, getDataSource(list){
        let arr= JSON.parse(JSON.stringify(list));
        return this.IterationDelateMenuChildren(arr);
    },
    IterationDelateMenuChildren (arr){
        if (arr.length) {
            for (let i in arr) {
                if (arr[i].childrenList.length) {
                    this.IterationDelateMenuChildren(arr[i].childrenList)
                } else {
                    delete arr[i].childrenList;
                }
            }
        }
        return arr
    },
    getTreeKey(data){
        list=[];
        this.getTreeKeyChildren(data);
        return list;
    },
    getTreeKeyChildren (arr){
        arr.forEach((item) => {
            if (item.childrenList) {
                this.getTreeKeyChildren(item.childrenList)
            } else {
                item.aclList.forEach((item)=>{
                    if(item.checked==true){
                        list.push(item.id.toString())
                    }
                })
            }
        })
    },
    getListKey(data){
        list=[];
        data.forEach((item)=>{
            list.push(item.id.toString())
        })
        return list;
    },getMenuList(data){
        let menuList=[];
        acls = {};
        return {aclTree:this.getTreeMenu(data,menuList),acls:acls};
    },  getTreeMenu (arr,listChildren){
        listChildren=[];
        arr.forEach((item) => {
            if (this.checkMenuEmptyChildren(item.childrenList)) {
                listChildren.push({});
                listChildren.push({title:item.name,key:item.name,childrenList:this.getTreeMenu(item.childrenList,listChildren.pop().childrenList)});
            } else if(item.aclList.filter((item)=>item.type===1).length>0){
                let key = item.aclList.filter((item)=>item.type===1)[0].url;
                listChildren.push({title:item.name,key: key})
                acls[key] = item.aclList.filter((item)=>item.type===2).map((item)=>item.url);
            }
        })
        return listChildren;
    }, checkMenuEmptyChildren (arr){
        checkChildren = false;
        this.handleMenuChildren(arr);
        return checkChildren;
    },handleMenuChildren(arr){
        if (arr.length) {
            for (let i in arr) {
                if (arr[i].childrenList.length) {
                    this.handleMenuChildren(arr[i].childrenList)
                } else if(arr[i].aclList.filter((item)=>item.type===1).length>0){
                    checkChildren = true;
                }
            }
        }
    },  renderTreeNodes (data){
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id} isLeaf/>
                );
            }
        });
    }
}
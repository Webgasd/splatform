import {Component} from "react";
import {Card, Input, Select} from "antd";
import React from "react";
const { TextArea } = Input;
const { Option } = Select;

export default class ResultMsg extends Component{
    render() {
        return (
            <div>
                <h3>检查结果信息</h3>
                <table>
                    <tbody>
                    <tr>
                        <td >检查结果</td>
                        <td>
                        <Select value={0} style={{width:"100%"}}>
                            <Option value={0}>请选择检查结果</Option>
                            <Option value={1}>aaa</Option>
                            <Option value={2}>bbb</Option>
                        </Select>
                        </td>
                        <td>结果处理</td>
                        <td colSpan={5}><Input placeholder={"请输入检查地址"}/></td>
                    </tr>
                    <tr>
                        <td>发现问题</td>
                        <td colSpan={6}><TextArea rows={5} placeholder={"请输入发现问题"}/></td>
                    </tr>
                    <tr>
                        <td>处置措施</td>
                        <td colSpan={6}><TextArea rows={5} placeholder={"请输入处置措施"}/></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

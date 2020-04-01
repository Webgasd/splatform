import React,{Component} from 'react';
import {Card, Button} from "antd";

const ButtonGroup=Button.Group;
export default class LogForm extends Component {
    render() {
        return (
            <div>
                <Card title='流通出货数据导入' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                <div>
                        请选择要导入的Excel文件<Button size="small">选择文件</Button>未选择任何文件
                    <ButtonGroup  style={{marginLeft:160}}>
                        <Button type="primary">导入</Button>
                        <Button type="primary">模板下载</Button>
                    </ButtonGroup>
                    </div>
                </Card>
                <Card title='数据导入结果' style={{marginRight:15,marginLeft:15,marginTop:15}}>
                </Card>
            </div>
        );
    }
}
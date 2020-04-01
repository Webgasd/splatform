import React,{Component} from 'react';
import {Button,Progress,Row,Col} from 'antd';
import PDF from 'react-pdf-js';
import { commonUrl } from './../../../axios/commonSrc';
export default class pdfView extends Component{
    state = {};

    onDocumentComplete = (pages) => {
        let materialInfo = {...this.props.materialInfo};
        let completionRate=(1/pages).toFixed(2);
        if(!materialInfo.completionRate){
            materialInfo.completionRate=0.00;
        }
        if(completionRate>materialInfo.completionRate){
            materialInfo.completionRate=completionRate;
        }
        this.props.dispatchCompletion(materialInfo);
        this.setState({ page: 1, pages });
    }

    handlePrevious = () => {
        if(this.state.page===1){
            return;
        }
        this.setState({ page: this.state.page - 1 });
    }

    handleNext = () => {
        if(this.state.page===this.state.pages){
            return;
        }
        let materialInfo = {...this.props.materialInfo};
        let completionRate = ((this.state.page + 1)/this.state.pages).toFixed(2);
        if(completionRate>materialInfo.completionRate){
            materialInfo.completionRate=completionRate;
        }
        this.props.dispatchCompletion(materialInfo);
        this.setState({ page: this.state.page + 1 });
    }
    render() {
        let {materialInfo} = this.props;
        return (
            <div>
                <div  style={{width:'100%',textAlign:'center'}}>
                    <PDF
                        file= {commonUrl+'/upload/picture/'+JSON.parse(materialInfo.content)[0].response.data}
                        onDocumentComplete={this.onDocumentComplete}
                        page={this.state.page}
                    />
                </div>
                <div style={{width:'100%'}}>
                    <Row>
                        <Col span={4}>
                            <Button onClick={this.handlePrevious}>上一页</Button>
                        </Col>
                        <Col span={16}>
                            <Progress showInfo={false} percent={this.state.page/this.state.pages*100}/>
                        </Col>
                        <Col span={4}>
                            <Button style={{marginLeft:20}} onClick={this.handleNext}>下一页</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}
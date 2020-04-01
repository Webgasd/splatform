import React,{ Component } from 'react';
import CheckTranscriptForm from './checkTranscriptForm';
import OrderRectificationForm from './orderRectificationForm';
import DetailListForm from './detailListForm';
import CompulsoryMeasureForm from './compulsoryMeasureForm';
import AssistSeizureForm from './assistSeizureForm';
import ReceivingServiceForm from './receivingServiceForm';

export default class BookConfig extends Component{
    dispatchBookData=(data)=>{
        this.props.dispatchBookData(data);
    }
    getBook=()=>{
        switch (this.props.bookType) {
            case '/checkTranscript':
                return <CheckTranscriptForm type={this.props.type} bookData={this.props.bookData} dispatchBookData={(data)=>this.dispatchBookData(data)}/>
            case '/orderRectification':
                return <OrderRectificationForm type={this.props.type} bookData={this.props.bookData} dispatchBookData={(data)=>this.dispatchBookData(data)}/>
            case '/detailList':
                return <DetailListForm type={this.props.type} bookData={this.props.bookData} dispatchBookData={(data)=>this.dispatchBookData(data)}/>
            case '/compulsoryMeasure':
                return <CompulsoryMeasureForm type={this.props.type} inspectData={this.props.inspectData} bookData={this.props.bookData} dispatchBookData={(data)=>this.dispatchBookData(data)}/>
            case '/assistSeizure':
                return <AssistSeizureForm type={this.props.type} inspectData={this.props.inspectData} bookData={this.props.bookData} dispatchBookData={(data)=>this.dispatchBookData(data)}/>
            case '/receivingService':
                return <ReceivingServiceForm type={this.props.type} bookData={this.props.bookData} dispatchBookData={(data)=>this.dispatchBookData(data)}/>
            default:
               return <div/>
        }
    }
    render() {
        return (<div style={{maxHeight:600,overflow:'auto'}}>
            {this.getBook()}
        </div>);
    }
}
import React,{Component} from 'react';
export default class DetailForm extends Component{
    render() {
        return (
            <div dangerouslySetInnerHTML={{ __html: this.props.newsData.content}}></div>
        );
    }
}
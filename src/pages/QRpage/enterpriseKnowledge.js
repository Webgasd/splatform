import React, {Component} from 'react'
import axios from '../../axios'
import './enterpriseKnowledge.css'
import Return from "./icon/return_left.png";

export default class enterpriseKnowledge extends Component {
    constructor() {
        super();
        this.state = {
            info: {}
        }
    }

    componentDidMount() {
        this.getInfo(this.props.location.search.substring(4));
    }

    getInfo = (id) => {
        axios.ajax({
            url: "/sys/news/getById",
            data: {
                params: {id: id}
            }
        }).then((item) => {
            if (item.status == "success") {
                this.setState({
                    info: item.data
                });
            }
        })
    };

    render() {
        return (
            <div className="Knowledge">
                <header>
                    <div className="Knowledge-head">
                        <a className="Knowledge-head-back"
                           onClick={() => {
                               window.history.back(-1);
                           }}>
                            <img src={Return} alt=""/>
                        </a>
                        <a>
                            <small>食药知识</small>
                        </a>
                    </div>
                </header>
                <div className="EnterpriseKnowledge"
                     dangerouslySetInnerHTML={{__html: this.state.info.content}}
                />
            </div>
        );
    }
}
import React,{Component} from "react";
import {Card, Form, Input, Row, Col, Checkbox} from "antd";
import moment from 'moment';
import {connect} from "react-redux";
import {changeCleaning} from "../../../../redux/action";

const FormItem=Form.Item;
@connect(
    state=>({
        input:state.cleaning
    }),
    {
        changeCleaning,
    }
)
class DetailForm extends Component{
    state={}
    render() {
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 18}
        };
        const addInfo=this.props.addInfo||{};
        const formData=this.props.input||{};

        return (

            <Card >
                <Form layout="horizontal">
                    <FormItem label="物品名称" {...formItemLayout}>
                        {
                            addInfo.name
                        }
                    </FormItem>
                    <FormItem label="数量" {...formItemLayout}>
                        {
                            addInfo.amount
                        }
                    </FormItem>
                    <FormItem label="消毒日期" {...formItemLayout}>
                        {
                            moment(addInfo.date).format("YYYY-MM-DD")
                        }
                    </FormItem>
                    <FormItem label="消毒方式" {...formItemLayout}>
                        <Checkbox.Group style={{width:'100%'}} value={formData.way?formData.way.split(','):[]} disabled>
                            <Checkbox value="蒸汽消毒(100°,10分钟以上)">蒸汽消毒(100°,10分钟以上)</Checkbox><br/>
                            <Checkbox value="热力消毒" >热力消毒</Checkbox><br/>
                            <Checkbox value="84消毒液">84消毒液</Checkbox><br/>
                            <Checkbox value="醋消毒">醋消毒</Checkbox><br/>
                            <Checkbox value="其他">其他</Checkbox>
                        </Checkbox.Group>
                    </FormItem>
                    <Row>
                        <Col span={5}>
                            <div className="divposition">开始时间 :</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo.start1
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">时</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo.start2
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">分</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={5}>
                            <div className="divposition">结束时间 :</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo.end1
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">时</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo.end2
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">分</div>
                        </Col>
                    </Row>
                    <FormItem label="消毒人员" {...formItemLayout}>
                        {
                            addInfo.person
                        }
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {
                            addInfo.remark
                        }
                    </FormItem>
                </Form>
            </Card>
        )
    }

}
DetailForm = Form.create({})(DetailForm);
export default DetailForm;
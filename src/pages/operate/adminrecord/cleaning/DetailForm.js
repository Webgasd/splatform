import React,{Component} from "react";
import {Card, Form, Input, Row, Col, Select, Checkbox, DatePicker, TimePicker, Icon} from "antd";
import moment from 'moment';
import {connect} from "react-redux";
import {changeInput} from "../../../../redux/action";

const {TextArea}=Input;
const Option=Select.Option;
const FormItem=Form.Item;
@connect(
    state=>({
        input:state.input
    }),
    {
        changeInput,
    }
)
class DetailForm extends Component{
    state={
        timeErrMsg:""
    }
    disabledDate = (current) => {
        // 不能选今天之后的日期
        return current > moment();
    };
    changeInput=(value,option)=>{
        let input = {...this.props.input,[option]:value}
        this.props.changeInput(input);
    }
    onCheckChange=(value)=>{
        this.changeInput(value.join(','),'way')
    }

    getTimeSelect = (top) =>{
        let optionList = []
        for(let i=0;i<top;i++){
            optionList.push(
                <Option value={i}>{i}</Option>
            )
        }
        return optionList
    }

    checkTimeValue = () => {
       let value = this.props.form.getFieldsValue()
       const {start1,start2,end1,end2} = value
       if((start1>end1)||(start1===end1&&start2>=end2)){
           this.setState({
               timeErrMsg:"输入时间有误请检查"
           })
       }else{
           this.setState({
                timeErrMsg:""
           })
       }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 18}
        };
        const type = this.props.type;
        const addInfo=this.props.addInfo||{};
        const formData=this.props.input||{};

        return (

            <Card>
                <div style={{marginLeft:20}}>
                <tr>
                    <td >企业名称:</td>
                    <td><Input value={formData.enterpriseName} style={{marginLeft:20}} disabled={type=='detail'?true:false}/></td>
                </tr>
                <tr>
                    <td >所属地区:</td>
                    <td ><Input value={formData.areaName} style={{marginLeft:20,marginTop:15}} disabled={type=='detail'?true:false}/></td>
                </tr>
                </div>
                <Form layout="horizontal"  style={{marginTop:15}}>
                    <FormItem label="物品名称" {...formItemLayout}>
                        {
                            addInfo && type=='detail'?addInfo.name:
                                getFieldDecorator('name',{
                                    initialValue:addInfo.name,
                                    rules: [{required: true, message: '请输入物品名称'}]
                                })(
                                    <Input type="text"/>
                                )
                        }
                    </FormItem>
                    <FormItem label="数量" {...formItemLayout}>
                        {
                            addInfo && type=='detail'?addInfo.amount:
                                getFieldDecorator('amount',{
                                    initialValue:addInfo.amount,
                                    rules: [{required: true, message: '请填写数字'}]
                                })(
                                    <Input type="text"/>
                                )
                        }
                    </FormItem>
                    <FormItem label="消毒日期" {...formItemLayout}>
                        {
                            addInfo && type=='detail'?moment(addInfo.date).format("YYYY-MM-DD"):
                                getFieldDecorator('date',{
                                    initialValue:addInfo.date===''?moment():moment(addInfo.date),
                                    rules: [{required: true, message: '请选择消毒日期'}]
                                })(
                                    <DatePicker showTime={true}  format="YYYY-MM-DD" disabledDate={this.disabledDate}/>
                                )
                        }
                    </FormItem>
                    <FormItem label="消毒方式" {...formItemLayout}>
                        {
                            addInfo && type == 'detail' ? addInfo.way :
                                getFieldDecorator('way', {
                                    initialValue: addInfo.way,
                                    rules: [{required: true, message: '请选择消毒方式'}]
                                })(
                                    <Checkbox.Group style={{width: '100%'}}
                                                    value={formData.way ? formData.way.split(',') : []}
                                                    onChange={this.onCheckChange}
                                                    disabled={type == 'detail' ? true : false}>
                                        <Checkbox value="蒸汽消毒">蒸汽消毒</Checkbox><br/>
                                        <Checkbox value="热力消毒">热力消毒</Checkbox><br/>
                                        <Checkbox value="84消毒液">84消毒液</Checkbox><br/>
                                        <Checkbox value="醋消毒">醋消毒</Checkbox><br/>
                                        <Checkbox value="其他">其他</Checkbox>
                                    </Checkbox.Group>
                                )
                        }
                    </FormItem>
                    <Row>
                        <Col span={5}>
                            <div className="divposition">开始时间 :</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo && type=='detail'?addInfo.start1:
                                        getFieldDecorator('start1',{
                                            initialValue:addInfo.start1
                                        })(
                                            <Select onSelect={()=>this.checkTimeValue()}>
                                                {this.getTimeSelect(24)}
                                            </Select>
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">时</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo && type=='detail'?addInfo.start2:
                                        getFieldDecorator('start2',{
                                            initialValue:addInfo.start2
                                        })(
                                            <Select onSelect={()=>this.checkTimeValue()}>
                                               {this.getTimeSelect(60)}
                                           </Select>
                                        )
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
                                    addInfo && type=='detail'?addInfo.end1:
                                        getFieldDecorator('end1',{
                                            initialValue:addInfo.end1
                                        })(
                                            <Select onSelect={()=>this.checkTimeValue()}>
                                                {this.getTimeSelect(24)}
                                            </Select>
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">时</div>
                        </Col>
                        <Col span={4}>
                            <FormItem>
                                {
                                    addInfo && type=='detail'?addInfo.end2:
                                        getFieldDecorator('end2',{
                                            initialValue:addInfo.end2
                                        })(
                                            <Select onSelect={()=>this.checkTimeValue()}>
                                                {this.getTimeSelect(60)}
                                            </Select>
                                        )
                                }
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <div className="divposition1">分</div>
                        </Col>
                    </Row>
                    <sapn style={{color:"red",marginLeft:80}}>{this.state.timeErrMsg}</sapn>
                    <FormItem label="消毒人员" {...formItemLayout}>
                        {
                            addInfo && type=='detail'?addInfo.person:
                                getFieldDecorator('person',{
                                    initialValue:addInfo.person
                                })(
                                    <Input type="text"/>
                                )
                        }
                    </FormItem>
                    <FormItem label="备注" {...formItemLayout}>
                        {
                            addInfo && type=='detail'?addInfo.remark:
                                getFieldDecorator('remark',{
                                    initialValue:addInfo.remark
                                })(
                                    <TextArea rows={4} />
                                )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('id',{
                                initialValue:addInfo.id
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('unit',{
                                initialValue:addInfo.unit
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </FormItem>
                    <FormItem>
                        {
                            getFieldDecorator('area',{
                                initialValue:addInfo.area
                            })(
                                <Input type="hidden"/>
                            )
                        }
                    </FormItem>
                </Form>
            </Card>
        )
    }

}
DetailForm = Form.create({})(DetailForm);
export default DetailForm;
import React from 'react'
import {Row,Col,Modal} from 'antd'
import GridTable from './AMapShowTable'
import AddGridForm from './AMapShowTable'
class pointsAdd extends React.Component{
    state={
        visible: false
    };
    componentDidMount() {
    }
    addGrid=()=>{
        this.setState({
            visible: true,
        });
    }
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };
    render() {
        const modal=(<Modal
            title="添加站点"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            footer={false}
        >
            <AddGridForm/>
        </Modal>)
        return(
            <Row>
                <Col span={24}>
                    <GridTable/>
                    {modal}
                </Col>
                {/*<Col span={10} >*/}
                {/*<Row type="flex" justify="end">*/}
                {/*<Button onClick={this.addGrid}>添加</Button>*/}
                {/*<Button>删除</Button>*/}
                {/*<Button>刷新</Button>*/}
                {/*</Row>*/}
                {/*</Col>*/}
            </Row>
        )}
}
export default pointsAdd
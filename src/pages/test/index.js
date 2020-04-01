import React,{Component} from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import Utils from "../../utils";
import axios from "../../axios";
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  };

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  };
 
  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error && error[e.currentTarget.id]) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  };

  renderCell = form => {
    this.form = form;
    const { children, dataIndex, record, title } = this.props;
    const { editing } = this.state;
    return editing ? (
      <Form.Item style={{ margin: 0 }}>
        {form.getFieldDecorator(dataIndex, {
          rules: [
            {
              required: true,
              message: `${title} is required.`,
            },
          ],
          initialValue: record[dataIndex],
        })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={this.toggleEdit}
      >
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}

export default class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'unitname',
        dataIndex: 'unitname',
        width: '30%',
        editable: true,
      },
      {
        title: 'area',
        dataIndex: 'area',
      },
      {
        title: 'brand',
        dataIndex: 'brand',
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        render: (text, record) =>
          (
            <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
              <a href="javascript:;">Delete</a>
            </Popconfirm>
          ) 
      },
    ];

    this.state = {
     list:'',
    };
  }
  componentDidMount(){
    this.requestList();
}
requestList = ()=>{
    let _this = this;
    axios.ajax({
        url:'material.json',
        data:{
            params:{}
        }
    }).then((res)=>{
        if(res.status == "success"){
            let list  = res.result.item_list.map((item,i)=>{
           // let list  = res.data.data.map((item,i)=>{
                item.key = i;
                return item;
            })
            this.setState({
                list:list,
                pagination:Utils.pagination(res,(current)=>{
                    _this.params.page = current;//	当前页数
                    _this.requestList(); //刷新列表数据
                })
            })
        }
    })
}

  handleDelete = key => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  };


  handleSave = row => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  };

  render() {
    const { dataSource } = this.state.list;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
    
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={this.state.list}
          columns={columns}
        />
      </div>
    );
  }
}
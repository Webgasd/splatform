import React, { Component } from 'react'
import { Upload, Modal, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {commonUrl} from "../../../axios/commonSrc";
import axios from "../../../axios";
import './style.less'
const confirm = Modal.confirm

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class ScrollChart extends Component {
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
      };
    
      handleCancel = () => this.setState({ previewVisible: false });
    
      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
          previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
      };
     componentDidMount(){
       this.requestPicture()
     }
      handleChange = ({ fileList }) => this.setState({ fileList });
      //获取图片
      requestPicture = () =>{
        let type = 2
        axios.ajax({
          url:'/supervision/enterprise/getRollPicture',
          data:{
              params:{type}
          }
       }).then((res)=>{
          if(res.status == "success"){
            let appendix = JSON.parse(JSON.stringify([]))
            if(res.data!=null){
              //转换返回的文件字段格式  转了需要使用
              appendix = JSON.parse(res.data.rollPicture||JSON.stringify([]))
              appendix.map((item)=>{
                  let url = commonUrl+'/upload/report/'+item.response.data
                  item.url = url
              })
              this.setState({
                fileList:appendix,
                id:res.data.id
              })
            }else{
              this.setState({
                fileList:appendix,
                id:0
              })
            }
          }
       })
      }
      handleUpload = ()=>{
        const {fileList} = this.state
        fileList.map((item)=>{
           if(item.thumbUrl){
             delete item.thumbUrl
           }
        })
        console.log('fileList',fileList)
        axios.PostAjax({
          url:'/supervision/enterprise/updateRollPicture',
          data:{
              params:{id:this.state.id||0,type:2,rollPicture:JSON.stringify(fileList)} // 将文件数组转化为字符串
          }
       }).then((res)=>{
          if(res.status == "success"){
            confirm({
              title:'上次成功',
              okText:'确定',
              okType:'primary',
              onOk:()=>{
                  this.requestPicture()
              }
          })
          }
       })
      }

      render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 10 }}>点击上传图片</div>
          </div>
        );
        return (
          <>
            <Card style={{marginTop:10,width:1400}} title="网格员小程序图片-上传" extra={<Button onClick={this.handleUpload}>上传</Button>}>
              <div style={{marginTop:10}}>
              说明：图片比例为3/5；即高度为300px，宽度为500px
              </div>
              <div style={{marginTop:30}}>
              <Upload
                action={commonUrl+'/upload/uploadReport'}
                listType="picture-card"
                fileList={fileList}
                onPreview={this.handlePreview}
                onChange={this.handleChange}
                className="avatar-uploader"
                >
                {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={this.handleCancel}
                >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
              </div>  
            </Card>
          </>
        );
      }
}

export default  ScrollChart;
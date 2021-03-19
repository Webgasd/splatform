import React, { Component } from 'react'
import { Upload, Modal, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './style.less'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PictureCarousel extends Component {
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
    
      handleChange = ({ fileList }) => this.setState({ fileList });
    
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
            <Card style={{marginTop:10,width:1400}} title="app端通知文件图片-上传">
              <div style={{marginTop:10}}>
              说明：图片比例为3/5；即高度为300px，宽度为500px
              </div>
              <div style={{marginTop:30}}>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
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

export default  PictureCarousel
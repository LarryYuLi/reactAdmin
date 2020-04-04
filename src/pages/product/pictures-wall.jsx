import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import { reqDeleteImg } from '../../api'
import {BASE_IMG_URL} from '../../utils/constants'
/*
Upload picture component
*/

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [],
  };

  constructor(props) {
    super(props)

    // update current images
    let fileList = []
    const {imgs} = this.props

    if (imgs && imgs.length > 0) {
      fileList = imgs.map((img, index) => ({
        uid: -index, 
        name: img,
        status: 'done',
        url: BASE_IMG_URL + img
      }))
    }

    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList,
    }
  }

  // get an array of all unloaded images
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /*
  file: current image file to upload/delete
  fileList: list of uploaded image files
  */
  handleChange = async ({ file, fileList }) => {
    console.log('handle onchange', fileList, file)

    // modify information in file: name, url
    if (file.status === 'done') {
      const result = file.response
      if (result.status === 0) {
        message.success('Document uploaded successfully')
        const { name, url } = result.data
        file = fileList[fileList.length - 1]
        file.name = name
        file.url = url
      } else {
        message.error('Upload error')
      }
    } else if (file.status === 'removed') {
      const result = await reqDeleteImg(file.name)
      if (result.status === 0) {
        message.success('Document deleted successfully')
      } else {
        message.error('Delete error')
      }
    }

    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div>Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          name='image' // attribute name
          action="/manage/img/upload" // api url
          accept='image/*' // accept file attribute
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}       
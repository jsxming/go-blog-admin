import 'braft-editor/dist/index.css';
import React from 'react';
import BraftEditor from 'braft-editor';
import {Input,Form, Button} from 'antd';
import API from '@/api/index';
import {isValidValue} from '@/util/validator';
import { withRouter } from 'react-router-dom';
import {showInfo} from '@/util/index';

class ProtocolEdit extends React.Component {


  state = {
      editorState: BraftEditor.createEditorState(), // 设置编辑器初始内容
      outputHTML: '<p></p>',
      protocol:{},
      formRef:React.createRef(),
      isEdit:false,
  }

  componentDidMount () {
      const p = new URLSearchParams(this.props.location.search);
      const id = p.get('id');
      const isEdit = isValidValue(id);
      this.setState({isEdit});
      if(isEdit){
          API.queryProtocol({id}).then((protocol) => {
              this.setState({
                  protocol,
                  editorState: BraftEditor.createEditorState(protocol.body)
              });
              this.state.formRef.current.setFieldsValue(protocol);
          }).catch(() => {

          });
      }
      //   this.isLivinig = true;
      // 3秒后更改编辑器内容
      //   setTimeout(this.setEditorContentAsync, 3000);
  }

  //   componentWillUnmount () {
  //       this.isLivinig = false;
  //   }

  handleChange = (editorState) => {
      const body = editorState.toText();
      this.setState({
          editorState: editorState,
          protocol:{...this.state.protocol,body}
      });
      if(this.state.formRef.current){
          this.state.formRef.current.setFieldsValue({body});
      }
  }

  submit = (v)=>{
      const body = this.state.editorState.toHTML();
      const params = {
          ...v,
          body,
          id:this.state.protocol.id
      };
      if(this.state.isEdit){
          API.updateProtocol(params).then(() => {
              showInfo('提交成功');
          }).catch(() => {

          });
      }else{
          API.createProtocol(params).then(() => {
              showInfo('提交成功');
          }).catch(() => {

          });
      }
  }


  render () {

      const { editorState } = this.state;

      return (
          <div>
              <Form colon={false}
                  labelCol={{span:2}}
                  onFinish={this.submit}
                  ref={this.state.formRef}>
                  <Form.Item label="协议名称"
                      name="name"
                      rules={[{ required: true, message: '请输入协议名称' }]}
                      wrapperCol={{span:5}}>
                      <Input />
                  </Form.Item>
                  <Form.Item label="协议内容"
                      name="body"
                      rules={[{
                          required: true,
                          validator: (_, value) => {
                              if (!value.length) {
                                  return Promise.reject('请输入正文内容');
                              } else {
                                  return Promise.resolve();
                              }
                          }
                      }]}
                      wrapperCol={{span:16}}>
                      <div >
                          <BraftEditor
                              onChange={this.handleChange}
                              style={{backgroundColor:'#343954'}}
                              value={editorState}
                          />
                      </div>
                  </Form.Item>
                  <Form.Item wrapperCol={{offset:9}}>
                      <Button htmlType="submit"
                          style={{width:'180px'}}
                          type="primary">提交</Button>
                  </Form.Item>
              </Form>
          </div>
      );

  }

}

export default withRouter(ProtocolEdit);
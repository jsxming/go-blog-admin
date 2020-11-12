import React, { useEffect, useState, useRef } from 'react';
import API from '@/api/index';
import { useParams, useHistory } from 'react-router-dom';
import {Form, Input,Button,Select,Row,Col,Checkbox, InputNumber} from 'antd';
import { useForm } from 'antd/lib/form/Form';
import {CloudUploadOutlined,EditOutlined} from '@ant-design/icons';
import 'braft-editor/dist/index.css';
import {mustRequire} from '@/util/rule';
import {showInfo} from '@/util/index';
import {isArray} from '@/util/validator';
import {fileChange,isImg,getFileSuffix} from '@/util/file';
import Modal from 'antd/lib/modal/Modal';


const {Option} = Select;

const titleStyle = {
    fontSize:'16px',
    padding:'24px 0'
};

const UPLOAD_TYPE = {
    homepage:'homepage',
    pages:'pages'
};

const a= {
    name:'',//名称
    subjects:[
        {
            subjectName:'',
            originalPrice:'',
            groupPrice:'',
            gift:'',
            status:'',
            id:''
        }
    ],
    groupCount:'',//购买基数
    countdown:'',//倒计时
    invalidYear:'',//有效期
    homePage:'',//海报图
    pages:[{addr:'',name:''}],//详情图
    qa:[{question:'',answer:'',answerCount:''}],//问答
};


//题目编辑
export default function QuestionEdit(){
    const history = useHistory();
    const p = useParams();
    const isEdit = p.id !=='0';
    const [form] = useForm();
    const [qaForm] = useForm();

    const [visible,setVisible] = useState(false);
    const [qaIndex,setQaIndex] = useState(-1);
    const [curriculum,setCurriculum] = useState([]);
    const [goodsPages,setGoodsPages] = useState([{addr:'',name:''}]);
    const [pagesIndex,setPagesIndex] = useState(-1);
    const [uploadType,setUploadType] = useState('');
    const [goods,setGoods] = useState({});
    const fileRef = useRef();
    // console.log(homePageRef);
    const [subject,setSubject] = useState([]);

    //查询课程下的科目列表
    const queryGoodsSubject = (id)=>{
        if(isArray(curriculum)){
            const item = curriculum.find(item=>item.id===id);
            console.log(item,'item');
            form.setFieldsValue({curriculumName:item.name});
        }
        API.queryGoodsSubject({curriculum:id}).then(res => {
            setSubject(res.map(item=>{
                return {...item,status:0};
            }));
            if(!isEdit){
                form.setFieldsValue({
                    subjects:res.map(()=>{
                        return {status:0};
                    })
                });
            }
        }).catch(() => {

        });
    };

    useEffect(()=>{
        //查询课程
        API.queryGoodsCurriculum().then((res) => {
            setCurriculum(res);
            if(!isEdit && isArray(res)){
                const curriculum = res[0].id;
                form.setFieldsValue({curriculum,curriculumName:res[0].name});
                queryGoodsSubject(curriculum);
            }
        }).catch(() => {

        });
        if(isEdit){
            API.queryGood(p).then((res) => {
                setGoods(res);
                form.setFieldsValue({
                    ...res,
                    subjectId:(res.subjects||[]).map(item=>item.subject),
                });
                if(isArray(res.pages)){
                    setGoodsPages([...res.pages,{addr:'',name:''}]);
                }
                queryGoodsSubject(res.curriculum);
            }).catch(() => {

            });
        }
    },[]);

    // console.log(form.getFieldValue('subjectId'),'subjectId');

    //海报图 详情图的上传
    const inputFileChange = (e)=>{
        const file = fileChange(e);
        if(!file) return;
        const filename = file.name;
        if(!isImg(getFileSuffix(filename))){
            showInfo('请选择图片上传');
            return;
        }
        API.uploadFile({file}).then((res) => {
            fileRef.current.value ='';
            if(uploadType===UPLOAD_TYPE.homepage){
                form.setFieldsValue({homePage:res.link});
            }
            if(uploadType===UPLOAD_TYPE.pages){
                const arr  = goodsPages;
                const oldAddr = arr[pagesIndex].addr;
                arr[pagesIndex].addr = res.link;
                arr[pagesIndex].name = filename;
                const result =[...arr];
                if(!oldAddr.length){
                    result.push({addr:'',name:''});
                }
                setGoodsPages(result);
                form.setFieldsValue({pages:result});
            }
        }).catch(() => {

        });
        // this.formRef.current.setFieldsValue({filename:file.name,file:file});
    };

    const submit = (v)=>{
        // console.log((v.pages||[]).filter(item=>item.name));
        const params = {
            ...v,
            subjects:(v.subjectId||[]).map((id,index)=>{
                let editItem = {};
                if(isEdit && isArray(goods.subjects)){
                    editItem = goods.subjects[index] || {};
                }
                return {
                    ...editItem,
                    ...v.subjects[index],
                    subject:id,
                    subjectName:subject[index].name
                };
            }),
            id:goods.id,
            pages:(v.pages||[]).filter(item=>item.name),
            qa:(v.qa||[]).map((item,index)=>{
                let editItem = {};
                if(isEdit && isArray(goods.qa)){
                    editItem = goods.qa[index] || {};
                }
                return {
                    ...editItem,
                    ...item
                };
            })
        };
        API.saveGoods(params).then(() => {
            // console.log(res);
            if(!isEdit){
                showInfo('创建成功');
                history.goBack();
            }else{
                showInfo('提交成功');
            }
        }).catch(() => {

        });
    };

    //添加一个问题
    const addQa = v=>{
        const qa =form.getFieldValue('qa') || [];
        const result = [...qa];
        if(qaIndex>-1){
            result[qaIndex] = v;
        }else{
            result.push({...result[qaIndex],...v});
        }
        setGoods({...goods,qa:result});
        form.setFieldsValue({qa:result});
        qaForm.resetFields();
        setVisible(false);
    };

    //打开编辑问题的弹出
    const openEditQa = (item,index)=>{
        setVisible(true);
        setQaIndex(index);
        qaForm.setFieldsValue(item);
    };

    return (
        <div
            style={{height:'100%'}}>
            <div style={{
                paddingLeft:'52px',
                paddingBottom:'24px',
                marginBottom:'24px',
                background:'rgba(32,34,50,1)',
                borderRadius:'8px',
            }}>
                <p style={titleStyle} >基本信息</p>
                <Form
                    colon={false}
                    form={form}
                    labelCol={{span:2}}
                    onFinish={submit}
                    wrapperCol={{span:4}}
                >
                    <Form.Item
                        label="商品名称"
                        name="name"
                        rules={mustRequire('请输入商品名称')}
                    >
                        <Input allowClear
                            maxLength={40}
                            placeholder="请输入商品名称" />
                    </Form.Item>
                    <Form.Item
                        label="关联课程Name"
                        name="curriculumName"
                        noStyle
                    >
                        <Input className="hidden" />
                    </Form.Item>
                    <Form.Item
                        label="关联课程"
                        name="curriculum"
                        rules={mustRequire('请选择关联课程')}
                    >
                        <Select onChange={queryGoodsSubject}  >
                            {
                                curriculum.map((item)=>{
                                    return <Option key={item.id}
                                        value={item.id}>{item.name}</Option>;
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="subjectId"
                        rules={mustRequire('请选择科目')}
                        wrapperCol={{span:22,offset:2}}
                    >
                        <Checkbox.Group style={{width:'100%'}}>
                            {
                                subject.map((item,index)=>{
                                    return (

                                        <Row key={index}
                                            style={{marginBottom:15}}>
                                            <Col className="flex_start"
                                                span={4}>
                                                {/* <Form.Item
                                                    name={['subjects',index,'subject']}
                                                    style={{marginBottom:0}} >
                                                    <Input/>
                                                </Form.Item> */}
                                                <Checkbox value={item.id} >{item.name}</Checkbox>
                                            </Col>
                                            <Col className="flex_start"
                                                span={18}>
                                                <Form.Item label="原价"
                                                    name={['subjects',index,'originalPrice']}
                                                    style={{marginLeft:15,margin:0}} >
                                                    <InputNumber  />
                                                </Form.Item>
                                                <Form.Item label="拼团价"
                                                    name={['subjects',index,'groupPrice']}
                                                    style={{marginLeft:15,marginBottom:0}}>
                                                    <InputNumber  />
                                                </Form.Item>
                                                <Form.Item label="赠品"
                                                    name={['subjects',index,'gift']}
                                                    style={{marginLeft:15,marginBottom:0}}
                                                >
                                                    <Input  />
                                                </Form.Item>
                                                <Form.Item
                                                    name={['subjects',index,'status']}
                                                    style={{marginLeft:15,marginBottom:0}} >
                                                    <Select  >
                                                        <Option value={0} >无需发货</Option>
                                                        <Option value={1}>发货</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    );
                                })
                            }
                        </Checkbox.Group>

                    </Form.Item>
                    <Form.Item
                        label="购买基数"
                        name="groupCount"
                        rules={mustRequire('请输入购买基数')}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        label="拼团时限"
                        name="countdown"
                        rules={mustRequire('请输入拼团时限')}
                    >
                        <Input addonAfter="天"
                            type="number" />
                    </Form.Item>
                    <Form.Item
                        label="有效期"
                        name="invalidYear"
                        rules={mustRequire('请输入有效期')}
                    >
                        <Input addonAfter="年"
                            type="number" />
                    </Form.Item>
                    <p style={titleStyle} >专题页装修</p>
                    <Form.Item
                        label="海报图"
                        name="homePage"
                        rules={mustRequire('请上传海报图')}
                    >
                        {/* name="homePage" */}
                        <Input  addonBefore={<CloudUploadOutlined onClick={()=>{setUploadType(UPLOAD_TYPE.homepage); fileRef.current.click();}} />}
                            allowClear
                            readOnly />
                        {/* <Form.Item   noStyle >
                        </Form.Item> */}
                    </Form.Item>
                    <input className="hidden"
                        onChange={inputFileChange}
                        ref={fileRef}
                        type="file" />
                    <Form.Item
                        label="详情图"
                        name="pages"
                        rules={mustRequire('请上传详情图')}
                    >
                        <div>
                            {
                                goodsPages.map((item,key)=>{
                                    return (
                                        <Form.Item
                                            key={key}
                                            name={['pages',key,'name']}
                                        >
                                            <Input
                                                addonBefore={<CloudUploadOutlined
                                                    onClick={()=>{setUploadType(UPLOAD_TYPE.pages); setPagesIndex(key); fileRef.current.click();}}/>}
                                                allowClear
                                                readOnly
                                            />
                                        </Form.Item>
                                    );
                                })
                            }
                        </div>
                    </Form.Item>
                    <Form.Item
                        label="问答"
                        name="qa"
                    >
                        <div>
                            {
                                (goods.qa || []).map((item,index)=>{
                                    return <Form.Item key={index}
                                        name={['qa',index,'question']}>
                                        <Input
                                            addonAfter={<EditOutlined onClick={()=>{openEditQa(item,index);}}
                                                style={{color:'#3B7DFF'}} />}
                                            bordered={false} />
                                    </Form.Item>;
                                })
                            }
                            <Form.Item>
                                <Button onClick={()=>{setVisible(true); setQaIndex(-1);}}
                                    type="primary">添加问答</Button>
                            </Form.Item>
                        </div>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset:2}} >
                        <Button htmlType="submit"
                            type="primary" >提交</Button>
                    </Form.Item>
                </Form>
            </div>

            <Modal
                closable={false}
                footer={null}
                title={<p className="text_center">{qaIndex >-1?'编辑':'添加'}问答</p>}
                visible={visible}
            >
                <Form
                    colon={false}
                    form={qaForm}
                    labelCol={{span:4}}
                    onFinish={addQa}
                >
                    <Form.Item label="问题"
                        name="question">
                        <Input placeholder="请填写" />
                    </Form.Item>
                    <Form.Item label="回答数"
                        name="answerCount">
                        <Input placeholder="请填写下方解答中回答的数量"
                            type="number" />
                    </Form.Item>
                    <Form.Item label="解答"
                        name="answer">
                        <Input.TextArea autoSize={{minRows:4}}
                            placeholder="请填写（多个回答使用“｜”分隔）" />
                    </Form.Item>
                    <Form.Item wrapperCol={{offset:9}}>
                        <Button className="mx_4"
                            ghost
                            onClick={()=>{setVisible(false);}}
                            type="primary" >取消</Button>
                        <Button className="mx_4"
                            htmlType="submit"
                            type="primary" >提交</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}


import React from 'react';
import VTable from '@/components/common/v-table';
import {Form,Input,Select,DatePicker,Tabs,Button,message,Table} from 'antd';
import VSearchInput from '@/components/common/v-search-input/index';
import VModal from '@/components/common/v-modal';
import {createTableColumn,showInfo} from '@/util/index';
import {CloseCircleOutlined} from '@ant-design/icons';
import Modal from 'antd/lib/modal/Modal';
const { RangePicker } = DatePicker;
const {TabPane} = Tabs;
const {Option} = Select;
import  './student.less';


export default class Student extends React.Component{
    state = {
        tableLoading:false,
        visible:false,
        courseColumn:[
            createTableColumn('科目','a'),
            createTableColumn('价格','b'),
            createTableColumn('订单类型','c'),
            createTableColumn('发货内容','d'),
            createTableColumn('到期时间','e'),
            {
                ...createTableColumn('操作','f'),
                align:'center',
                render:()=>{
                    return <Button danger
                        type="primary" >关闭</Button>;
                }
            }

        ],
        courseData:[
            {
                a:'中学教育教学知识与能力',
                b:'98',
                c:'拼团购买',
                d:'内容内容内容内容...',
                e:'2021-10-15 14:15:16',
                f:'123',
            }
        ],
        queryParams: {
            index: 1,
            size: 10,
            total: 0
        },
        tableData:[],
        columns:[
            createTableColumn('昵称','a'),
            createTableColumn('性别','b'),
            createTableColumn('学习账号','c'),
            createTableColumn('课程','d'),
            createTableColumn('在职/在校','e'),
            createTableColumn('最高学历','f'),
            createTableColumn('学习机会','g'),
            createTableColumn('地区','h'),
            createTableColumn('VIP科目','i'),
            createTableColumn('最近登录时间','j'),
        ]
    }


    componentDidMount(){
        const arr = [];

        for (let index = 0; index < 15; index++) {
            arr.push(
                {
                    a:'1',
                    key:index+'asdf',
                    b:12,
                    c:'成都',
                    d:'成都',
                    e:'成都',
                    f:'成都',
                    g:'成都',
                    h:'成都',
                    i:'成都',
                    j:'成都',
                    k:'成都',
                    l:'成都',
                }
            );
        }
        this.setState({tableData:arr});
    }

    closeModal = ()=>{
        this.setState({visible:false});
    }

    getTableData = (params) => {
        // this.setState({
        //     tableLoading: true,
        //     queryParams: {
        //         ...this.state.queryParams,
        //         ...params
        //     }
        // }, () => {
        //     requestApi(this.state.queryParams).then(({ data }) => {
        //         this.setState(() => ({
        //             queryParams: { ...this.state.queryParams, total: 0 },
        //             tableData:[],
        //             tableLoading: false
        //         }));
        //     }).finally(() => {
        //         this.setState({
        //             tableLoading: false
        //         });
        //     });
        // });
    };

    render(){
        return (
            <div className="student">
                <Form className="search_form"
                    layout="inline">
                    <Form.Item
                        name="ads"
                    >
                        <div className="flex_start form_item">
                            <span className="label">科目</span>
                            <Select
                                defaultValue=".com">
                                <Option value=".com">.com</Option>
                                <Option value=".jp">.jp</Option>
                                <Option value=".cn">.cn</Option>
                                <Option value=".org">.org</Option>
                            </Select>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="b"
                    >
                        <div className="flex_start form_item">
                            <span className="label">课程</span>
                            <Input/>
                        </div>
                    </Form.Item>
                    <Form.Item
                        name="c"
                    >
                        <div className="flex_start form_item">
                            <span className="label">下单时间</span>
                            <RangePicker />
                        </div>
                    </Form.Item>
                </Form>
                <div className="main"
                    onClick={()=>{
                        this.setState({visible:!this.setState.visible});
                    }}>
                    <div className="flex_between tool">
                        <Tabs className="no_border"
                            defaultActiveKey="123"
                            onChange={(v)=>{console.log(v);}}>
                            <TabPane key="123"
                                tab="全部">
                            </TabPane>
                            <TabPane key="sfg2"
                                tab="VIP">
                            </TabPane>
                            <TabPane key="3sdfgvb"
                                tab="非VIP">
                            </TabPane>
                        </Tabs>
                        <VSearchInput placeholder="搜索学习账号或昵称"
                            submit={(v)=>{console.log(v);}}
                            value="???"></VSearchInput>
                    </div>
                    <VTable
                        columns={this.state.columns}
                        getTableData={this.getTableData}
                        loading={this.state.tableLoading}
                        queryParams={this.state.queryParams}
                        tableData={this.state.tableData}
                    ></VTable>
                </div>

                <Modal
                    className="s_modal"
                    closable={false}
                    footer={false}
                    title={null}
                    visible={this.state.visible}
                    width={800}
                >
                    <CloseCircleOutlined className="icon_close"
                        onClick={()=>{this.setState({visible:!this.state.visible});}} />
                    <Tabs className="no_border">
                        <TabPane key="a"
                            tab="基本信息">
                            <div className="avatar"></div>
                            <p className="nick_name">昵称昵称</p>
                            <ul className="info clearfix">
                                <li className="fl">
                                    <span className="label">昵称</span>
                                    <span className="value">xxx</span>
                                </li>
                                <li className="fl">
                                    <span className="label">最高学历</span>
                                    <span className="value">xxx</span>
                                </li>
                                <li className="fl">
                                    <span className="label">昵称</span>
                                    <span className="value">xxx</span>
                                </li>
                                <li className="fl">
                                    <span className="label">昵称</span>
                                    <span className="value">xxx</span>
                                </li>
                            </ul>
                        </TabPane>
                        <TabPane key="b"
                            tab="VIP科目">
                            <Table columns={this.state.courseColumn}
                                dataSource={this.state.courseData}
                                pagination={false} />

                        </TabPane>
                    </Tabs>
                </Modal>
            </div>
        );
    }
}
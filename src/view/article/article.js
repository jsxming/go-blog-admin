import React from 'react';
import 'braft-editor/dist/index.css';
import VTable from '@/components/common/v-table';
import { Form, Select, DatePicker, Button, Radio, Drawer, Input, message, Popconfirm, Tag } from 'antd';
import VModal from '@/components/common/v-modal';
import VSearchInput from '@/components/common/v-search-input/index';
import { createTableColumn, createTableIndex } from '@/util/index';
import API from '@/api/index';
import { mustRequire } from '@/util/rule';
import moment from 'moment';
import BraftEditor from 'braft-editor';

import { TIME_FORMAT_NORMAL } from '@/util/constant';

const { RangePicker } = DatePicker;
const { Option } = Select;
import './article.less';

const TYPE = 'type';
const TAG = 'tag';


export default class Order extends React.Component {
    state = {
        isShow: false,
        rowIndex: -1,
        editorState: BraftEditor.createEditorState(), // 设置编辑器初始内容
        tableLoading: false,
        visible: false,
        typeList: [],
        tagList: [],
        typeForm: {
            type: '',
            name: ''
        },
        queryParams: {
            page: 1,
            size: 10,
            total: 0,
        },
        tableData: [],
        columns: [
            createTableIndex(),
            createTableColumn('标题', 'title'),
            {
                ...createTableColumn('描述', 'description'),
                width: 250,
                ellipsis: true
            },
            createTableColumn('分类', 'typeName'),
            createTableColumn('标签', 'tagName'),
            {
                ...createTableColumn('更新时间', 'updatedAt'),
                render: v => {
                    return moment(new Date(v)).format(TIME_FORMAT_NORMAL);
                }
            },
            {
                ...createTableColumn('创建时间', 'createdAt'),
                render: v => {
                    return moment(new Date(v)).format(TIME_FORMAT_NORMAL);
                }
            },
            {
                ...createTableColumn('操作', '操作'),
                width: 160,
                align: 'center',
                fixed: 'right',
                render: (val, row, index) => {
                    return <Button.Group>
                        <Popconfirm cancelText="取消"
                            okText="确认"
                            onConfirm={() => { this.deleteArticle(index); }}
                            title="您确定要删除该条记录吗？">
                            <Button danger>删除</Button>
                        </Popconfirm>
                        <Button ghost
                            onClick={() => { this.openEditModal(index); }}
                            type="primary" >编辑</Button>
                    </Button.Group>;

                }
            },
        ]
    }

    componentDidMount() {
        this.queryArticleTypes();
        this.queryArticleTags();
    }

    formRef = React.createRef()
    typeFormRef = React.createRef()

    closeModal = () => {
        this.setState({ visible: false });
    }

    queryArticleTypes = () => {
        API.queryArticleTypes().then((res) => {
            this.setState({ typeList: res });
        }).catch(() => {

        });
    }

    queryArticleTags = () => {
        API.queryArticleTags().then((res) => {
            this.setState({ tagList: res });
        }).catch(() => {

        });
    }

    openCreateModal = () => {
        this.setState({ visible: true, rowIndex: -1 }, () => {
            setTimeout(() => {
                this.formRef.current.resetFields();
                this.formRef.current.setFieldsValue({ content: BraftEditor.createEditorState('') });

            }, 0);
        });
    }

    openEditModal = (rowIndex) => {
        const clickedRow = this.state.tableData[rowIndex];
        this.setState({ visible: true, rowIndex }, () => {
            setTimeout(() => {
                console.log(clickedRow);
                this.formRef.current.setFieldsValue({ ...clickedRow, content: BraftEditor.createEditorState(clickedRow.content) });
            }, 0);
        });
    }

    getTableData = (params = {}) => {
        const obj = {
            tableLoading: true,
            queryParams: {
                ...this.state.queryParams,
                ...params
            }
        };
        this.setState(obj, () => {
            API.queryArticles(this.state.queryParams).then((data) => {
                this.setState(() => ({
                    queryParams: { ...this.state.queryParams, total: data.total },
                    tableData: data.list || [],
                }));
            }).finally(() => {
                this.setState({
                    tableLoading: false
                });
            });
        });
    };


    timeChange = (m, arr) => {
        this.getTableData({ startTime: arr[0], endTime: arr[1] });
    }

    deleteArticle = index => {
        const list = [...this.state.tableData];
        API.deleteArticle(list[index].id).then(() => {
            list.splice(index, 1);
            this.setState({ tableData: list });
        }).catch(() => {

        });
    }

    //更新文章
    updateArticle = (params, index) => {
        API.updateArticle(params).then(() => {
            const list = this.state.tableData || [];
            list[index] = params;
            this.setState({ visible: false, tableData: list });
            this.getTableData();
            message.success('操作成功');
        }).catch(() => {

        });
    }

    //创建标签 || 分类v
    createType = (v) => {
        if (v.type === TYPE) {
            API.createAritcleType(v).then(() => {
                this.queryArticleTypes();
            }).finally(() => {
                this.setState({ isShow: false });
            });
        } else if (v.type === TAG) {
            API.createAritcleTag(v).then(() => {
                this.queryArticleTags();
            }).catch(() => {
                this.setState({ isShow: false });
            });
        }
    }

    submitArticle = v => {
        const index = this.state.rowIndex;
        if (index > -1) {
            const params = {
                ...this.state.tableData[index],
                ...v
            };
            this.updateArticle(params, index);
        } else {
            API.createArticle({ ...v }).then(() => {
                this.getTableData();
                this.setState({ visible: false });
                message.success('操作成功');
            }).catch(() => {

            });
        }
    }

    handleChange = editorState => {
        const content = editorState.toHTML();
        this.formRef.current.setFieldsValue({ content });
    }

    render() {
        const { typeList, tagList, visible, editorState, tableData, rowIndex, columns, tableLoading, queryParams, isShow } = this.state;
        return (
            <div id="order" >
                <Drawer
                    closable={false}
                    onClose={() => { this.setState({ visible: false }); }}
                    placement="right"
                    title={<div className="flex_between">
                        <p>{rowIndex > -1 ? tableData[rowIndex].title : '添加文章'}</p>
                        <div>
                            <Button onClick={() => { this.formRef.current.submit(); }}
                                type="primary" >保存</Button>
                            <Button className="ml_15"
                                ghost
                                onClick={() => {
                                    this.setState({ visible: false });
                                }}
                                type="primary" >关闭</Button>
                        </div>
                    </div>}
                    visible={visible}
                    width="100%"
                >
                    <Form
                        colon={false}
                        onFinish={this.submitArticle}
                        ref={this.formRef}
                        wrapperCol={{ xxl: 3, xl: 5 }}
                    >
                        <Form.Item label="标题"
                            name="title" >
                            <Input />
                        </Form.Item>
                        <Form.Item label="描述"
                            name="description" >
                            <Input />
                        </Form.Item>
                        <Form.Item label="分类"
                            name="type" >
                            <Select>
                                {
                                    typeList.map((item, index) => {
                                        return <Option key={index}
                                            value={item.id}>{item.name}</Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="标签"
                            name="tag" >
                            <Select>
                                {
                                    tagList.map((item, index) => {
                                        return <Option key={index + 1000}
                                            value={item.id}>{item.name}</Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item label="内容"
                            name="content"
                            rules={[{
                                required: true,
                                validator: (_, value) => {
                                    if (!value.length) {
                                        return Promise.reject('请输入内容');
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            }]}
                            style={{ marginBottom: 0 }}
                            wrapperCol={{ span: 20 }}
                        >
                            <BraftEditor
                                onChange={this.handleChange}

                                style={{ border: '1px solid #ccc' }}
                                value={editorState}
                            />
                        </Form.Item>
                    </Form>
                </Drawer>

                <Form
                    colon={false}
                    layout="inline"
                >
                    <Form.Item
                        label="分类"
                    >
                        <Select defaultValue=""
                            onChange={type => { this.getTableData({ type }); }}>
                            <Option value="" >全部</Option>
                            {
                                typeList.map(item => {
                                    return <Option key={item.name}
                                        value={item.id}>{item.name}</Option>;
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="创建时间"
                    >
                        <RangePicker onChange={this.timeChange} />
                    </Form.Item>
                    <Form.Item>
                        <Button ghost
                            onClick={this.openCreateModal}
                            type="primary" >添加文章</Button>
                        <Button className="ml_15"
                            ghost
                            onClick={() => {
                                this.setState({ isShow: true });
                            }}
                            type="primary" >添加分类</Button>
                    </Form.Item>
                </Form>
                <div className="main">
                    <div className="flex_between tool">
                        <Radio.Group buttonStyle="solid"
                            defaultValue=""
                            onChange={e => { this.getTableData({ tag: e.target.value }); }}
                        >
                            <Radio.Button disabled>标签</Radio.Button>
                            <Radio.Button value="">全部</Radio.Button>
                            {
                                tagList.map((item, i) => {
                                    return <Radio.Button key={item.name + i}
                                        value={item.id}>{item.name}</Radio.Button>;
                                })
                            }
                        </Radio.Group>
                        <VSearchInput placeholder="文章标题"
                            submit={(title) => { this.getTableData({ title }); }}
                        ></VSearchInput>
                    </div>
                    <VTable
                        columns={columns}
                        getTableData={this.getTableData}
                        loading={tableLoading}
                        queryParams={queryParams}
                        tableData={tableData}
                    ></VTable>
                </div>

                <VModal title="添加分类"
                    visible={isShow} >
                    <Form
                        colon={false}
                        labelCol={{ span: 4 }}
                        onFinish={this.createType}
                        ref={this.typeFormRef}
                    >
                        <Form.Item label="类型"
                            name="type"
                            rules={mustRequire('请选择分类')}>
                            <Radio.Group>
                                <Radio value="type">分类</Radio>
                                <Radio value="tag">标签</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item label="名称"
                            name="name"
                            rules={mustRequire('请输入名称')}>
                            <Input />
                        </Form.Item>

                        <Form.Item >
                            <div className="flex_center">
                                <Button className="mx_15"
                                    htmlType="submit" >确认</Button>
                                <Button className="mx_15"
                                    onClick={() => {
                                        this.setState({ isShow: false });
                                    }}>取消</Button>
                            </div>
                        </Form.Item>

                    </Form>
                </VModal>
            </div>
        );
    }
}
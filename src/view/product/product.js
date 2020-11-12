import React from 'react';
import { Button,Tabs, Switch,Form,Select } from 'antd';
const {TabPane} = Tabs;
const {Option} = Select;
import {PlusOutlined} from '@ant-design/icons';
import VSearchInput from '@/components/common/v-search-input/index';
import VTable from '@/components/common/v-table';
import {createTableColumn,showInfo} from '@/util/index';
import { withRouter } from 'react-router-dom';
import API from '@/api/index';

class Goods extends React.Component{
    state = {
        tableLoading:false,
        queryParams: {
            current: 1,
            size: 20,
            total: 0,
            name:''
        },
        tableData:[],
        columns:[
            {
                title:'序号',
                render:(val,row,index) =>{
                    return index+1;
                }
            },
            createTableColumn('商品名称','name'),
            createTableColumn('关联课程','curriculumName'),
            {
                ...createTableColumn('上架状态','status'),
                render:(status,row)=> {
                    return <Switch defaultChecked={status===1}
                        onChange={()=>{this.changeGoodsStatus(row);}}></Switch>;
                },
            },
            createTableColumn('原价购买','originalPrice'),
            createTableColumn('拼团购买','groupPrice'),
            createTableColumn('拼团人数','groupCount'),
            createTableColumn('拼团时限','countdown'),
            createTableColumn('有效期','invalidYear'),
            createTableColumn('销售数量','saleCount'),
            createTableColumn('累计金额','salePrice'),
            {...createTableColumn('创建时间','createTime'),width:160},
            {
                title:'操作',
                fixed:'right',
                align:'center',
                width:170,
                render:(v,row)=>{
                    return <div>
                        <Button onClick={()=>{this.goEdit(row.id);}}
                            type="link">编辑</Button>
                        {/* <Button danger
                            onClick={()=>{this.goEdit(row.id);}}
                            type="link">删除</Button> */}
                    </div>;
                }
            },
        ]
    }

    //修改商品状态
    changeGoodsStatus=(row)=>{
        const status = row.status === 1 ? 0 : 1;
        API.saveGoods({id:row.id,status}).then(() => {
            if(status===0){
                showInfo('下架成功');
            }else{
                showInfo('上架成功');
            }
        }).catch(() => {

        });
    }

    getTableData = (params={})=>{
        const obj = {
            tableLoading: true,
            queryParams: {
                ...this.state.queryParams,
                ...params
            }
        };
        this.setState(obj, () => {
            API.queryGoods(this.state.queryParams).then((data) => {
                this.setState(() => ({
                    queryParams: { ...this.state.queryParams, total: data.total },
                    tableData: data.records || [],
                }));
            }).finally(() => {
                this.setState({
                    tableLoading: false
                });
            });
        });
    }


    goEdit = (id=0)=>{
        this.props.history.push('/product/edit/'+id);
    }

    render() {
        const {columns,tableLoading,queryParams,tableData} = this.state;
        return (
            <div>
                <div className="search_form flex_between">
                    <Form layout="inline" >
                        <Form.Item name="type">
                            <div className="flex_start form_item">
                                <span className="label">上架状态</span>
                                <Select
                                    allowClear
                                    onChange={(status)=>{this.getTableData({status});}}
                                >
                                    <Option value={''} >全部</Option>
                                    <Option value={1} >上架</Option>
                                    <Option value={0} >下架</Option>
                                </Select>
                            </div>
                        </Form.Item>
                    </Form>
                    <Button icon={<PlusOutlined />}
                        onClick={()=>{this.goEdit();}}
                        type="primary">
                        创建商品
                    </Button>
                </div>
                <div className="flex_between tool">
                    <Tabs className="no_border"
                        defaultActiveKey="123"
                    >
                        <TabPane key="123"
                            tab="全部">
                        </TabPane>
                    </Tabs>
                    <VSearchInput placeholder="搜索商品名称"
                        submit={(name)=>{this.getTableData({name});}}
                        value={this.state.queryParams.name}></VSearchInput>
                </div>
                <VTable
                    columns={columns}
                    getTableData={this.getTableData}
                    loading={tableLoading}
                    queryParams={queryParams}
                    tableData={tableData}
                ></VTable>
            </div>
        );
    }
}

export default withRouter(Goods);
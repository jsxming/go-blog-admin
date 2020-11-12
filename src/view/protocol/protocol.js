import React from 'react';
import { Button,Tabs, Switch } from 'antd';
const {TabPane} = Tabs;
import {PlusOutlined} from '@ant-design/icons';
import VSearchInput from '@/components/common/v-search-input/index';
import VTable from '@/components/common/v-table';
import {createTableColumn,showInfo} from '@/util/index';
import { withRouter } from 'react-router-dom';
import API from '@/api/index';

class Protocol extends React.Component{
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
            createTableColumn('协议名称','name'),
            {
                ...createTableColumn('生效状态','status'),
                render:(status,row)=> {
                    return <Switch defaultChecked={status===1}
                        onChange={()=>{this.changeProtocolStatus(row);}}></Switch>;
                },
            },
            createTableColumn('创建时间','createTime'),
            createTableColumn('修改时间','updateTime'),
            {
                title:'操作',
                fixed:'right',
                align:'center',
                render:(v,row)=>{
                    return <Button onClick={()=>{this.goEdit(row.id);}}
                        type="link">编辑</Button>;
                }
            },
        ]
    }

    //修改协议状态
    changeProtocolStatus=(row)=>{
        const status = row.status === 1 ? 0 : 1;
        API.updateProtocol({id:row.id,status}).then((res) => {
            // console.warn(res);
            if(status===0){
                showInfo('停用成功');
            }else{
                showInfo('生效成功');
            }
        }).catch((err) => {

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
            API.queryProtocols(this.state.queryParams).then((data) => {
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


    goEdit = (id)=>{
        let url = '/setting/protocol/edit';
        if(id){
            url+='?id='+id;
        }
        this.props.history.push(url);
    }

    render() {
        const {columns,tableLoading,queryParams,tableData} = this.state;
        return (
            <div>
                <div className="search_form flex_end">
                    <Button icon={<PlusOutlined />}
                        onClick={()=>{this.goEdit();}}
                        type="primary">
                        添加协议
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
                    <VSearchInput placeholder="搜索协议"
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

export default withRouter(Protocol);
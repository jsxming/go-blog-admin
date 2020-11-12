import React from 'react';
import PropTypes from 'prop-types';
import { Spin, Table, Pagination, } from 'antd';
/**
 * @description:全局table + 分页 组件，需要注意： pageChange和sizeChange函数需要根据后端需要的数据格式在父组件中获取参数自行组合
 * @param {getTableData}父组件获取table数据的函数
 * @param {loading}     table加载loading
 * @param {tableData}   table绑定的数据
 * @param {columns}     table的列声明
 * @param {isAutoLoad}  是否在挂载时获取table数据
 * @param {queryParams} 导出文件的参数 {total:0,page:1}
 * @param {width}       table的宽度多少才出现滚动条
 * @param {defaultPageSize} 分页默认条数
 */


/**
 * 使用示例 外部组件
 * <VTable
        getTableData={this.getTableData}
        queryParams={this.state.queryParams}
        loading={this.state.tableLoading}
        tableData={this.state.tableData}
        columns={this.state.columns}
    ></VTable>

    state = {
        tableLoading:false,
        queryParams: {
            current: 1,
            size: 20,
            total: 0
        },
    }

    getTableData = (params) => {
        this.setState({
            tableLoading: true,
            queryParams: {
                ...this.state.queryParams,
                ...params
            }
        }, () => {
            requestApi(this.state.queryParams).then(({ data }) => {
                this.setState(() => ({
                    queryParams: { ...this.state.queryParams, total: +data.total },
                    tableData: data.records || [],
                }));
            }).finally(() => {
                this.setState({
                    tableLoading: false
                });
            });
        });
    };

 *
 */

export default class VTable extends React.Component {
    static propTypes = {
        getTableData: PropTypes.func.isRequired,
        loading: PropTypes.bool.isRequired,
        tableData: PropTypes.array.isRequired,
        columns: PropTypes.array.isRequired,
        isAutoLoad: PropTypes.bool,
        defaultPageSize: PropTypes.number,
        queryParams: PropTypes.object,
        width: PropTypes.number,
        height: PropTypes.number,
        isShowPage: PropTypes.bool,
    }
    // props默认值
    static defaultProps = {
        defaultPageSize: 10,
        queryParams: {
            total: 0,
            current: 1,
            size:20
        },
        width: 1500,
        height: 586,
        isAutoLoad: true,
        isShowPage: true,
    }
    componentDidMount() {
        if (this.props.isAutoLoad) {
            this.props.getTableData();
        }
    }

    // 当前页 改变重新获取数据 需要跟后台参数一致
    pageChange = (page,size) => {
        this.props.getTableData({ page,size });
    };


    render() {
        const {
            loading,
            tableData,
            columns,
            defaultPageSize,
            queryParams,
            isShowPage,
        } = this.props;
        return (
            <>
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={tableData}
                        pagination={false}
                        rowKey={row => row.id}
                        scroll={{ x: this.props.width,y:this.props.height }}
                    />
                </Spin>
                <footer className="flex_center"
                    style={{ padding: '15px 0', }}
                >
                    <div
                        style={{marginRight:'15px'}}>
                        共<span style={{ color: '#1890ff', }}> {queryParams.total} </span>条
                    </div>
                    {
                        isShowPage &&
                        <Pagination
                            current={queryParams.current}
                            defaultCurrent={1}
                            defaultPageSize={defaultPageSize}
                            onChange={this.pageChange}
                            pageSizeOptions={['1','10','20','50','100','200']}
                            showQuickJumper
                            showSizeChanger
                            total={queryParams.total}
                        />
                    }

                </footer>
            </>
        );
    }
}

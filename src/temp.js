import React from 'react';
const confimModal =      <Modal
    cancelText="取消"
    closable={false}
    okText="确定"
    onCancel={()=>{this.setState({isOpenConfirm:false});}}
    onOk={this.deleteQuestion}
    title="删除提示"
    visible={false}
>
    {/* <footer className="flex_end">
    <Button ghost
        type="primary" >取消</Button>
    <Button type="primary"  >确定</Button>
</footer> */}
</Modal>;
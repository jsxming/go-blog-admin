import React from 'react';
import {Modal} from 'antd';
// import {CloseCircleOutlined} from '@ant-design/icons';

export default function VModal({children,visible,title}){
    return  (
        <Modal
            centered
            closable={false}
            footer={null}
            title={
                <p className="text_center">{title}
                    {/* <CloseCircleOutlined
                        style={{position:'absolute',right:'16px',backgroundColor:'#3B7DFF',borderRadius:'50%'}} /> */}
                </p>
            }
            visible={visible}
            width={420}
        >
            {children}
        </Modal>
    );
}
import React from 'react';
import {connect,} from 'react-redux';
// import  './style/app.css';



function App({history,add,number}) {
    return (
        <div className="test">
            <h1 onClick={() => { history.push('/login'); }}>首页</h1>
            <h1 onClick={()=>{add();}}>ADD-------</h1>
            <h1>{number}</h1>
            <h1>bvcb</h1>
        </div>
    );
}

function mapDispatchToProps(dispatch){
    return {
        add(){
            dispatch({type:'add',d:123});
        },
    };
}

function mapStateToProps(state){
    console.warn(state);
    return {
        number:state.test,
    };
}

export default connect(mapStateToProps,mapDispatchToProps)(App);

import {all, takeEvery,call, put} from 'redux-saga/effects';
import {DO_LOGIN, SET_TOKEN,QUERY_COURSE,SET_COURSE} from '../action-type';
import API from '@/api/index';


function* login(action){
    const res = yield call(API.login,action.payload);
    put({type:SET_TOKEN,payload:res.token});
}


function* queryCourses(action){
    const res = yield call(API.querySubjectTree,action.payload);
    yield put({type:SET_COURSE,payload:res});
}



export default function* root(){
    yield all([
        takeEvery(DO_LOGIN,login),
        takeEvery(QUERY_COURSE,queryCourses),
    ]);
}
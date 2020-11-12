// import http from '../../http'
import { all,put,takeLatest,call, } from 'redux-saga/effects';
// import actionTypes from '../actions/actionTypes'
// import { requestBefore } from "./request";
// export function* sellCount() {
//   try {
//     const data = yield call(http.getSellGoodsCount, {});
//     const { goodsCount } = data
//     yield put({
//       type: actionTypes.GOODS_COUNT_GETDATA_SUCCESS,
//       count: goodsCount
//     })
//   } catch (err) {
//     yield put({
//       type: actionTypes.GOODS_COUNT_GETDATA_FAILURE,
//     })
//   }
// }

// export function* goodsList(action) {
//   try {
//     const data = yield call(http.getGoodsData, action.parmas);
//     yield put({
//       type: actionTypes.GOODS_LIST_GETDATA_SUCCESS,
//       goodsList: data.goodsList
//     })
//   } catch (err) {
//     yield put({
//       type: actionTypes.GOODS_LIST_GETDATA_FAILURE,
//     })
//   }
// }
function quest(){
    return new Promise((resolve)=>{
        setTimeout(() => {
            resolve(parseInt(Math.random()*1000));
        }, 1500);
    });
}

function* test(action) {
    // yield delay(500)
    const number = yield call(quest);
    yield put({ type: 'addNumber',payload:number});
}

// function* logger(action){
//   const state  = yield select();
//   console.warn(action);
//   console.warn(state);
// }

export default function* root() {
    yield all([
    // takeLatest(actionTypes.GOODS_COUNT_GETDATA_REQUSET, requestBefore(sellCount)),
    // takeLatest(actionTypes.GOODS_LIST_GETDATA_REQUSET, requestBefore(goodsList)),
    // takeEvery('add', test),
        takeLatest('add', test),
    // takeEvery('*', logger)
    ]);
}
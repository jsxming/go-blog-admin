import { all, fork, } from 'redux-saga/effects';
import demo from './demo';
import global from './global';
export default function* root() {
    yield all([
        fork(demo),
        fork(global),
    ]);
}

import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducer'
import { middleware } from '../navigator/AppNavigator'
import logger from 'redux-logger'

const middlewares = [
    middleware,
    logger,
    thunk
];
/** * 创建store */
export default createStore(reducers, applyMiddleware(...middlewares));
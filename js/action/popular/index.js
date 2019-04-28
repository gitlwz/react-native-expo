import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

/**
 * 获取最热数据的异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 * @returns {function(*=)}
 */
export function onLoadPopularData(storeName, url, pageSize, favoriteDao) {
    return dispatch => {
        //刷新
        dispatch({ type: Types.POPULAR_REFRESH, storeName: storeName });
        let dataStore = new DataStore();
        dataStore.fetchData(url)//异步action与数据流
            .then(data => {
                handleData(dispatch, storeName, data)
            })
            .catch(error => {
                console.log(error);
                dispatch({
                    type: Types.POPULAR_REFRESH_FAIL,
                    storeName,
                    error
                });
            })
    }
}

function handleData(dispatch, storeName, data) {
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        storeName,
        items: data && data.data && data.data.items
    })
}
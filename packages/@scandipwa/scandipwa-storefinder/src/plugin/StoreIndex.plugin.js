import { StoreFinderReducer } from '../store/StoreFinder/StoreFinder.reducer';

const getReducer = (args, callback) => ({
    ...callback(...args),
    StoreFinderReducer
});

export default {
    'Store/Index/getReducers': {
        function: getReducer
    }
};

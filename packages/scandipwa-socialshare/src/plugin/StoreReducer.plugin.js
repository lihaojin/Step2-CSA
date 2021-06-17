import { SocialShareReducer } from '../store/SocialShare/SocialShare.reducer';

const getStaticReducers = (args, callback, instance) => ({
   ...callback(...args),
   SocialShareReducer
});

export const config = {
   'Store/Index/getReducers': {
       function: getStaticReducers
   }
};

export default config;

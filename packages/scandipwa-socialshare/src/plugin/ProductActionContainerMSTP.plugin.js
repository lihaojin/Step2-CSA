const mapStateToProps = (args, callback, instance) => {
    const [state] = args;
 
    return {
        ...callback(...args),
        socialShare: state.SocialShareReducer.socialShare
    };
 };
 
 export default {
    'Component/ProductActions/Container/mapStateToProps': {
        function: mapStateToProps
    }
 };
 
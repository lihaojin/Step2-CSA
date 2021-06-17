export const SocialShareDispatcher = import(
    /* webpackMode: "lazy", webpackChunkName: "dispatchers" */
    '../store/SocialShare/SocialShare.dispatcher'
 );
 
 /** @namespace ScandipwaSocialshare/Plugin/RouterContainerPlugin/mapDispatchToProps */
 export const mapDispatchToProps = (args, callback, instance) => {
    const [dispatch] = args;
    const mdtp = callback(...args);
    const { init } = mdtp;
 
    mdtp.init = (...args) => {
        init(...args);
        SocialShareDispatcher.then(
            ({ default: dispatcher }) => dispatcher.handleData(dispatch)
        );
    };
 
    return mdtp;
 };
 
 export const config = {
    'Component/Router/Container/mapDispatchToProps': {
        function: mapDispatchToProps
    }
 };
 
 export default config;

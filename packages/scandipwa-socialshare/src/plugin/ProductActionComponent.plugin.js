import { lazy, Suspense } from 'react';

export const SocialShare = lazy(() => import(
   /* webpackMode: "lazy", webpackChunkName: "social-share" */
   '../component/SocialShare'
   ));

const renderShortDescription = (args, callback, instance) => (
   <>
       { callback.apply(instance, args) }
       { renderSocialShare(instance.props) }
   </>
);

const renderSocialShare = (props) => {
   const {
       socialShare: {
           socialShareConfig: {
               enabled, productPage, rounded, size
           }, providers
       },
       product: { name }
   } = props;

   if (!enabled && !productPage) {
       return false;
   }

   return (
       <section
           block="ProductActions"
           elem="Section"
           mods={ { type: 'social' } }
       >
           <Suspense fallback={ null }>
               <SocialShare
                   isRounded={ rounded }
                   size={ size }
                   providers={ providers }
                   quote={ name }
               />
           </Suspense>
       </section>
   );
};

export const config = {
   'Component/ProductActions/Component': {
       'member-function': {
           renderShortDescription
       }
   }
};

export default config;

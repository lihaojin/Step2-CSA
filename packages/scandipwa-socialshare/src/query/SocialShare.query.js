import { Field } from 'Util/Query';

/** @namespace ScandipwaSocialshare/Query/SocialShare/Query/SocialShareQuery */
export class SocialShareQuery {
   getQuery() {
       return new Field('socialShare')
           .addField(this.getConfigField())
           .addField(this.getProviderField());
   }

   getConfigField() {
       return new Field('socialShareConfig')
           .addFieldList(this.getConfigFields());
   }

   getConfigFields() {
       return [
           'enabled',
           'rounded',
           'size',
           'categoryPage',
           'productPage',
           'homePage'
       ];
   }

   getProviderField() {
       return new Field('providers')
           .addFieldList(this.getProviderFields());
   }

   getProviderFields() {
       return [
           'id',
           'counter',
           'additional'
       ];
   }
}

export default new SocialShareQuery();

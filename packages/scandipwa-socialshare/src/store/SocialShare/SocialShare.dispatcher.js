import { showNotification } from 'Store/Notification/Notification.action';
import BrowserDatabase from 'Util/BrowserDatabase';
import { QueryDispatcher } from 'Util/Request';
import { ONE_MONTH_IN_SECONDS } from 'Util/Request/QueryDispatcher';

import SocialShareQuery from '../../query/SocialShare.query';
import { updateSocialShare } from './SocialShare.action';

/** @namespace ScandipwaSocialshare/Store/SocialShare/Dispatcher/SocialShareDispatcher */
export class SocialShareDispatcher extends QueryDispatcher {
   __construct() {
       super.__construct('SocialShare');
   }

   onSuccess(data, dispatch) {
       if (data) {
           BrowserDatabase.setItem(data, 'SocialShare', ONE_MONTH_IN_SECONDS);
           dispatch(updateSocialShare(data));
       }
   }

   onError(error, dispatch) {
       dispatch(showNotification('error', __('Error fetching SocialShare!'), error));
   }

   prepareRequest() {
       return [
           SocialShareQuery.getQuery()
       ];
   }
}

export default new SocialShareDispatcher();

/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */
/* eslint-disable */
import { QueryDispatcher, executePost } from "Util/Request";
import { updateNoMatch } from "Store/NoMatch/NoMatch.action";

import { showNotification } from "Store/Notification/Notification.action";
import { prepareQuery } from "Util/Query/PrepareDocument";
import { updateStoreFinder } from ".";
import StoreFinderQuery from "../../query/StoreFinder.query";

/**
 * Store Finder Dispatcher
 * @class StoreFinderDispatcher
 * @extends QueryDispatcher
 * @namespace Store/StoreFinder/Dispatcher
 */
export class StoreFinderDispatcher extends QueryDispatcher {
    constructor() {
        super('StoreFinder');
    }

    onSuccess({ getStores }, dispatch) {
        dispatch(updateStoreFinder(getStores));
    }

    onError(error, dispatch) {
        dispatch(updateNoMatch(true));
    }

    requestStoreData(dispatch) {
        const query = StoreFinderQuery.getQuery();

        return executePost(prepareQuery([query])).then(
            /** @namespace Scandiweb/StoreFinderGraphQl/Store/StoreFinder/Dispatcher/executePostThen */
            ({ getStores }) => {
                dispatch(updateStoreFinder(getStores));
            },
            /** @namespace Scandiweb/StoreFinderGraphQl/Store/StoreFinder/Dispatcher/executePostThen */
            (error) => dispatch(showNotification("error", error[0].message))
        );
    }
}

export default new StoreFinderDispatcher();

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

export const UPDATE_STORE_FINDER = 'UPDATE_STORE_FINDER';

/**
 * Update Store Finder information
 * @namespace Storefinder/Store/StoreFinder/Action/updateStoreFinder */
export const updateStoreFinder = (storeList) => ({
    type: UPDATE_STORE_FINDER,
    storeList
});

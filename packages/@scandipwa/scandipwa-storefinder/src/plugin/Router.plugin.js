import {
    lazy
} from 'react';
import { Route } from 'react-router-dom';

export const StoreFinder = lazy(() => import(/* webpackMode: "lazy", webpackChunkName: "storeFinder" */ '../route/StoreFinder'));

export class RouterPlugin {
    SWITCH_ITEMS_TYPE = (originalMember) => [
        ...originalMember,
        {
            component: <Route path="/stores" exact component={ StoreFinder } />,
            position: 90
        }
    ];
}

const {
    SWITCH_ITEMS_TYPE
} = new RouterPlugin();

export const config = {
    'Component/Router/Component': {
        'member-property': {
            SWITCH_ITEMS_TYPE
        }
    }
};

export default config;

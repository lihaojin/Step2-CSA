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

import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import { connect } from 'react-redux';

import BreadcrumbsDispatcher from 'Store/Breadcrumbs/Breadcrumbs.dispatcher';

import StoreFinderDispatcher from '../../store/StoreFinder/StoreFinder.dispatcher';
import StoreFinder from './StoreFinder.component';

/** @namespace Scandipwa/Route/StoreFinder/Container/mapStateToProps */
export const mapStateToProps = (state) => ({
    storeListCities: state.StoreFinderReducer.storeListCities,
    storeListMapped: state.StoreFinderReducer.storeListMapped,
    storeByName: state.StoreFinderReducer.storeByName
});

/** @namespace Scandipwa/Route/StoreFinder/Container/mapDispatchToProps */
export const mapDispatchToProps = (dispatch) => ({
    requestStores: () => {
        StoreFinderDispatcher.requestStoreData(dispatch);
    },

    enableBreadcrumbs: () => {
        BreadcrumbsDispatcher.update([
            {
                url: '',
                name: __('Shops')
            }
        ], dispatch);
    }
});

/** @namespace Scandipwa/Route/StoreFinder/Container/StoreFinderContainer */
export class StoreFinderContainer extends PureComponent {
    static propTypes = {
        location: PropTypes.shape().isRequired,
        enableBreadcrumbs: PropTypes.func.isRequired,
        requestStores: PropTypes.func.isRequired,
        storeListCities: PropTypes.arrayOf(PropTypes.string).isRequired,
        storeListMapped: PropTypes.objectOf(
            PropTypes.arrayOf(
                PropTypes.shape({
                    latitude: PropTypes.string,
                    longitude: PropTypes.string,
                    city: PropTypes.string,
                    address: PropTypes.string
                })
            )
        ).isRequired,
        storeByName: PropTypes.objectOf(
            PropTypes.shape({
                latitude: PropTypes.string,
                longitude: PropTypes.string,
                city: PropTypes.string,
                address: PropTypes.string
            })
        ).isRequired
    };

    containerFunctions = {
        changeCity: this.changeCity.bind(this),
        changeStore: this.changeStore.bind(this),
        handleStoreChange: this.handleStoreChange.bind(this),
        prepareStorePosition: this.prepareStorePosition.bind(this),
        prepareStoreData: this.prepareStoreData.bind(this),
        prepareMapData: this.prepareMapData.bind(this),
        prepareStoreOptions: this.prepareStoreOptions.bind(this),
        prepareCityOptions: this.prepareCityOptions.bind(this)
    };

    state = {
        selectedCity: 'All cities',
        selectedStore: {}
    };

    componentDidMount() {
        const { requestStores, enableBreadcrumbs } = this.props;

        requestStores();
        enableBreadcrumbs();
    }

    componentDidUpdate(prevProps) {
        const { requestStores, location: { pathname } } = this.props;
        const { location: { pathname: prevPathname } } = prevProps;

        if (pathname !== prevPathname) {
            requestStores();
        }
    }

    changeCity(selectedCity) {
        this.setState({ selectedCity, selectedStore: {} });
    }

    changeStore(selectedStore) {
        this.setState({ selectedStore });
    }

    handleStoreChange(store_name) {
        const { storeByName } = this.props;

        this.changeStore(storeByName[store_name] || {});
    }

    prepareMapBounds(allStores) {
        const latLongArr = allStores.map(this.prepareStorePosition);

        return L.latLngBounds(latLongArr);
    }

    prepareStorePosition({ latitude, longitude }) {
        if (!latitude || !longitude) {
            return null;
        }

        return [latitude, longitude];
    }

    prepareStoreData() {
        const { storeListMapped } = this.props;
        const { selectedCity } = this.state;

        const cityStores = storeListMapped[selectedCity]
            || Object.values(storeListMapped).reduce((stores, cityStores) => {
                // eslint-disable-next-line no-param-reassign
                stores = [...stores, ...cityStores];
                return stores;
            }, []);

        return cityStores.reduce((validStores, allStore) => {
            const {
                latitude,
                longitude,
                city,
                store_name
            } = allStore;

            if (latitude !== 0 && longitude !== 0 && city) {
                const sortInsertIndex = validStores.findIndex(({
                    city: validCity, store_name: validStoreName
                }) => {
                    if (city === validCity) {
                        return validStoreName > store_name;
                    }

                    return validCity > city;
                });

                const insertPosition = sortInsertIndex >= 0 ? sortInsertIndex : validStores.length;

                validStores.splice(insertPosition, 0, {
                    ...allStore,
                    active: false
                });
            }

            return validStores;
        }, []);
    }

    prepareCityOptions() {
        const { storeListCities: cities } = this.props;

        const validCityOptions = cities.reduce((options, city) => {
            if (city) {
                const sortInsertIndex = options.findIndex(({ label }) => label > city);
                const insertPosition = sortInsertIndex >= 0 ? sortInsertIndex : options.length;

                options.splice(insertPosition, 0, {
                    id: city.replace(/\s/g, ''), value: city, label: city
                });
            }

            return options;
        }, []);

        validCityOptions.unshift({ id: __('All cities'), value: __('All cities'), label: __('All cities') });

        return validCityOptions;
    }

    prepareStoreOptions() {
        const allStore = this.prepareStoreData() || [];

        return [{ store_name: __('All stores') }, ...allStore].map(({ store_name }) => (
            { id: store_name, value: store_name, label: store_name }
        )) || [];
    }

    prepareMapData() {
        const { selectedStore, selectedStore: { store_name } } = this.state;
        const allStores = this.prepareStoreData();
        const hasMultipleStores = allStores.length > 1;

        return {
            allStores,
            centerPosition: this.prepareStorePosition(hasMultipleStores ? selectedStore : allStores[0]),
            bounds: hasMultipleStores && !store_name ? this.prepareMapBounds(allStores) : null
        };
    }

    render() {
        return (
            <StoreFinder
              { ...this.props }
              { ...this.state }
              { ...this.containerFunctions }
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoreFinderContainer);

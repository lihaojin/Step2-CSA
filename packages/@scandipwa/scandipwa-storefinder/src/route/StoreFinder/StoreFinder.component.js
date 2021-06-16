/* eslint-disable max-lines */
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
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import {
    Map,
    Marker,
    Popup,
    TileLayer
} from 'react-leaflet';

import ContentWrapper from 'Component/ContentWrapper';
import Field from 'Component/Field/Field.component';
import Html from 'Component/Html';
import Meta from 'Component/Meta';

import 'leaflet/dist/leaflet.css';
import './StoreFinder.style';

/** @namespace Scandipwa/Route/StoreFinder/Component/StoreFinderComponent */
export class StoreFinderComponent extends PureComponent {
    static propTypes = {
        changeStore: PropTypes.func.isRequired,
        prepareCityOptions: PropTypes.func.isRequired,
        prepareStoreOptions: PropTypes.func.isRequired,
        prepareStoreData: PropTypes.func.isRequired,
        prepareMapData: PropTypes.func.isRequired,
        changeCity: PropTypes.func.isRequired,
        handleStoreChange: PropTypes.func.isRequired,
        storeListCities: PropTypes.arrayOf(PropTypes.string).isRequired,
        selectedCity: PropTypes.string.isRequired,
        selectedStore: PropTypes.shape().isRequired
    };

    renderWorkingDays(store) {
        const { working_days } = store;

        if (!working_days) {
            return __('No info about working days');
        }

        const workingDaysMap = working_days.split(',').map((day) => day === '1');

        return (
            workingDaysMap.map((isActive, index) => (
                <span
                  block="StoreFinder"
                  elem="Circles"
                  key={ index }
                  mods={ { isActive } }
                />
            ))
        );
    }

    renderHeading() {
        return (
            <div block="StoreFinder" elem="Heading">
                <h1 block="StoreFinder" elem="Heading" mods={ { Title: true } }>
                    { __('Shop search') }
                </h1>
            </div>
        );
    }

    renderSelectList() {
        const {
            selectedCity,
            selectedStore: { store_name },
            prepareCityOptions,
            prepareStoreOptions,
            changeCity,
            handleStoreChange
        } = this.props;

        const selectOptions = prepareStoreOptions();
        const selectCityOptions = prepareCityOptions();

        return (
            <div block="StoreFinder" elem="SelectList">
                { this.renderHeading() }
                <div block="StoreFinder" elem="Select">
                    <Field
                      id="city-select"
                      name="city-select"
                      type="select"
                      mix={ { block: 'StoreLocation', elem: 'Search' } }
                      mods={ { select: true } }
                      selectOptions={ selectCityOptions }
                      value={ selectedCity }
                      onChange={ changeCity }
                      validation={ [] }
                      isOptionsSortingDisabled
                    />
                </div>
                <div block="StoreFinder" elem="Select">
                    <Field
                      id="store-select"
                      name="store-select"
                      type="select"
                      mix={ { block: 'StoreLocation', elem: 'Search' } }
                      mods={ { select: true } }
                      selectOptions={ selectOptions }
                      value={ store_name || 'All stores' }
                      onChange={ handleStoreChange }
                      validation={ [] }
                      isOptionsSortingDisabled
                    />
                </div>
            </div>
        );
    }

    renderStoreCardContent(store) {
        const {
            store_name, address, phone_number, store_hours
        } = store;

        return (
            <>
                <h3 block="StoreFinder" elem="StoreInfo" mods={ { type: 'name' } }>
                    { store_name || __('No store name') }
                </h3>
                <span block="StoreFinder" elem="StoreInfo" mods={ { type: 'address' } }>
                    { address || __('No address') }
                </span>
                <span block="StoreFinder" elem="StoreInfo" mods={ { type: 'number' } }>
                    { phone_number || __('No phone number') }
                </span>
                <div block="StoreFinder" elem="StoreInfo" mods={ { type: 'workingdays' } }>
                    { this.renderWorkingDays(store) }
                </div>
                <span block="StoreFinder" elem="StoreInfo" mods={ { type: 'hours' } }>
                    { store_hours ? <Html content={ store_hours } /> : __('No store hours') }
                </span>
            </>
        );
    }

    renderMarker(store, icon) {
        const { changeStore } = this.props;
        const { latitude, longitude, store_name } = store;

        return (
            <Marker
              position={ [latitude, longitude] }
              icon={ icon }
              key={ store_name.replace(/\s/g, '') || 'All Stores' }
              riseOnHover
              onClick={ () => changeStore(store) }
            >
                <Popup closeButton={ false }>
                    <div block="StoreFinder" elem="Store">
                        { this.renderStoreCardContent(store) }
                    </div>
                </Popup>
            </Marker>
        );
    }

    renderAllMarkers() {
        const { prepareMapData } = this.props;
        const { allStores } = prepareMapData();

        const icon = new L.Icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            className: 'leaflet-div-icon',
            iconSize: new L.Point(21, 41)
        });

        return allStores.map((store) => this.renderMarker(store, icon));
    }

    renderMap() {
        const { prepareMapData } = this.props;
        const { centerPosition, bounds } = prepareMapData();

        return (
            <div block="StoreFinder" elem="Map">
                <Map
                  center={ centerPosition }
                  zoom={ 13 }
                  bounds={ bounds }
                  boundsOptions={ { padding: [20, 20] } }
                  duration={ 0.8 }
                  animate
                  useFlyTo
                >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      updateWhenIdle={ false }
                      reuseTiles
                    />
                    { this.renderAllMarkers() }
                </Map>
            </div>
        );
    }

    renderStoreCard(store) {
        const { selectedStore: { store_name: selectedStoreName }, changeStore } = this.props;
        const { store_name } = store;

        return (
            <div
              block="StoreFinder"
              elem="Store"
              key={ store_name.replace(/\s/g, '') }
              mods={ { isActive: store_name === selectedStoreName } }
            >
                { this.renderStoreCardContent(store) }
                <button
                  block="Button"
                  mods={ { likeLink: true } }
                  onClick={ () => changeStore(store) }
                >
                    { __('Show on the map') }
                </button>
            </div>
        );
    }

    renderStoreCards() {
        const { prepareStoreData } = this.props;
        const allStores = prepareStoreData();

        return (
            <div block="StoreFinder" elem="StoreCards">
                { allStores.map((store) => this.renderStoreCard(store)) }
            </div>
        );
    }

    renderMainContent() {
        const { storeListCities } = this.props;

        if (!storeListCities.length) {
            return null;
        }

        return (
            <div block="StoreFinder" elem="MainContent">
                { this.renderSelectList() }
                { this.renderMap() }
                { this.renderStoreCards() }
            </div>
        );
    }

    render() {
        const metaObject = {
            name: __('Our Shops'),
            title: __('Our Shops'),
            meta_title: __('Our Shops'),
            meta_description: __('Our Shops - Find the closest store'),
            meta_keyword: 'stores'
        };

        return (
            <main block="StoreFinder">
                <ContentWrapper
                  wrapperMix={ { block: 'StoreFinder', elem: 'Wrapper' } }
                  label={ __('Our Shops') }
                >
                    <Meta metaObject={ metaObject } />
                    { this.renderMainContent() }
                </ContentWrapper>
            </main>
        );
    }
}

export default StoreFinderComponent;

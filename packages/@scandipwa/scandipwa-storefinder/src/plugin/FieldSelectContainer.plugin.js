import PropTypes from 'prop-types';

export class FieldSelectContainerPlugin {
    propTypesExtended = (prop) => ({
        ...prop,
        isOptionsSortingDisabled: PropTypes.bool
    });

   defaultPropsExtended = (prop) => ({
       ...prop,
       isOptionsSortingDisabled: false
   });

    // eslint-disable-next-line no-unused-vars
    aroundContainerProps = (args, callback = () => {}, instance) => {
        const { valueIndex, searchString, isSelectExpanded } = instance.state;
        const { isOptionsSortingDisabled, selectOptions } = instance.props;
        return {
            selectOptions: isOptionsSortingDisabled
                ? selectOptions
                : instance.sortSelectOptions(),
            valueIndex,
            searchString,
            isSelectExpanded
        };
    };
}

export const { aroundContainerProps, propTypesExtended, defaultPropsExtended } = new FieldSelectContainerPlugin();

export default {
    'Component/FieldSelect/Container': {
        'member-function': {
            containerProps: aroundContainerProps
        },
        'static-member': {
            propTypes: propTypesExtended,
            defaultProps: defaultPropsExtended
        }
    }
};

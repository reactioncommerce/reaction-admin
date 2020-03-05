import React, { useState } from "react";
import PropTypes from "prop-types";
import ReactTable from "react-table";
import Button from "@reactioncommerce/catalyst/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core";
import CountryOptions from "@reactioncommerce/api-utils/CountryOptions.js";
import { i18next } from "/client/api";
import AddressValidationSettingsForm from "./AddressValidationSettingsForm";

const useStyles = makeStyles((theme) => ({
  createButton: {
    marginBottom: theme.spacing(3)
  },
  row: {
    cursor: "pointer"
  }
}));

const DEFAULT_PAGE_SIZE = 20;

/**
 * @summary React component that renders the form for adding, updating, or deleting
 *   a custom tax rate record.
 * @param {Object} props React props
 * @return {React.Node} React node
 */
export default function ShopAddressValidationSettings(props) {
  const {
    addressValidationRules,
    addressValidationServices,
    fetchAddressValidationRules,
    isLoadingAddressValidationRules,
    refetchAddressValidationRules,
    shopId,
    totalAddressValidationRulesCount
  } = props;

  const classes = useStyles();
  const [isCreating, setIsCreating] = useState(false);
  const [editDoc, setEditDoc] = useState(null);
  const [selectedPageSize, setSelectedPageSize] = useState(DEFAULT_PAGE_SIZE);

  /**
   * @summary Returns a filtered list of CountryOptions
   * @param {String} serviceName Service name to filter by support
   * @return {Object[]} Country options
   */
  function getSupportedCountryOptionsForService(serviceName) {
    // Don't show any countries in the list until they've selected a service
    if (!serviceName) return [];

    const selectedService = (addressValidationServices || []).find((service) =>
      service.name === serviceName);

    if (!selectedService || !Array.isArray(selectedService.supportedCountryCodes)) return CountryOptions;

    return CountryOptions.filter(({ value }) => selectedService.supportedCountryCodes.includes(value));
  }

  const serviceOptions = (addressValidationServices || []).map((addressValidationService) => ({
    label: addressValidationService.displayName,
    value: addressValidationService.name
  }));

  const columns = [{
    accessor: (item) => {
      if (!item.serviceName) return null;
      const selectedService = (addressValidationServices || []).find((service) => service.name === item.serviceName);
      return selectedService ? selectedService.displayName : item.serviceName;
    },
    Header: "Name",
    id: "serviceName"
  }, {
    accessor: (item) => {
      const countries = item.countryCodes || [];
      if (countries.length === 0) {
        const selectedService = (addressValidationServices || []).find((service) => service.name === item.serviceName);
        if (selectedService && selectedService.supportedCountryCodes) {
          return `All supported (${selectedService.supportedCountryCodes.join(", ")})`;
        }
        return "All";
      }
      return countries.join(", ");
    },
    Header: "Countries",
    id: "countries"
  }];

  const handleDialogClose = () => {
    setIsCreating(false);
    setEditDoc(null);
  };

  return (
    <div>
      <Card>
        <CardContent>
          <p>{i18next.t("addressValidation.helpText")}</p>
          <Button className={classes.createButton} color="primary" variant="contained" onClick={() => { setIsCreating(true); }}>
            {i18next.t("addressValidation.addNewItemButtonText")}
          </Button>
          <ReactTable
            className="-striped -highlight"
            columns={columns}
            data={addressValidationRules}
            defaultPageSize={DEFAULT_PAGE_SIZE}
            getTdProps={(state, rowInfo) => {
              const tdProps = {};

              if (rowInfo && rowInfo.original) {
                tdProps.onClick = () => {
                  setIsCreating(false);
                  setEditDoc(rowInfo.original);
                };
              }

              return tdProps;
            }}
            getTrProps={() => ({ className: classes.row })}
            loading={isLoadingAddressValidationRules}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={(state) => {
              setSelectedPageSize(state.pageSize);
              fetchAddressValidationRules({
                first: state.pageSize,
                offset: state.page * state.pageSize
              });
            }}
            pages={Math.ceil(totalAddressValidationRulesCount / selectedPageSize)}
          />
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="sm"
        open={!!(isCreating || editDoc)}
        onClose={handleDialogClose}
      >
        <DialogContent>
          <AddressValidationSettingsForm
            doc={editDoc}
            getSupportedCountryOptionsForService={getSupportedCountryOptionsForService}
            onSuccess={() => {
              handleDialogClose();
              refetchAddressValidationRules();
            }}
            serviceOptions={serviceOptions}
            shopId={shopId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

ShopAddressValidationSettings.propTypes = {
  addressValidationRules: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    countryCodes: PropTypes.arrayOf(PropTypes.string),
    serviceName: PropTypes.string.isRequired
  })),
  addressValidationServices: PropTypes.arrayOf(PropTypes.shape({
    displayName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    supportedCountryCodes: PropTypes.arrayOf(PropTypes.string)
  })),
  fetchAddressValidationRules: PropTypes.func,
  isLoadingAddressValidationRules: PropTypes.bool,
  refetchAddressValidationRules: PropTypes.func,
  shopId: PropTypes.string.isRequired,
  totalAddressValidationRulesCount: PropTypes.number
};

ShopAddressValidationSettings.defaultProps = {
  addressValidationRules: [],
  addressValidationServices: [],
  fetchAddressValidationRules: () => {},
  refetchAddressValidationRules: () => {},
  totalAddressValidationRulesCount: 0
};

import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import i18next from "i18next";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Box,
  makeStyles,
  IconButton
} from "@material-ui/core";
import CloseIcon from "mdi-material-ui/Close";
import PlusIcon from "mdi-material-ui/Plus";
import TextField from "@reactioncommerce/catalyst/TextField";
import SimpleSchema from "simpl-schema";
import clone from "clone";
import equal from "deep-equal";
import useProduct from "../hooks/useProduct";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2)
  },
  grid: {
    paddingBottom: theme.spacing(2)
  }
}));

const metafieldSchema = new SimpleSchema({
  key: {
    type: String,
    max: 30
  },
  namespace: {
    type: String,
    max: 20,
    optional: true
  },
  scope: {
    type: String,
    optional: true
  },
  value: {
    type: String
  },
  valueType: {
    type: String,
    optional: true
  },
  description: {
    type: String,
    optional: true
  }
});

const formSchema = new SimpleSchema({
  "metafields": {
    type: Array,
    optional: true
  },
  "metafields.$": metafieldSchema
});

const metafieldValidator = metafieldSchema.getFormValidator();

/**
 * Product metadata form block component
 * @returns {Node} React component
 */
function ProductMetadataForm() {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setDirty] = useState(false);
  const [metafields, setMetafields] = useState([]);
  const [newMetafield, setNewMetafield] = useState({ key: "", value: "" });
  const [metafieldErrors, setMetafieldErrors] = useState([]);
  const [newMetafieldErrors, setNewMetafieldErrors] = useState({});

  const {
    onUpdateProduct,
    product
  } = useProduct();

  const submitNewMetaForm = async () => {
    const errors = await metafieldValidator(metafieldSchema.clean(newMetafield));

    if (errors.length) {
      const errorObj = {};

      errors.forEach(({ name, message }) => {
        errorObj[name] = message;
      });

      setNewMetafieldErrors(errorObj);

      return;
    }

    setMetafieldErrors({});

    setMetafields((prevState) => [
      ...prevState,
      newMetafield
    ]);

    setNewMetafield({ key: "", value: "" });
  };

  const removeMetafield = async (itemIndexToRemove) => {
    setMetafields((prevState) => [
      ...prevState.filter((item, index) => index !== itemIndexToRemove)
    ]);
  };

  const submitForm = async () => {
    setIsSubmitting(true);

    const fieldErrors = [];
    let hasErrors = false;

    // Get all errors for fields
    for (const metafield of metafields) {
      // eslint-disable-next-line no-await-in-loop
      const groupErrors = await metafieldValidator(metafieldSchema.clean(metafield));
      const errorObj = {};

      if (groupErrors.length) {
        hasErrors = true;
      }

      for (const { name, message } of groupErrors) {
        errorObj[name] = message;
      }

      fieldErrors.push(errorObj);
    }

    if (hasErrors) {
      setMetafieldErrors(fieldErrors);
      return;
    }

    // Cleanup input, and remove any extra fields that may linger from GQL
    const cleanedInput = formSchema.clean({
      metafields
    });

    await onUpdateProduct({
      product: cleanedInput
    });

    setMetafieldErrors([]);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (product) {
      setMetafields(clone(product.metafields) || []);
    }
  }, [
    product
  ]);

  useEffect(() => {
    setDirty((product && !equal(product.metafields, metafields)));
  }, [
    product,
    metafields
  ]);

  if (!product) {
    return null;
  }

  return (
    <Card>
      <CardHeader title={i18next.t("admin.productAdmin.metadata")} />
      <CardContent>
        <Grid
          className={classes.grid}
          container
          spacing={2}
        >
          {Array.isArray(metafields) && metafields.map((metafield, index) => (
            <Fragment key={`metafield-${index}`}>
              <Grid
                item
                sm={3}
              >
                <TextField
                  error={metafieldErrors[index] && metafieldErrors[index].key}
                  fullWidth
                  helperText={metafieldErrors[index] && metafieldErrors[index].key}
                  placeholder={i18next.t("productDetailEdit.metafieldKey")}
                  onChange={(event) => {
                    setMetafields((prevState) => {
                      const nextState = [...prevState];
                      nextState[index].key = event.currentTarget.value;
                      return nextState;
                    });
                  }}
                  value={metafield.key}
                />
              </Grid>

              <Grid
                item
                sm={8}
              >
                <TextField
                  error={metafieldErrors[index] && metafieldErrors[index].value}
                  fullWidth
                  helperText={metafieldErrors[index] && metafieldErrors[index].value}
                  onChange={(event) => {
                    setMetafields((prevState) => {
                      const nextState = [...prevState];
                      nextState[index].value = event.currentTarget.value;
                      return nextState;
                    });
                  }}
                  placeholder={i18next.t("productDetailEdit.metafieldValue")}
                  value={metafield.value}
                />
              </Grid>

              <Grid
                item
                sm={1}
              >
                <IconButton onClick={() => removeMetafield(index)}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Fragment>
          ))}

          <Grid item sm={3}>
            <TextField
              error={newMetafieldErrors.key}
              fullWidth
              helperText={newMetafieldErrors.key}
              placeholder={i18next.t("productDetailEdit.metafieldKey")}
              onChange={(event) => {
                setNewMetafield((prevState) => {
                  const nextState = { ...prevState };
                  nextState.key = event.currentTarget.value;
                  return nextState;
                });
              }}
              value={newMetafield.key}
            />
          </Grid>

          <Grid item sm={8}>
            <TextField
              error={newMetafieldErrors.value}
              fullWidth
              helperText={newMetafieldErrors.value}
              onChange={(event) => {
                setNewMetafield((prevState) => {
                  const nextState = { ...prevState };
                  nextState.value = event.currentTarget.value;
                  return nextState;
                });
              }}
              placeholder={i18next.t("productDetailEdit.metafieldValue")}
              value={newMetafield.value}
            />
          </Grid>
          <Grid item sm={1}>
            <IconButton onClick={() => submitNewMetaForm()}>
              <PlusIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Box textAlign="right">
          <Button
            color="primary"
            disabled={!isDirty || isSubmitting}
            variant="contained"
            onClick={() => submitForm()}
            type="submit"
          >
            {i18next.t("app.saveChanges")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

ProductMetadataForm.propTypes = {
  newMetafield: PropTypes.object,
  onProductFieldChange: PropTypes.func,
  onProductMetaChange: PropTypes.func,
  onProductMetaRemove: PropTypes.func,
  onProductMetaSave: PropTypes.func,
  onProductSelectChange: PropTypes.func,
  onSitemapCheckboxChange: PropTypes.func,
  product: PropTypes.object
};

export default ProductMetadataForm;

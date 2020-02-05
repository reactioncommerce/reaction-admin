import React, { useEffect, useState } from "react";
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
import useProduct from "../hooks/useProduct";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(2)
  },
  textField: {
    // marginBottom: theme.spacing(1)
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

const validator = formSchema.getFormValidator();

/**
 * Product metadata form block component
 * @param {Object} props Component props
 * @returns {Node} React component
 */
function ProductMetadataForm(props) {
  const classes = useStyles();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [metafields, setMetafields] = useState([]);
  const [newMetafield, setNewMetafield] = useState({ key: "", value: "" });
  const {
    onUpdateProduct,
    product,
    shopId
  } = useProduct();

  const submitNewMetaForm = async () => {


    const error = await validator(formSchema.clean(newMetafield));
    console.error(error)

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

  const hasError = (value) => {
    if (typeof value !== "string" || (typeof value === "string" && value.length === 0)) {
      return true;
    }

    return false;
  };

  const submitForm = async () => {


    const errors = metafields.map(async (metafield) => {
      return validator(formSchema.clean(metafield));
    });
    console.log("ERRORS", errors);

    return;

    setIsSubmitting(true);

    // Cleanup input, and remove any extra fields that may linger from GQL
    const cleanedInput = formSchema.clean({
      metafields
    });

    await onUpdateProduct({
      product: cleanedInput
    });

    setIsSubmitting(false);
  };

  useEffect(() => {
    if (product) {
      setMetafields(product.metafields || []);
    }
  }, [
    product
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
            <>
              <Grid item sm={3}>
                <TextField
                  className={classes.textField}
                  error={hasError(metafield.key)}
                  fullWidth
                  placeholder={i18next.t("productDetailEdit.title")}
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

              <Grid item sm={8}>
                <TextField
                  className={classes.textField}
                  fullWidth
                  onChange={(event) => {
                    setMetafields((prevState) => {
                      const nextState = [...prevState];
                      nextState[index].value = event.currentTarget.value;
                      return nextState;
                    });
                  }}
                  placeholder={i18next.t("productDetailEdit.title")}
                  value={metafield.value}
                />
              </Grid>

              <Grid item sm={1}>
                <IconButton onClick={() => removeMetafield(index)}>
                  <CloseIcon />
                </IconButton>
              </Grid>
            </>
          ))}

          <Grid item sm={3}>
            <TextField
              className={classes.textField}
              fullWidth
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
              className={classes.textField}
              fullWidth
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
            // disabled={!isDirty || isSubmitting}
            variant="contained"
            onClick={() => submitForm()}

            type="submit"
          >
            {i18next.t("app.save")}
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

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Blocks, Components } from "@reactioncommerce/reaction-components";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import { Switch, Route } from "react-router-dom";

const styles = (theme) => ({
  block: {
    marginBottom: theme.spacing(3)
  }
});

/**
 * ProductDetail layout component
 * @param {Object} props Component props
 * @returns {Node} React node
 */
function ProductDetail(props) {
  const { classes, ...blockProps } = props;

  return (
    <Fragment>
      {/* <Components.ProductPublish /> */}
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Blocks region="ProductDetailHeader" blockProps={blockProps} />
        </Grid>
        <Grid item sm={4}>
          <Blocks region="ProductDetailSidebar" blockProps={blockProps} />
        </Grid>
        <Grid item sm={8}>
          <Switch>
            <Route
              path="/products/:handle/:variantId/:optionId?"
              render={() => (
                <Blocks region="VariantDetailMain" blockProps={blockProps}>
                  {(blocks) =>
                    blocks.map((block, index) => (
                      <div className={classes.block} key={index}>
                        {block}
                      </div>
                    ))
                  }
                </Blocks>
              )}
            />
            <Route
              path="/products/:handle/"
              render={() => (
                <Blocks region="ProductDetailMain" blockProps={blockProps}>
                  {(blocks) =>
                    blocks.map((block, index) => (
                      <div className={classes.block} key={index}>
                        {block}
                      </div>
                    ))
                  }
                </Blocks>
              )}
            />
          </Switch>

        </Grid>
      </Grid>
    </Fragment>
  );
}

ProductDetail.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles, { name: "RuiProductDetail" })(ProductDetail);

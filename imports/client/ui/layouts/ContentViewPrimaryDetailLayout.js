/**
 * Component provides a regions for a primary (sidebar) and detail view
 */
import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import withStyles from "@material-ui/core/styles/withStyles";
import Button from "@reactioncommerce/catalyst/Button";
import { Blocks } from "@reactioncommerce/reaction-components";
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  IconButton,
  Typography
} from "@material-ui/core";
import CloseIcon from "mdi-material-ui/Close";
import useMediaQuery from "../hooks/useMediaQuery";


const styles = (theme) => ({
  root: {
    width: "100vw",
    background: "",
    flexGrow: 1,
    transition: "padding 225ms cubic-bezier(0, 0, 0.2, 1) 0ms"
  },
  block: {
    marginBottom: theme.spacing(3)
  },
  sidebar: {
    flex: "1 1 auto",
    maxWidth: 330,
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: "auto",
    borderRight: `1px solid ${theme.palette.divider}`
  },
  content: {
    flex: "1 1 auto",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`,
    overflowY: "auto",
    paddingTop: theme.spacing(5)
  },
  title: {
    flex: 1
  },
  leadingDrawerOpen: {
    ...theme.mixins.leadingPaddingWhenPrimaryDrawerIsOpen
  },
  trailingDrawerOpen: {
    ...theme.mixins.leadingPaddingWhenPrimaryDrawerIsOpen
  },
  drawerPaperAnchorBottom: {
    width: "100%",
    height: "100%"
  }
});

/**
 * Primary/Detail layout
 * @param {Object} props ComponentProps
 * @returns {React.ReactElement} A react element representing the primary/detail layout
 */
function ContentViewPrimaryDetailLayout(props) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const {
    AppBarComponent,
    DetailComponent,
    PrimaryComponent,
    children,
    classes,
    detailBlockRegionName,
    drawerTitle,
    isLeadingDrawerOpen,
    isTrailingDrawerOpen,
    primaryBlockRegionName,
    ...blockProps
  } = props;

  const isMobile = useMediaQuery("mobile");

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div
      className={
        classNames(classes.root, {
          [classes.leadingDrawerOpen]: isLeadingDrawerOpen,
          [classes.trailingDrawerOpen]: isTrailingDrawerOpen
        })
      }
    >
      {AppBarComponent}
      {isMobile &&
        <>
          <Toolbar>
            <Button
              fullWidth
              onClick={() => setDrawerOpen(true)}
            >
              {drawerTitle}
            </Button>
          </Toolbar>

          <Drawer
            anchor="bottom"
            classes={{
              paperAnchorBottom: classes.drawerPaperAnchorBottom
            }}
            open={isDrawerOpen}
            onClose={closeDrawer}
          >
            <AppBar
              color="default"
              elevation={0}
              position="sticky"
            >
              <Toolbar>
                <Typography className={classes.title} variant="h3">{drawerTitle}</Typography>
                <IconButton onClick={closeDrawer} size="small">
                  <CloseIcon />
                </IconButton>
              </Toolbar>
            </AppBar>
            {PrimaryComponent || <Blocks region={primaryBlockRegionName} blockProps={blockProps} />}
          </Drawer>
        </>
      }
      <Box display="flex">
        {!isMobile &&
          <div className={classes.sidebar}>
            {PrimaryComponent || <Blocks region={primaryBlockRegionName} blockProps={blockProps} />}
          </div>
        }

        <div className={classes.content}>
          {DetailComponent || <Blocks region={detailBlockRegionName} blockProps={blockProps} />}
        </div>
      </Box>
    </div>
  );
}

ContentViewPrimaryDetailLayout.propTypes = {
  AppBarComponent: PropTypes.node,
  DetailComponent: PropTypes.node,
  DetailContainerProps: PropTypes.object,
  PrimaryComponent: PropTypes.node,
  children: PropTypes.node,
  classes: PropTypes.object,
  detailBlockRegionName: PropTypes.string,
  drawerTitle: PropTypes.string.isRequired,
  isLeadingDrawerOpen: PropTypes.bool,
  isMobile: PropTypes.bool,
  isTrailingDrawerOpen: PropTypes.bool,
  primaryBlockRegionName: PropTypes.string
};

export default withStyles(styles, { name: "RuiContentViewPrimaryDetailLayout" })(ContentViewPrimaryDetailLayout);

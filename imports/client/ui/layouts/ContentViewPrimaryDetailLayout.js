/**
 * Component provides a regions for a primary (sidebar) and detail view
 */
import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Button from "@reactioncommerce/catalyst/Button";
import { Blocks } from "@reactioncommerce/reaction-components";
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  IconButton,
  makeStyles
} from "@material-ui/core";
import ChevronDownIcon from "mdi-material-ui/ChevronDown";
import useMediaQuery from "../hooks/useMediaQuery";
import { UIContext } from "../context/UIContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vw",
    height: "100vh",
    paddingTop: theme.mixins.toolbar.minHeight,
    flexGrow: 1,
    transition: "padding 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
    overflow: "hidden",
    [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
      paddingTop: 54
    },
    [`${theme.breakpoints.up("xs")} and (orientation: portrait)`]: {
      paddingTop: 54
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.mixins.toolbar.minHeight
    }
  },
  block: {
    marginBottom: theme.spacing(3)
  },
  drawerButton: {
    borderRadius: 0
  },
  sidebar: {
    flex: "1 1 auto",
    minWidth: 330,
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
    paddingLeft: theme.dimensions.drawerWidth
  },
  trailingDrawerOpen: {
    paddingRight: theme.dimensions.detailDrawerWidth
  },
  drawerPaperAnchorBottom: {
    width: "100%",
    height: "80%"
  }
}));

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
    detailBlockRegionName,
    drawerButtonTitle,
    primaryBlockRegionName,
    ...blockProps
  } = props;

  const classes = useStyles();
  const { isPrimarySidebarOpen, isDetailDrawerOpen } = useContext(UIContext);
  const isMobile = useMediaQuery("mobile");

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div
      className={
        classNames(classes.root, {
          [classes.leadingDrawerOpen]: isPrimarySidebarOpen && !isMobile,
          [classes.trailingDrawerOpen]: isDetailDrawerOpen && !isMobile
        })
      }
    >
      {AppBarComponent}
      {isMobile &&
        <>
          <Button
            color="default"
            disableElevation={true}
            className={classes.drawerButton}
            fullWidth
            onClick={() => setDrawerOpen(true)}
            variant="contained"
          >
            <ChevronDownIcon /> {drawerButtonTitle}
          </Button>

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
                <Box display="flex" justifyContent="center" width="100%">
                  <IconButton onClick={closeDrawer}>
                    <ChevronDownIcon />
                  </IconButton>
                </Box>
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
  detailBlockRegionName: PropTypes.string,
  drawerButtonTitle: PropTypes.string,
  isMobile: PropTypes.bool,
  primaryBlockRegionName: PropTypes.string
};

ContentViewPrimaryDetailLayout.defaultProps = {
  drawerButtonTitle: "More"
};

export default ContentViewPrimaryDetailLayout;

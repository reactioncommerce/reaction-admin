import React, { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { CustomPropTypes } from "@reactioncommerce/components/utils";
import { withComponents } from "@reactioncommerce/components-context";
import { makeStyles } from "@material-ui/core";
import PrimaryAppBar from "../components/PrimaryAppBar/PrimaryAppBar";
// import ProfileImageWithData from "../components/ProfileImageWithData";
import AccountDropdown from "../components/Entry/AccountDropdown";
import Sidebar from "../components/Sidebar";
import { UIContext } from "../context/UIContext";
import useOperatorRoutes from "../hooks/useOperatorRoutes";
import useMediaQuery from "../hooks/useMediaQuery";
import OperatorRoutes from "./OperatorRoutes";

const useStyles = makeStyles((theme) => ({
  "@global": {
    html: {
      // Remove the 10px fontSize from the html element as it affects fonts that rely on rem
      fontSize: "inherit"
    }
  },
  "container": {
    display: "flex"
  },
  "leftSidebarOpen": {
    ...theme.mixins.leadingPaddingWhenPrimaryDrawerIsOpen
  }
}));

/**
 * Main dashboard layout
 * @param {Object} props Component props
 * @returns {React.ReactElement} A react element representing the main dashboard
 */
function Dashboard(props) {
  const { viewer, refetchViewer } = props;
  const classes = useStyles();
  const isMobile = useMediaQuery("mobile");
  const routes = useOperatorRoutes();
  const [isDetailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [isPrimarySidebarOpen, setPrimarySidebarOpen] = useState(true);

  const onTogglePrimarySidebar = () => {
    setPrimarySidebarOpen((prevValue) => !prevValue);
  };

  const onToggleDetailDrawer = () => {
    setDetailDrawerOpen((prevValue) => !prevValue);
  };

  const onCloseDetailDrawer = () => {
    setDetailDrawerOpen(false);
  };

  const onClosePrimarySidebar = () => {
    setPrimarySidebarOpen(false);
  };

  const contextValue = useMemo(() => ({
    isDetailDrawerOpen,
    isMobile,
    isPrimarySidebarOpen: (isMobile && isPrimarySidebarOpen) || true,
    onClosePrimarySidebar,
    onTogglePrimarySidebar,
    onCloseDetailDrawer,
    onToggleDetailDrawer,
    setDetailDrawerOpen,
    setPrimarySidebarOpen
  }), [isDetailDrawerOpen, isMobile, isPrimarySidebarOpen]);

  return (
    <UIContext.Provider value={contextValue}>
      <div className={classes.container}>
        <PrimaryAppBar>
          <AccountDropdown size={40} viewer={viewer} refetchViewer={refetchViewer}/>
        </PrimaryAppBar>
        <Sidebar
          isMobile={isMobile}
          isSidebarOpen={isPrimarySidebarOpen}
          setIsSidebarOpen={(value) => {
            setPrimarySidebarOpen(value);
          }}
          onDrawerClose={onClosePrimarySidebar}
          viewer={viewer}
        />
        <OperatorRoutes
          isExactMatch={true}
          routes={routes}
        />
      </div>
    </UIContext.Provider>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object,
  components: PropTypes.shape({
    IconHamburger: CustomPropTypes.component.isRequired
  }),
  location: PropTypes.object,
  logout: PropTypes.func,
  refetchViewer: PropTypes.func,
  viewer: PropTypes.object,
  width: PropTypes.string
};

export default withComponents(Dashboard);

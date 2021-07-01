const Enzyme = require("enzyme");
const EnzymeAdapter = require("@wojtekmaj/enzyme-adapter-react-17");

// Setup enzyme react adapter
Enzyme.configure({ adapter: new EnzymeAdapter() });

process.on("unhandledRejection", (err) => {
  console.error("unhandledRejection:", err); // eslint-disable-line no-console
  process.exit(10); // eslint-disable-line no-process-exit
});

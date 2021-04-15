import envalid from "envalid";

const { num, str, bool } = envalid;

export default envalid.cleanEnv(process.env, {
  MOCK_TLS_TERMINATION: bool({
    default: false,
    desc: "The OAuth server requires 'X-Forwarded-Proto' header to be set to 'https'."
  }),
  PUBLIC_GRAPHQL_API_URL_HTTP: str({
    desc: "A URL that is accessible from browsers and accepts GraphQL POST requests over HTTP",
    example: "http://localhost:3000/graphql"
  }),
  PUBLIC_GRAPHQL_API_URL_WS: str({
    default: "",
    desc: "A URL that is accessible from browsers and accepts GraphQL WebSocket connections",
    example: "ws://localhost:3000/graphql"
  }),
  PUBLIC_FILES_BASE_URL: str({
    desc: "A URL that has /assets/files and /assets/uploads endpoints for uploading and downloading files",
    example: "http://localhost:3000"
  }),
  PUBLIC_I18N_BASE_URL: str({
    desc: "A URL that has /locales/namespaces.json and /locales/resources.json endpoints for loading translations",
    example: "http://localhost:3000"
  }),
  PUBLIC_STOREFRONT_HOME_URL: str({
    desc: "The URL for your storefront home page. This is only used as fallback if a URL isn't set for the shop.",
    example: "http://localhost:4000"
  }),
  REACTION_METEOR_APP_COMMAND_START_TIME: num({
    default: 0,
    desc: "Numeric time at which the command to start the server was run. As output by `Date.now()`. For logging how long startup took.",
    example: "1574809954951"
  }),
  ROOT_URL: str({
    desc: "The canonical root URL for the Reaction Admin server",
    example: "http://localhost:4080"
  })
});

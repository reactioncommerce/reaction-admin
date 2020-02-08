/**
 * Meteor hard fails right away if it can't connect to MongoDB.
 * Since we have no way of changing that, we run this script
 * first, which tries for 120 seconds to connect before failing.
 *
 * Usage:
 *   node waitForMongo.js && some command that need mongo
 */

const url = require("url");
const { MongoClient } = require("mongodb");

const WAIT_FOR_SECONDS = 120;

/**
 * Print a message to the console (no trailing newline)
 * @param {String} message User progress message to print
 * @returns {undefined}
 */
function defaultOut(message) {
  process.stdout.write(message);
}

/**
 * Run a check/wait/retry loop until a provided function returns a
 * promise that resolves.
 * @param {Object} options - Named options object
 * @param {function()} options.out Function to show progress
 * @param {number} options.max Number of retries attempted before full failure
 * @param {function():Promise} options.check async/Promise function that implements
 *   the main check operation. Throw an exception to cause a retry. Resolve the
 *   promise to indicate success.
 * @param {number} options.waitMs milliseconds to wait between checks
 * @param {String} options.timeoutMessage for final timeout
 * @returns {Promise} a promise indicating success/failure of the check
 */
async function checkWaitRetry({
  out = defaultOut,
  max = WAIT_FOR_SECONDS,
  check = null,
  waitMs = 1000,
  timeoutMessage = "Timed out waiting for a prerequisite"
} = {}) {
  const messages = new Set();
  /**
   * Show a progress/info message, but not over and over again
   *
   * @param {String} message to be printed
   * @param {number} count retry number for progress dots
   * @returns {undefined}
   */
  function showOnce(message, count) {
    if (!messages.has(message)) {
      messages.add(message);
      out(message);
    }
    if (count % 10 === 0) {
      out(".");
    }
  }
  return new Promise((resolve, reject) => {
    let count = 0;
    /**
     * Inner retry loop. Resolves/rejects the promise when done.
     *
     * @returns {undefined}
     */
    function loop() {
      count += 1;
      if (count >= max) {
        reject(new Error(timeoutMessage));
        return;
      }
      check()
        .then(resolve)
        .catch((error) => {
          showOnce(error.message, count);
          setTimeout(loop, waitMs);
        });
    }
    loop();
  });
}

/**
 * Connect to mongodb
 *
 * @param {Object} mongoUrl URL to mongodb server and database name
 * @returns {Promise} a promise resolving to the mongodb db instance
 */
async function connect(mongoUrl) {
  const client = await MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return client;
}

/**
 * Check if replication is ready
 *
 * @param {Object} db connected mongo db instance
 * @returns {Promise} indication of success/failure
 */
async function checkReplicaSetStatus(db) {
  const status = await db.admin().replSetGetStatus();
  if (status.ok !== 1) {
    throw new Error("Replica set not yet initialized");
  }
}

/**
 * Start the replica check/wait/retry loop
 * @returns {Promise} indication of success/failure
 */
async function main() {
  const { MONGO_URL } = process.env;
  if (!MONGO_URL) {
    throw new Error("You must set MONGO_URL environment variable.");
  }

  defaultOut("Waiting for MongoDB...\n");
  const client = await checkWaitRetry({
    timeoutMessage: "ERROR: MongoDB not reachable in time.",
    check: connect.bind(null, MONGO_URL)
  });
  defaultOut("MongoDB ready.\n");

  defaultOut("Waiting for MongoDB replica set...\n");
  await checkWaitRetry({
    timeoutMessage: "ERROR: MongoDB replica set not ready in time.",
    check: checkReplicaSetStatus.bind(null, client.db())
  });
  defaultOut("MongoDB replica set ready.\n");

  await client.close();
  process.exit();
}

/**
 * Print an error message and exit with nonzero exit code
 *
 * @param {Error} error cause of failure
 * @returns {undefined} exits the process
 */
function exit(error) {
  console.error(error.message); // eslint-disable-line no-console
  process.exit(10);
}

// Allow this module to be run directly as a node program or imported as lib
if (require.main === module) {
  process.on("unhandledRejection", exit);
  main().catch(exit);
}

module.exports = {
  checkWaitRetry
};

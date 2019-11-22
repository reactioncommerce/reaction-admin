import * as registeredCollections from "/lib/collections";

const collections = {};

for (const name in registeredCollections) {
  if ({}.hasOwnProperty.call(registeredCollections, name) && registeredCollections[name]) {
    if (typeof registeredCollections[name].rawCollection === "function") {
      collections[name] = registeredCollections[name].rawCollection();
    }
  }
}

export default collections;

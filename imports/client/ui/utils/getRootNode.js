/**
 * @name getRootNode
 * @summary Loads and returns element for #react-root
 * @returns {Object} DOM element for #react-root
 */
export default function getRootNode() {
  let rootNode = document.getElementById("react-root");

  if (rootNode) {
    return rootNode;
  }
  const rootNodeHtml = "<div id='react-root'></div>";
  const body = document.getElementsByTagName("body")[0];

  body.insertAdjacentHTML("beforeend", rootNodeHtml);
  rootNode = document.getElementById("react-root");

  return rootNode;
}

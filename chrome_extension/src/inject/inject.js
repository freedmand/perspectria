let currentNode = null;
let text = null;

document.addEventListener('mousedown', function(e) {
  if (currentNode != null) {
    const rect = currentNode.getBoundingClientRect();

    if (e.clientX  >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top && e.clientY <= rect.bottom) {
      comment();
    }
    currentNode.style.pointerEvents = 'none';
  }
});

document.addEventListener('mouseup', function() {
  if (currentNode != null) {
    currentNode.style.pointerEvents = '';
  }
});

document.addEventListener("selectionchange", function() {
  // Remove current selection node.
  if (currentNode != null) {
    currentNode.parentNode.removeChild(currentNode);
    currentNode = null;
    text = null;
  }

  const selection = window.getSelection();

  // Grab the start and end nodes and their offsets.
  const startNode = selection.anchorNode;
  const startPos = selection.anchorOffset;
  const endNode = selection.focusNode;
  const endPos = selection.focusOffset;

  if ((startNode == endNode && startPos == endPos) ||
      selection.type != 'Range' || selection.rangeCount != 1) {
    // Empty or invalid selection.
    return;
  }

  const range = selection.getRangeAt(0).cloneRange();
  // Set the text.
  text = range.toString();
  // Skip if the selection has no meaningful text.
  if (text.trim() == '') return;

  const parentElement = range.commonAncestorContainer;
  let el = parentElement;
  while (el && el.contentEditable != 'true') {
    el = el.parentElement;
  }
  if (el != null) return; // inside a content-editable; abort.



  // Get the bounding box of the range and the HTML element.
  const rect = range.getBoundingClientRect();
  const htmlRect = document.documentElement.getBoundingClientRect();

  // Create new selection node.
  currentNode = document.createElement('img');
  currentNode.src = chrome.extension.getURL('icons/perspectria_markup.png');
  currentNode.className = '_perspectria_markup';
  currentNode.style.left = `${rect.right - htmlRect.left}px`;
  currentNode.style.top = `${rect.top - htmlRect.top}px`;
  currentNode.style.pointerEvents = 'none';
  currentNode.addEventListener('click', comment);
  document.body.appendChild(currentNode);
});

function comment() {
  const commentary = prompt('Add your commentary:\n\n' + text);
  // Skip if cancel is pressed.
  if (commentary == null) return;

  console.log('You replied', commentary);
}

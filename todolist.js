$(document).ready(function() {

  var valueAfterDelay = function(value, interested) {
    setTimeout(function() {
      interested(value);
    }, 100);
  };

  var exampleList = [{
      name: "trekking poles",
      notes: "Should be collapsible into 3 or 4 sections to make stowage inside your rucksack easier. Expect to pay approx £80",
      urls: ["https://www.cotswoldoutdoor.com/c/equipment/walking-trekking-poles.html"]
    },
    {
      name: "crampon bag",
      notes: "Expect to pay approx £14",
      urls: []
    },
    {
      name: "snow/ski goggles",
      notes: "Look for OTG goggles. Dual pane (2 layer lenses) is recommended. Perhaps 30% VLT",
      urls: ["https://skitripguide.com/best-otg-goggles-for-skiing/", "https://www.glisshop.co.uk/accessories/goggles/otg/"]
    },
    {
      name: "waterproof gloves",
      notes: "At least two pairs are essential. They should be dexterous enough that you can put crampons on whilst wearing them. The Mountain Equipment Guide or similar is recommended. The Mountain Equipment gloves are £80 for one pair.",
      urls: ["https://www.wwarn.org"]
    },
    {
      name: "mid-layers",
      notes: "A couple of mid weight layers, ideally fleece, gives more flexibility for managing your temperature rather than one thick one.",
      urls: []
    },
  ];

  var listItems = document.querySelector("#listItems");
  var listName = document.querySelector("#listName");

  var updateNotesFor = function(itemId, newNotes) {
    exampleList.forEach( function update(listItem) {
      if ( encodeURIComponent(listItem.name) === itemId ) {
        listItem.notes = newNotes;
      }
    });
  };

  var createChildOf = function(parent, elementType, classNames, attributes) {
    var newElement = document.createElement(elementType);
    if (classNames) {
      classNames.forEach(function(name) {
        newElement.classList.add(name);
      });
    }
    if (attributes) {
      for (var p in attributes) {
        newElement.setAttribute(p, attributes[p]);
      }
    }
    parent.appendChild(newElement);
    return newElement;
  }

  var appendTextNodeTo = function(parent, text) {
    parent.appendChild(document.createTextNode(text));
  };

  var addListItem = function(listItem) {
    var isFirstItem = listItems.children.length == 0;
    var itemId = encodeURIComponent(listItem.name);
    var card = createChildOf(listItems, "div", ["card", "border-info", "mb-2"]);
    var cardHeader = createChildOf(card, "div", ["card-header"], {
      "role": "tab",
      "id": "heading-for-" + itemId
    });
    var heading = createChildOf(cardHeader, "h5", ["mb-0"]);
    var anchor = createChildOf(heading, "a", undefined, {
      "data-toggle": "collapse",
      "aria-controls": itemId,
      "href": "#" + itemId
    });
    appendTextNodeTo(anchor, listItem.name);
    var cardBlockContainer = createChildOf(card, "div", isFirstItem ? ["collapse", "show"] : ["collapse"], {
      "role": "tabpanel",
      "data-parent": "#listItems",
      "aria-labelledby": "heading-for-" + itemId,
      "id": itemId
    });
    var cardBlock = createChildOf(cardBlockContainer, "div", ["card-block"]);
    var cardBody = createChildOf(cardBlock, "div", ["card-body"]);
    var cardText = createChildOf(cardBody, "p", ["card-text"]);
    appendTextNodeTo(cardText, listItem.notes);
    listItem.urls.forEach( function(url) {
      var anchor = createChildOf(cardBody, "a", ["card-link", "d-block", "ml-0"], { "href": url });
      appendTextNodeTo(anchor, url);
    });
    var editButton = createChildOf(cardBody, "button", ["btn", "btn-primary"], {
      "type":"button",
      "data-toggle":"modal",
      "data-target": "#edit-" + itemId});
    appendTextNodeTo(editButton, "Edit");
    var modal = createChildOf(cardBody, "div", ["modal", "fade"], {
      "id": "edit-" + itemId });
    var modalDlg = createChildOf(modal, "div", ["modal-dialog"]);
    var modalContent = createChildOf(modalDlg, "div", ["modal-content"]);
    var modalHeader = createChildOf(modalContent, "div", ["modal-header"]);
    var modalTitle = createChildOf(modalHeader, "h5", ["modal-title"]);
    appendTextNodeTo(modalTitle, "Edit: " + listItem.name);
    var modalBody = createChildOf(modalContent, "div", ["modal-body"]);
    var form = createChildOf(modalBody, "form");
    var fieldset = createChildOf(form, "fieldset", ["form-group"]);
    var notesDiv = createChildOf(fieldset, "div", ["form-group"]);
    var label = createChildOf(notesDiv, "label", undefined, {
      "for": "edit-" + itemId + "-notes" });
    appendTextNodeTo(label, "notes");
    var textarea = createChildOf(notesDiv, "textarea", ["form-control"], {
      "id": "edit-" + itemId + "-notes" });
    appendTextNodeTo(textarea, listItem.notes);


    var modalFooter = createChildOf(modalContent, "div", ["modal-footer"]);
    var cancelButton = createChildOf(modalFooter, "button", ["btn", "btn-secondary"], {
      "data-dismiss":"modal"});
    appendTextNodeTo(cancelButton, "Cancel");
    var saveButton = createChildOf(modalFooter, "button", ["btn", "btn-secondary"], {
      "data-dismiss":"modal"});
    appendTextNodeTo(saveButton, "Save");
    saveButton.onclick = function(event) {
      updateNotesFor(itemId, textarea.value);
    };
  };

  var removeChildren = function(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  var layoutList = function(name, list) {
    removeChildren(listItems);
    removeChildren(listName);
    appendTextNodeTo(listName, name);
    listName.classList.remove("d-none");
    list.forEach(function(listItem) {
      addListItem(listItem);
    });
  };

  var showError = function(error) {
    alert(error);
  };

  var fetchList = function(listName) {
    return new Promise(function(succeed, fail) {
      valueAfterDelay([listName, exampleList], succeed);
    });
  };

  var addListOption = function(listName) {
    var dropdownMenuOfLists = document.querySelector(".dropdown-menu");
    var option = document.createElement("a");
    option.textContent = listName;
    option.classList.add("dropdown-item");
    dropdownMenuOfLists.appendChild(option);
  };

  var fetchListNames = function() {
    return new Promise(function(succeed, fail) {
      valueAfterDelay(["a", "b", "c"], succeed);
    });
  };

  fetchListNames().then(function(names) {
      names.forEach(function(name) {
        addListOption(name);
      });
    },
    function(error) {
      alert(error);
    });

  fetchList("Plas y Brenin Essentials").then(
    function(list) {
      layoutList(list[0], list[1]);
    },
    function(error) {
      showError(error);
    });

});

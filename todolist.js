$(document).ready(function() {

  let valueAfterDelay = function(value, interested) {
    setTimeout(function() {
      interested(value);
    }, 100);
  };

  let exampleList = [{
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

  let listItems = document.querySelector("#listItems");
  let listName = document.querySelector("#listName");

  let generateIdValueUsing = function(input) {
    const regex = /\W/ig;
    return "id" + input.replaceAll(regex, '');
  };

  let createChildOf = function(parent, elementType, classNames, attributes) {
    let newElement = document.createElement(elementType);
    if (classNames) {
      classNames.forEach(function(name) {
        newElement.classList.add(name);
      });
    }
    if (attributes) {
      for (let p in attributes) {
        newElement.setAttribute(p, attributes[p]);
      }
    }
    parent.appendChild(newElement);
    return newElement;
  }

  let appendTextNodeTo = function(parent, text) {
    parent.appendChild(document.createTextNode(text));
  };

  let addListItem = function(listItem) {
    let isFirstItem = listItems.children.length == 0;
    let itemId = generateIdValueUsing(listItem.name);
    let card = createChildOf(listItems, "div", ["card", "border-info", "mb-2"]);
    let cardHeader = createChildOf(card, "div", ["card-header"], {
      "role": "tab",
      "id": "heading-for-" + itemId
    });
    let heading = createChildOf(cardHeader, "h5", ["mb-0"]);
    let anchor = createChildOf(heading, "a", undefined, {
      "data-toggle": "collapse",
      "aria-controls": itemId,
      "href": "#" + itemId
    });
    appendTextNodeTo(anchor, listItem.name);
    let cardBlockContainer = createChildOf(card, "div", isFirstItem ? ["collapse", "show"] : ["collapse"], {
      "role": "tabpanel",
      "data-parent": "#listItems",
      "aria-labelledby": "heading-for-" + itemId,
      "id": itemId
    });
    let cardBlock = createChildOf(cardBlockContainer, "div", ["card-block"]);
    let cardBody = createChildOf(cardBlock, "div", ["card-body"]);
    let cardText = createChildOf(cardBody, "p", ["card-text"]);
    appendTextNodeTo(cardText, listItem.notes);
    let editButton = createChildOf(cardBody, "button", ["btn", "btn-primary", "mb-2"], {
      "type":"button",
      "data-toggle":"modal",
      "data-target": "#edit-" + itemId});
    appendTextNodeTo(editButton, "Edit");
    listItem.urls.forEach( function(url) {
      let anchor = createChildOf(cardBody, "a", ["card-link", "d-block", "ml-0"], { "href": url });
      appendTextNodeTo(anchor, url);
    });
    let modal = createChildOf(cardBody, "div", ["modal", "fade"], {
      "id": "edit-" + itemId });
    let modalDlg = createChildOf(modal, "div", ["modal-dialog"]);
    let modalContent = createChildOf(modalDlg, "div", ["modal-content"]);
    let modalHeader = createChildOf(modalContent, "div", ["modal-header"]);
    let modalTitle = createChildOf(modalHeader, "h5", ["modal-title"]);
    appendTextNodeTo(modalTitle, "Edit: " + listItem.name);
    let modalBody = createChildOf(modalContent, "div", ["modal-body"]);
    let form = createChildOf(modalBody, "form");
    let fieldset = createChildOf(form, "fieldset", ["form-group"]);
    let notesDiv = createChildOf(fieldset, "div", ["form-group"]);
    let label = createChildOf(notesDiv, "label", undefined, {
      "for": "edit-" + itemId + "-notes" });
    appendTextNodeTo(label, "notes");
    let textarea = createChildOf(notesDiv, "textarea", ["form-control"], {
      "id": "edit-" + itemId + "-notes" });
    appendTextNodeTo(textarea, listItem.notes);
    let modalFooter = createChildOf(modalContent, "div", ["modal-footer"]);
    let cancelButton = createChildOf(modalFooter, "button", ["btn", "btn-secondary"], {
      "data-dismiss":"modal"});
    appendTextNodeTo(cancelButton, "Cancel");
    let saveButton = createChildOf(modalFooter, "button", ["btn", "btn-secondary"], {
      "data-dismiss":"modal"});
    appendTextNodeTo(saveButton, "Save");
    let updateFunc = function() {
      listItem.notes = textarea.value;
      textarea.replaceChildren(listItem.notes);
      cardText.replaceChildren(listItem.notes);
    };
    saveButton.onclick = function(event) {
      updateFunc();
    };
    textarea.addEventListener("keydown", function(event) {
      if (event.key == "Enter") {
        saveButton.onclick.apply(saveButton);
        $("#" + modal.getAttribute("id")).modal('hide');
      }
    });
    $("#" + modal.getAttribute("id")).on('hidden.bs.modal', function (e) {
      window.setTimeout(() => anchor.focus(), 0);
    });
  };

  let layoutList = function(name, list) {
    listItems.replaceChildren();
    listName.replaceChildren(name);
    listName.classList.remove("d-none");
    list.forEach(function(listItem) {
      addListItem(listItem);
    });
  };

  let showError = function(error) {
    alert(error);
  };

  let fetchList = function(listName) {
    return new Promise(function(succeed, fail) {
      valueAfterDelay([listName, exampleList], succeed);
    });
  };

  let addListOption = function(listName) {
    let dropdownMenuOfLists = document.querySelector(".dropdown-menu");
    let option = document.createElement("a");
    option.textContent = listName;
    option.classList.add("dropdown-item");
    dropdownMenuOfLists.appendChild(option);
  };

  let fetchListNames = function() {
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

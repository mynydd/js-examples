"use strict";
// Documentation is loosely based on JSDoc (https://jsdoc.app/)
// Developed using Atom with the atom-termjs package.

(function() {
  let exampleList = [{
      id: 1,
      name: "trekking poles",
      notes: "Should be collapsible into 3 or 4 sections to make stowage inside your rucksack easier. Expect to pay approx £80",
      urls: ["https://www.cotswoldoutdoor.com/c/equipment/walking-trekking-poles.html"]
    },
    {
      id: 2,
      name: "crampon bag",
      notes: "Expect to pay approx £14",
      urls: []
    },
    {
      id: 3,
      name: "snow/ski goggles",
      notes: "Look for OTG goggles. Dual pane (2 layer lenses) is recommended. Perhaps 30% VLT",
      urls: ["https://skitripguide.com/best-otg-goggles-for-skiing/", "https://www.glisshop.co.uk/accessories/goggles/otg/"]
    },
    {
      id: 4,
      name: "waterproof gloves",
      notes: "At least two pairs are essential. They should be dexterous enough that you can put crampons on whilst wearing them. The Mountain Equipment Guide or similar is recommended. The Mountain Equipment gloves are £80 for one pair.",
      urls: ["https://www.wwarn.org"]
    },
    {
      id: 5,
      name: "mid-layers",
      notes: "A couple of mid weight layers, ideally fleece, gives more flexibility for managing your temperature rather than one thick one.",
      urls: []
    },
  ];

  /**
   * Asynchronously calls the 'interested' function
   * with 'value' as an argument, after a short delay.
   */
  let valueAfterDelay = function(value, interested) {
    setTimeout(function() {
      interested(value);
    }, 500);
  };

  /**
   * Create a child element of the specified type with the specified
   * class names and attributes.
   */
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

  /**
   * Creates a text node using the specified text
   * and appends it to the specified parent.
   */
  let appendTextNodeTo = function(parent, text) {
    parent.appendChild(document.createTextNode(text));
  };

  /**
   * Adds a form-group with a label and input control, with input control being passed to the initialiser callback
   * once constructed, returning an object with 'onSave' and 'onCancel' properties.
   * 'onSave' can be invoked without arguments and simply invokes the callMe callback with the current value of the
   * input control.
   * 'onCancel' requires an argument, specifically the value to which the input control should be reverted.
   */
  let addFormGroup = function(fieldset, id, inputControlType, labelText, value, initialiser, callMeOnSaveWithNewValue) {
    let formGroup = createChildOf(fieldset, "div", ["form-group"]);
    createChildOf(formGroup, "label", ["form-control-label"], {
      "for": id
    }).textContent = labelText;
    let inputControl = createChildOf(formGroup, inputControlType, ["form-control"], {
      "id": id
    });
    inputControl.value = value;
    initialiser(inputControl);
    return {
      "onSave": function() { callMeOnSaveWithNewValue(inputControl.value) },
      "onCancel": function(valueToRestore) { inputControl.value = valueToRestore; }
    };
  };

   /**
   * Adds the specified list item to the DOM. The listItem
   * object is expected to have the following properties: name
   * (string), notes (string), urls (array of strings).
   */
  let addListItemToDOM = function(listItem) {
    let listItems = document.getElementById("listItems");
    let isFirstItem = listItems.children.length == 0;
    let itemId = "item-" + listItem.id;
    let card = createChildOf(listItems, "div", ["card", "border-info", "mb-2"]);
    let cardHeader = createChildOf(card, "div", ["card-header"], {
      "role": "tab",
      "id": "heading-for-" + itemId
    });
    let heading = createChildOf(cardHeader, "h5", ["mb-0"]);
    let headingAnchor = createChildOf(heading, "a", undefined, {
      "data-toggle": "collapse",
      "aria-controls": itemId,
      "href": "#" + itemId
    });
    appendTextNodeTo(headingAnchor, listItem.name);
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
    listItem.urls.forEach(function(url) {
      let anchor = createChildOf(cardBody, "a", ["card-link", "d-block", "ml-0"], {
        "href": url
      });
      appendTextNodeTo(anchor, url);
    });
    let cardFooter = createChildOf(cardBlock, "div", [ "card-footer" ]);
    let editButton = createChildOf(cardFooter, "button", ["btn", "btn-primary", "mt-1"], {
      "type": "button",
      "data-toggle": "modal",
      "data-target": "#edit-" + itemId
    });
    appendTextNodeTo(editButton, "Edit");
    let modal = createChildOf(cardBody, "div", ["modal", "fade"], {
      "id": "edit-" + itemId
    });
    let modalDlg = createChildOf(modal, "div", ["modal-dialog"]);
    let modalContent = createChildOf(modalDlg, "div", ["modal-content"]);
    let modalBody = createChildOf(modalContent, "div", ["modal-body"]);
    let form = createChildOf(modalBody, "form");
    let fieldset = createChildOf(form, "fieldset", ["form-group"]);
    let nameFormGroup = addFormGroup(fieldset, "edit-name-" + itemId, "input", "name", listItem.name,
      function(inputControl) {
        inputControl.type = "text";
        //inputControl.addEventListener("input", buildNameInputListenerFunc(inputControl);
      },
      function(newValue) {
        listItem.name = newValue;
        headingAnchor.replaceChildren(newValue);
      });
    let notesFormGroup = addFormGroup(fieldset, "edit-notes-" + itemId, "textarea", "notes", listItem.notes,
      function(inputControl) {
        inputControl.addEventListener("keydown", function(event) {
          if (event.key == "Enter") {
            saveButton.onclick.apply(saveButton);
            $("#" + modal.getAttribute("id")).modal('hide');
          }
        });
      },
      function(newValue) {
        listItem.notes = newValue;
        cardText.replaceChildren(newValue);
      });
    let modalFooter = createChildOf(modalContent, "div", ["modal-footer"]);
    let cancelButton = createChildOf(modalFooter, "button", ["btn", "btn-secondary"], {
      "data-dismiss": "modal"
    });
    appendTextNodeTo(cancelButton, "Cancel");
    cancelButton.onclick = function(event) {
      nameFormGroup.onCancel(listItem.name);
      notesFormGroup.onCancel(listItem.notes);
    };
    let saveButton = createChildOf(modalFooter, "button", ["btn", "btn-secondary"], {
      "data-dismiss": "modal"
    });
    appendTextNodeTo(saveButton, "Save");
    saveButton.onclick = function(event) {
      nameFormGroup.onSave();
      notesFormGroup.onSave();
    };
    $("#" + modal.getAttribute("id")).on('hidden.bs.modal', function(e) {
      // Directly calling 'headingAnchor.focus()' wasn't working, so...
      window.setTimeout(() => headingAnchor.focus(), 0);
    });
  };

  /**
   * Expecting the list to be an array of objects each with a 'name', some 'notes' and some
   * 'urls', this function rebuilds the DOM representation of this list.
   */
  let layoutList = function(name, list) {
    let listHeaderChildren = document.querySelectorAll("#listHeader > *");
    Array.prototype.forEach.call(listHeaderChildren, function(listHeaderItem) {
      listHeaderItem.classList.remove("d-none");
    });
    let listItems = document.getElementById("listItems");
    let listName = document.getElementById("listName");
    listItems.replaceChildren();
    listName.replaceChildren(name);
    list.forEach(function(listItem) {
      addListItemToDOM(listItem);
    });
  };

  let showError = function(error) {
    alert(error);
  };

  /**
   * Returns a Promise to deliver a 2-element array in which the first element
   * is listName and the second is a list.
   * The list is a list of objects. Each object has a name, some notes and some urls.
   */
  let fetchList = function(listName) {
    return new Promise(function(succeed, fail) {
      valueAfterDelay([listName, exampleList], succeed);
    });
  };

  let addListOption = function(listName) {
    let dropdownMenuOfLists = document.querySelector(".dropdown-menu");
    let option = createChildOf(dropdownMenuOfLists, "a", ["dropdown-item"], { "href": "#" });
    option.textContent = listName;
    option.addEventListener("click", function(event) {
      fetchList(listName).then(
        function(list) {
          layoutList(list[0], list[1]);
        },
        function(error) {
          showError(error);
        });
    });
  };

  let fetchListNames = function() {
    return new Promise(function(succeed, fail) {
      valueAfterDelay(["Plas y Brenin Essentials"], succeed);
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

  let addListItemNameInputListener = function(event) {
    // It's inefficient to rebuild the 'taken' list every time
    // this function is called.
    // An alternative would be to build this function when
    // the 'add item' dialog is shown, building it with a snapshot of
    // the 'taken' names, at that point.
    let addListItemName = document.getElementById("addListItemName");
    let addListItemButton = document.getElementById("addListItemButton");
    let addListItemNameText = document.getElementById("addListItemNameText");
    let taken = exampleList.map(listItem => listItem.name);
    let candidateName = addListItemName.value.trim()
    if ( candidateName ) {
      if ( taken.indexOf(candidateName) > -1 ) {
        addListItemButton.classList.add("disabled");
        addListItemNameText.textContent = "A list item with this name already exists";
      }
      else {
        addListItemButton.classList.remove("disabled");
        // https://stackoverflow.com/questions/19347988/make-empty-div-of-one-line-height/43102506
        addListItemNameText.innerHTML = "&#8203;";
      }
    }
    else { // candidateName is empty
      addListItemButton.classList.add("disabled");
      addListItemNameText.textContent = "Mandatory";
    }
  };

  document.getElementById("addListItemName").addEventListener("input", addListItemNameInputListener );

  document.getElementById("addListItemButton").addEventListener("click", function(event) {
    let newListItem = {
      "id": exampleList.map( item => item.id ).reduce( (max, id) => id > max ? id : max, 0) + 1,
      "name":   document.getElementById("addListItemName").value.trim(),
      "notes":  document.getElementById("addListItemNotes").value.trim(),
      "urls": [ document.getElementById("addListItemUrl").value.trim() ]
    };
    exampleList.push(newListItem);
    addListItemToDOM(newListItem);
  });

  $("#addListItemModalDialog").on('hidden.bs.modal', function(e) {
    document.getElementById("addListItemName").value = "";
    document.getElementById("addListItemNameText").textContent = "Mandatory";
    document.getElementById("addListItemNotes").value = "";
    document.getElementById("addListItemUrl").value = "";
  });

})();

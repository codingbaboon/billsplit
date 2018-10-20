let numOwners = 0;
let itemsArray = [];
let ownersArray = [];
let runningTotal = 0.00;
let inputMode = false;

function onStart() {
    setEventsListener();
}

//Sets the initial event listeners
function setEventsListener() {
    //Event Listener: Will update number of owners when button is clicked.
    const OKbutton = document.getElementById("OKbutton");
    OKbutton.addEventListener("click", onOKButtonClick);
    /*Event Listener: When user clicks into input box, price of the item
    should change with user input*/
    const priceInput = document.querySelector(".item-price-input");
    document.addEventListener("change", (eventTarget) => {
        const className = eventTarget.srcElement.className;
        if (className && className.includes('item-price-input')) {
            getItemPrice(eventTarget.srcElement.id,
                eventTarget.srcElement.parentElement.childNodes[2]);
        }
    });
    //Event Listener: When user clicks on a checkbox, update the Item object's claims
    document.addEventListener("click", (eventTarget) => {
        const className = eventTarget.srcElement.className;
        if (className && className.includes('owner-option')) {
            updateClaims(eventTarget.srcElement);
        }
    });
    const addItemButton = document.getElementById("add-item-button");
    addItemButton.addEventListener("click", addItem);
    const calculateButton = document.getElementById("calculate-button");
    calculateButton.addEventListener("click", onCalculateButtonClick);
}


function onOKButtonClick() {
    getNumOwners();
    updateOwnersArray();
    createOwnerNames();
    setNameEventListeners();
}

function setNameEventListeners(){
    /*Event Listener: When user clicks on change name button, input element will become visible.
    Will allow user to type in a custom name*/

    /*Event Listener (part 1): Show the input field*/
    const renameOwnerButtonArray = document.querySelectorAll(".renameOwnerButton");
    for(let i=0; i<renameOwnerButtonArray.length; i++){
        renameOwnerButtonArray[i].addEventListener("click", (eventTarget)=>{
            const renameOwnerButtonId = eventTarget.srcElement.id;
            const idEnding = renameOwnerButtonId.replace("rename-ownerName-button-","");
            console.log("idEnding: " + idEnding);
            showInputField(idEnding);
        });
    }
    /*Event Listener (part 2): update the owner name when input field changes*/
    const nameInputArray = document.querySelectorAll(".name-input");
    for(let i=0; i<nameInputArray.length; i++){
        nameInputArray[i].addEventListener("change", (eventTarget)=>{
            const nameInputId = eventTarget.srcElement.id;
            const idEnding = nameInputId.replace("name-input-","");
            updateOwnerName(idEnding);
        });
    }
}

function showInputField(idEnding) {
    inputMode = true;
    const targetInputElem = document.getElementById("name-input-" + idEnding); 
    //changes input type from hidden to text 
    targetInputElem.type = "text";
}
    
function updateOwnerName(idEnding){
    //Update owner name being displayed
    //In owner summary at top
    const targetNameSpan = document.getElementById("owner-name-" + idEnding); 
    const inputtedName = document.getElementById("name-input-" + idEnding);
    targetNameSpan.textContent = inputtedName.value;
    hideInputField(idEnding);
    //Update owner name under each Item section
    //query selector sequence (all list items in class owners-list)
    /*TO DO: make this more space efficient later
    Currently takes all LI items even though we are ony updating a few 
    (array gets longer with every item added)
    Additionally, we remake the array from scratch */
    if(itemsArray.length > 0){
        const increment = parseInt(numOwners);
        let ownerLIArray = document.querySelectorAll("#owners-list li span");
        for(let i=parseInt(idEnding)-1; i<ownerLIArray.length; i += increment){
            // console.log(ownerLIArray.length);
            // console.log("i: " + i);
            // console.log("i < length: " + (i<ownerLIArray.length));
            // console.log("increment: " + (increment));
            ownerLIArray[i].textContent = inputtedName.value;
        }
    }
    //Update owner's nickname in Owner object
    ownersArray[idEnding-1].nickname = inputtedName.value;
}

function hideInputField(idEnding){
    const targetInputSpan = document.getElementById("name-input-" + idEnding);
    targetInputSpan.type = "hidden";
}

function onCalculateButtonClick() {
    calculate();
    displaySummary();
}

function getNumOwners() {
    numOwners = document.getElementById("num-owners").value;
    console.log(numOwners);
    document.getElementById("owners-result").textContent = numOwners;
}

function updateOwnersArray() {
    for (let i = 0; i < numOwners; i++) {
        ownersArray.push(new Owner(i + 1));
    }

}

function createOwnerNames() {
    const targetElement = document.getElementById("owner-names-list");
    for (let i = 0; i < numOwners; i++) {
        //display default names (Person 1, Person 2)
        const newLI = document.createElement("li");
        const newSpan = document.createElement("span");
        newSpan.className = "owner-name";
        newSpan.id = "owner-name-" + (i + 1);
        newSpan.textContent = ownersArray[i].nickname;

        //create input element for user to type in a new owner name
        const newNameInput = document.createElement("input");
        newNameInput.type = "hidden";
        newNameInput.className = "name-input";
        newNameInput.id = "name-input-" + (i + 1);
        newNameInput.placeholder = "Person " + (i + 1);

        //create "change name" button to rename owners
        const renameOwnerButton = document.createElement("button");
        renameOwnerButton.className = "renameOwnerButton";
        renameOwnerButton.id = "rename-ownerName-button-" + (i+1);
        renameOwnerButton.textContent = "Rename";

        newLI.appendChild(newNameInput);
        newLI.appendChild(newSpan);
        newLI.appendChild(renameOwnerButton);
        targetElement.appendChild(newLI);
    }
}

function getItemPrice(inputID, textElement) {
    //Display inputted item price
    const inputElement = document.getElementById(inputID);
    const price = inputElement.value;
    textElement.textContent = `$${price}`;

    //Update the price in the Item Object
    const inputIDStr = inputID.replace("priceinput", "");
    const itemIndex = parseInt(inputIDStr, 10) - 1;
    itemsArray[itemIndex].price = price;

    //update the running total)
    updateRunningTotal(price);
}

function addItem() {
    //add Item object to the Items Array
    const itemID = (itemsArray.length + 1);
    itemsArray.push(new Item(itemID, numOwners));
    //create the wapper div
    let newDiv = document.createElement("div");
    newDiv.id = "item" + itemID;
    newDiv.className = "item-wrap";
    //create the h4 header (item name)
    const newH4 = document.createElement("h4");
    newH4.className = "item-header";
    newH4.textContent = "Item " + (itemsArray.length);
    //create the user input element (for price)
    const newInput = document.createElement("input");
    newInput.className = "item-price-input";
    newInput.id = "priceinput" + itemsArray.length;
    newInput.setAttribute("type", "number");
    newInput.setAttribute("placeholder", "Enter item price");
    //create the span element (to display inputted price)
    const newSpan = document.createElement("span");
    newSpan.className = "item-price";
    //create the owner options section
    const newOwnersDiv = makeOwnerSection();
    //add all new elements to to the webpage
    newDiv.appendChild(newH4);
    newDiv.appendChild(newInput);
    newDiv.appendChild(newSpan);
    newDiv.appendChild(newOwnersDiv);
    const addItemButton = document.getElementById("add-item-button")
    document.body.insertBefore(newDiv, addItemButton);
}

function makeOwnerSection() {
    //create the owner options (Goes under each item)
    const newOwnersDiv = document.createElement("div");
    newOwnersDiv.className = "owners-wrap";
    const newUL = document.createElement("ul");
    newUL.id = "owners-list";
    for (let i = 0; i < numOwners; i++) {
        const newListItem = document.createElement("li");
        const newSpan = document.createElement("span");
        const newCheckbox = document.createElement("input");
        newCheckbox.type = "checkbox";
        newCheckbox.className = "owner-option"
        newCheckbox.value = "owner" + (i + 1);
        newSpan.textContent = ownersArray[i].nickname;
        newListItem.appendChild(newCheckbox);
        newListItem.appendChild(newSpan);
        newUL.appendChild(newListItem);
    }
    newOwnersDiv.appendChild(newUL);

    return newOwnersDiv;
}

function updateClaims(inputElement) {
    const itemIndexStr = inputElement.closest(".item-wrap").id.replace("item", "");
    const itemIndex = parseInt(itemIndexStr) - 1;

    const inputValueStr = inputElement.value.replace("owner", "");
    const claimsIndex = parseInt(inputValueStr) - 1;

    const targetItem = itemsArray[itemIndex];

    if (inputElement.checked) {
        targetItem.claimed[claimsIndex] = 1;
        targetItem.numClaimers += 1;
    } else {
        targetItem.claimed[claimsIndex] = 0;
        targetItem.numClaimers -= 1;
    }
}

function calculate() {
    resetOwnerTotals();
    for (let i = 0; i < itemsArray.length; i++) {
        const targetItem = itemsArray[i];
        const allocPrice = targetItem.price / targetItem.numClaimers;

        for (let j = 0; j < targetItem.claimed.length; j++) {
            if (targetItem.claimed[j] > 0) {
                ownersArray[j].total += allocPrice;
                ownersArray[j].claimedItems.push([targetItem, allocPrice]);
            }
        }

    }

    console.log(ownersArray);
}

function resetOwnerTotals() {
    for (let i = 0; i < ownersArray.length; i++) {
        const owner = ownersArray[i];
        owner.resetTotal();
        owner.resetClaimedItems();
    }
}

function updateRunningTotal(itemPrice) {
    runningTotal += parseFloat(itemPrice);
    console.log(runningTotal);
    const targetElement = document.getElementById("running-total");
    targetElement.textContent = `$${runningTotal}`;

}

function displaySummary() {
    const newWrapperDiv = document.createElement("div");
    newWrapperDiv.id = "summary";
    for (let i = 0; i < ownersArray.length; i++) {
        const targetOwner = ownersArray[i];

        const newDiv_owner = document.createElement("div");
        newDiv_owner.className = "owner-div";

        const newSpan_name = document.createElement("span");
        newSpan_name.className = "nickname-span";
        newSpan_name.textContent = targetOwner.nickname + ": ";

        const newSpan_ownerTotal = document.createElement("span")
        newSpan_ownerTotal.className = "ownerTotal-span";
        newSpan_ownerTotal.textContent = `$${targetOwner.total}`;

        const newUL_claimedItems = document.createElement("ul");
        for (let j = 0; j < targetOwner.claimedItems.length; j++) {
            const newLI_item = document.createElement("li");
            const targetClaimedItem = targetOwner.claimedItems[j];
            newLI_item.textContent = targetClaimedItem[0].itemName + " - $" + targetClaimedItem[1]
            newUL_claimedItems.appendChild(newLI_item);
        }

        newDiv_owner.appendChild(newSpan_name);
        newDiv_owner.appendChild(newSpan_ownerTotal);
        newDiv_owner.appendChild(newUL_claimedItems);
        newWrapperDiv.appendChild(newDiv_owner);
    }
    document.getElementById("summary-wrapper").innerHTML = "";
    document.getElementById("summary-wrapper").appendChild(newWrapperDiv);
}



window.onload = onStart;
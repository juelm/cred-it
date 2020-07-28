// get the buttons by id
let aliceblue = document.getElementById('aliceblue');
let cornsilk = document.getElementById('cornsilk');
let reset = document.getElementById('reset');

let submitBtn = document.getElementById("submitBtn");
let subNameInput = document.getElementById("sub-name");
let cardNumberInput = document.getElementById("cardNumber");
let cardExpiryInput = document.getElementById("cardExpiry");
let cardCVCInput = document.getElementById("cardCVC");
let db;

var currTarget = "---";

// use tabs.insertCSS to change header color on button click

const source = document.querySelector("#card-type");
const target1 = document.querySelector(".existing-cards");
const target2 = document.querySelector(".new-cards")

const displayExistingCardsWhenSelected = (source, value, target1) => {
    const selectedIndex = source.selectedIndex;
    const isSelected = source[selectedIndex].value === value;
    currTarget = (isSelected) ? "existingCard" : currTarget;
    target1.classList[isSelected
        ? "add"
        : "remove"
    ]("show");
};
const displayNewCardsWhenSelected = (source, value, target2) => {
    const selectedIndex = source.selectedIndex;
    const isSelected = source[selectedIndex].value === value;
    currTarget = (isSelected) ? "newCard" : currTarget;
    target2.classList[isSelected
        ? "add"
        : "remove"
    ]("show");
};

source.addEventListener("change", (evt) =>
displayExistingCardsWhenSelected(source, "existing", target1)
);
source.addEventListener("change", (evt) =>
displayNewCardsWhenSelected(source, "new-option", target2)
);

window.onload = function() {
    // document.getElementById('sub-name').value = browser.tabs.getCurrent();
    let request = window.indexedDB.open('cred_it_db', 1);
    request.onerror = function() {
        console.log('Database failed to open');
    };
    
    request.onsuccess = function() {
        console.log('Database opened successfully');
        db = request.result;
        printStoredSites();
    };

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('cred_it_os', { keyPath: 'id', autoIncrement:true });
      
        objectStore.createIndex('subName', 'subName', { unique: false });
        objectStore.createIndex('cardNumber', 'cardNumber', { unique: false });
        objectStore.createIndex('cardExpiry', 'cardExpiry', { unique: false });
        objectStore.createIndex('cardCVC', 'cardCVC', { unique: false });
      
        console.log('Database setup complete');
    };
    
};

submitBtn.addEventListener("click", function(e) {
    if (currTarget === "newCard") {
        addItem()
    }
});

function addItem() {
    if (subNameInput.value === "" || cardNumberInput.value === "" || cardExpiryInput.value === "" || cardCVCInput.value === "") {
        console.log("Values cannot be empty");
        return;
    }

    let newItem = { subName: subNameInput.value, cardNumber: cardNumberInput.value, cardExpiry: cardExpiryInput.value, cardCVC: cardCVCInput.value };
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
  
    let request = objectStore.add(newItem);
    request.onsuccess = function() {
        subNameInput.value = "";
        cardNumberInput.value = "";
        cardExpiryInput.value = "";
        cardCVCInput.value = "";
    };
  
    transaction.oncomplete = function() {
      console.log('Transaction completed: Successfully added new item to database.');
    };
  
    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };
}

function deleteItem(itemId) {
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
    let request = objectStore.delete(itemId);
  
    transaction.oncomplete = function() {
      console.log('Item ' + itemId + ' deleted.');
    };
}

async function printStoredSites() {
    let objectStore = db.transaction('cred_it_os').objectStore('cred_it_os');
    let list = document.getElementById('card-list');
    objectStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
        
        if(cursor) {
            const listItem = document.createElement('li');
            const h3 = document.createElement('h3');
            const p = document.createElement('p')
            h3.textContent = cursor.value.subName;
            p.textContent = cursor.value.cardNumber;
            listItem.appendChild(h3);
            listItem.appendChild(p);
            list.appendChild(listItem);
            console.log(cursor.value);

            cursor.continue();
        }
    }
}



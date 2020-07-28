// get the buttons by id
let aliceblue = document.getElementById('aliceblue');
let cornsilk = document.getElementById('cornsilk');
let reset = document.getElementById('reset');

let submitBtn = document.getElementById("submitBtn");
let subNameInput = document.getElementById("sub-name");
let cardNumberInput = document.getElementById("cardNumber");
let cardExpiryInput = document.getElementById("cardExpiry");
let cardCVCInput = document.getElementById("cardCVC");
let cardNicknameInput = document.getElementById("cardNickname");
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
    let request = window.indexedDB.open('cred_it_db', 1);
    request.onerror = function() {
        console.log('Database failed to open');
    };
    
    request.onsuccess = function() {
        console.log('Database opened successfully');
        db = request.result;
        getExistingCards();
    };

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('cred_it_os', { keyPath: 'id', autoIncrement:true });
      
        objectStore.createIndex('cardNickname', 'cardNickname', { unique: true });
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

    if (cardNumberInput.value.length != 16 || cardNumberInput.value.match(/^[0-9]+$/) == null) {
        console.log("Invalid card number");
        return;
    }

    let nicknameValue = (cardNicknameInput.value === "") ? getCardType(cardNumberInput.value).toUpperCase() + " " + cardNumberInput.value.substring(12) : cardNicknameInput.value;

    let newItem = { cardNickname: nicknameValue, subName: subNameInput.value, cardNumber: cardNumberInput.value, cardExpiry: cardExpiryInput.value, cardCVC: cardCVCInput.value };
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
  
    let request = objectStore.add(newItem);
    request.onsuccess = function() {
        subNameInput.value = "";
        cardNumberInput.value = "";
        cardExpiryInput.value = "";
        cardCVCInput.value = "";
        cardNicknameInput.value = "";
    };
  
    transaction.oncomplete = function() {
      console.log('Transaction completed: Successfully added new item to database.');
    };
  
    transaction.onerror = function() {
      console.log('Transaction not opened due to error');
    };

    window.location.reload();
}

function getCardType(number) {
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5018|5020|5038|5612|5893|6304|6759|6761|6762|6763|0604|6390)\d+$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
    };

    for(var key in re) {
        if(number.match(re[key]) != null) {
            return key;
        }
    }

    return "newtype";
}

async function getExistingCards() {
    let objectStore = db.transaction('cred_it_os').objectStore('cred_it_os');
    let select = document.getElementById('existing-cards-select');
    objectStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
        
        if(cursor) {
            const optionItem = document.createElement('option');
            optionItem.textContent = cursor.value.cardNickname + " ****" + cursor.value.cardNumber.substring(12);
            select.appendChild(optionItem);
            console.log(cursor.value);

            cursor.continue();
        }
    }
}

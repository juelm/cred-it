let submitBtn = document.getElementById("submitBtn");
let subNameInput = document.getElementById("sub-name");
let cardNumberInput = document.getElementById("cardNumber");
let cardExpiryInput = document.getElementById("cardExpiry");
let cardCVCInput = document.getElementById("cardCVC");
let cardNicknameInput = document.getElementById("cardNickname");
let db;

window.onload = function() {
    let request = window.indexedDB.open('cred_it_db', 1);
    request.onerror = function() {
        console.log('Database failed to open');
    };
    
    request.onsuccess = function() {
        console.log('Database opened successfully');
        db = request.result;
        getCurrentCardData();
    };
    
};

async function getCurrentCardData() {
    let cardId = Number(localStorage.getItem('updateCardId'));
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
  
    let request = objectStore.get(cardId);
    request.onsuccess = function(e) {
        console.log(request);
        subNameInput.value = request.result.subName;
        cardNumberInput.value = request.result.cardNumber;
        cardExpiryInput.value = request.result.cardExpiry;
        cardCVCInput.value = request.result.cardCVC;
        cardNicknameInput.value = request.result.cardNickname;
    }
}

submitBtn.addEventListener("click", function(e) {
    deleteAndAddItem();
});

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

function deleteAndAddItem() {
    if (subNameInput.value === "" || cardNumberInput.value === "" || cardExpiryInput.value === "" || cardCVCInput.value === "") {
        console.log("Values cannot be empty");
        return;
    }

    if (cardNumberInput.value.length != 16 || cardNumberInput.value.match(/^[0-9]+$/) == null) {
        console.log("Invalid card number");
        return;
    }
    let cardId = Number(localStorage.getItem('updateCardId'));
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
    let request = objectStore.delete(cardId);
  
    transaction.oncomplete = function() {
        console.log("Card with id " + cardId + " is successfully deleted");
        addItem();
    };
}

function addItem() {
    let nicknameValue = (cardNicknameInput.value === "") ? getCardType(cardNumberInput.value).toUpperCase() + " " + cardNumberInput.value.substring(12) : cardNicknameInput.value;
    
    let newItem = { cardNickname: nicknameValue, subName: subNameInput.value, cardNumber: cardNumberInput.value, cardExpiry: cardExpiryInput.value, cardCVC: cardCVCInput.value };
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
  
    let request = objectStore.add(newItem);
    request.onsuccess = function(e) {
        localStorage.setItem('updateCardId', request.result);
    }

    transaction.oncomplete = function() {
        console.log('Transaction completed: Successfully updated item in database.');
        window.history.back();
    };
    
    transaction.onerror = function() {
        console.log('Transaction not opened due to error');
    };
}

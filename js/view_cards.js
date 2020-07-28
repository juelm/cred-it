window.onload = function() {
    let request = window.indexedDB.open('cred_it_db', 1);
    request.onerror = function() {
        console.log('Database failed to open');
    };
    
    request.onsuccess = function() {
        console.log('Database opened successfully');
        db = request.result;
        printStoredSites();
    };
    
};

async function printStoredSites() {
    console.log("opening")
    let objectStore = db.transaction('cred_it_os').objectStore('cred_it_os');
    let list = document.getElementById('card-list');
    let select = document.getElementById('existing-cards-select');
    objectStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
    
        if(cursor) {
            const optionItem = document.createElement('option');
            const listItem = document.createElement('li');
            const subName = document.createElement('h3');
            const cardNumber = document.createElement('p')
            const cardNickname = document.createElement('p')
            subName.textContent = cursor.value.subName;
            cardNumber.textContent = cursor.value.cardNumber;
            cardNickname.textContent = cursor.value.cardNickname;
            
            optionItem.textContent = cursor.value.cardNickname + " " + cursor.value.cardNumber.substring(12);
            listItem.appendChild(subName);
            listItem.appendChild(cardNumber);
            listItem.appendChild(cardNickname);
            list.appendChild(listItem);
            select.appendChild(optionItem);
            console.log(cursor.value);

            cursor.continue();
        }
    }
}


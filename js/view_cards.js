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
            const h3 = document.createElement('h3');
            const p = document.createElement('p')
            h3.textContent = cursor.value.subName;
            p.textContent = cursor.value.cardNumber;
            optionItem.textContent = cursor.value.cardNickname + " " + cursor.value.cardNumber.substring(12);
            listItem.appendChild(h3);
            listItem.appendChild(p);
            list.appendChild(listItem);
            select.appendChild(optionItem);
            console.log(cursor.value);

            cursor.continue();
        }
    }
}
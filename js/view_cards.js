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
    objectStore.openCursor().onsuccess = function(e) {
        let cursor = e.target.result;
    
        if(cursor) {
            const listItem = document.createElement('li');
            const h3 = document.createElement('h3');
            const p = document.createElement('p');
            const cardNickname = document.createElement('p')
            const deleteBtn = document.createElement('button');

            listItem.setAttribute('card-id', cursor.value.id);

            h3.textContent = cursor.value.subName;
            p.textContent = cursor.value.cardNumber;
            cardNickname.textContent = cursor.value.cardNickname;
            deleteBtn.textContent = 'Delete';

            deleteBtn.onclick = deleteItem;

            listItem.appendChild(h3);
            listItem.appendChild(p);
            listItem.appendChild(cardNickname);
            listItem.appendChild(deleteBtn);
            list.appendChild(listItem);
            console.log(cursor.value);

            cursor.continue();
        }
    }
}

function deleteItem(e) {
    let cardId = Number(e.target.parentNode.getAttribute('card-id'));
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
    let request = objectStore.delete(cardId);
  
    transaction.oncomplete = function() {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log("Card with id " + cardId + " is successfully deleted");
        window.location.reload();
    };
}

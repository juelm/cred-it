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
            for (var i = 0; i < cursor.value.subs.length; i++){
                const subName = cursor.value.subs[i];
                const listItem = document.createElement('li');
                const h3 = document.createElement('h3');
                const p = document.createElement('p');
                const cardNickname = document.createElement('p');
                const updateBtn = document.createElement('button');
                const deleteBtn = document.createElement('button');

                listItem.setAttribute('card-id', cursor.value.id);
                listItem.setAttribute('sub-id', i);

                h3.textContent = subName;
                p.textContent = cursor.value.cardNumber;
                cardNickname.textContent = cursor.value.cardNickname;
                updateBtn.textContent = 'Update';
                deleteBtn.textContent = 'Delete';

                updateBtn.onclick = redirectToUpdatePage;
                deleteBtn.onclick = deleteItem;

                listItem.appendChild(h3);
                listItem.appendChild(p);
                listItem.appendChild(cardNickname);
                listItem.appendChild(updateBtn);
                listItem.appendChild(deleteBtn);
                list.appendChild(listItem);
            }
            console.log(cursor.value);

            cursor.continue();
        }
    }
}

function redirectToUpdatePage(e) {
    let cardId = Number(e.target.parentNode.getAttribute('card-id'));
    let subId = Number(e.target.parentNode.getAttribute('sub-id'));
    localStorage.setItem('updateCardId', cardId);
    localStorage.setItem('updateSubId', subId);
    location.href = '../popup/update_card.html';
}

function deleteItem(e) {
    let cardId = Number(e.target.parentNode.getAttribute('card-id'));
    let subId = Number(e.target.parentNode.getAttribute('sub-id'));
    let transaction = db.transaction(['cred_it_os'], 'readwrite');
    let objectStore = transaction.objectStore('cred_it_os');
    let request = objectStore.get(cardId);

    request.onsuccess = function() {
        request.result.subs.splice(subId, 1);
        if (request.result.subs.length === 0) {
            objectStore.delete(cardId);
        } else {
            objectStore.put(request.result);
        }
    }
  
    transaction.oncomplete = function() {
        e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        console.log("Subscription is successfully deleted");
        window.location.reload();
    };
}

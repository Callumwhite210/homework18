//using activity 26 from week 17 of bootcamp as a base for the code...
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

//db request for buget database
const request = indexedDB.open("budget", 1);

//creating an object store called pending that autoincrements 
request.onupgradeneeded = function(event) {
    const db = event.target.result;
    db.createObjectStore("pending", {autoIncrement: true});
}

//Checking to see if app is onling before reading the database
request.onsuccess = function(event){
    db = event.target.result;

    if (navigator.onLine){
        checkDatabase();
    }
};

//Runs when error occures with the error code 
request.onerror = function(event) {
    console.log("Error!" + event.target.errorCode);
};

function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");
  
    // access your pending object store
    const store = transaction.objectStore("pending");
  
    // add record to your store with add method.
    store.add(record);
  }
  
  function checkDatabase() {
    // open a transaction on your pending db
    const transaction = db.transaction(["pending"], "readwrite");
    // access your pending object store
    const store = transaction.objectStore("pending");
    // get all records from store and set to a variable
    const getAll = store.getAll();
  
    getAll.onsuccess = function () {
      if (getAll.result.length > 0) {
        fetch("/api/transaction/bulk", {
          method: "POST",
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then(() => {
            // if successful, open a transaction on your pending db
            const transaction = db.transaction(["pending"], "readwrite");
  
            // access your pending object store
            const store = transaction.objectStore("pending");
  
            // clear all items in your store
            store.clear();
          });
      }
    };
  }
  
  // listen for app coming back online
  window.addEventListener("online", checkDatabase);

  //end of code used from activity 26 week 17
  

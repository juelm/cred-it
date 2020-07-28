// get the buttons by id
let aliceblue = document.getElementById('aliceblue');
let cornsilk = document.getElementById('cornsilk');
let reset = document.getElementById('reset');

// use tabs.insertCSS to change header color on button click

const source = document.querySelector("#card-type");
const target1 = document.querySelector(".existing-cards");
const target2 = document.querySelector(".new-cards")

const displayExistingCardsWhenSelected = (source, value, target1) => {
    const selectedIndex = source.selectedIndex;
    const isSelected = source[selectedIndex].value === value;
    target1.classList[isSelected
        ? "add"
        : "remove"
    ]("show");
};
const displayNewCardsWhenSelected = (source, value, target2) => {
    const selectedIndex = source.selectedIndex;
    const isSelected = source[selectedIndex].value === value;
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
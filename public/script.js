let timerId;
let localObj;
let messageContainer = document.querySelector(".message_container")

function CreateCard(obj) {
    let date = new Date(obj.time);

    let card = document.createElement("div");
    card.innerHTML = `
    <div class="message_card">
        <div class="user_name">${obj.name}</div>
        <div class="message_text">${obj.text}</div>
        <div class="message_date">${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</div>
    </div>
    `
    messageContainer.append(card)
}

const Condition = (obj) => {
    if (JSON.stringify(localObj) !== JSON.stringify(obj)) {
        localObj = Object.assign({}, obj)
        return true
    }
    return false
}

async function GetMessage() {
    const response = await fetch("/api/getMessage", {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });
    if (response.ok === true) {
        let obj = await response.json();
        console.log(obj);
        if (Condition(obj)) {
            CreateCard(obj);
        }
        else {
            return;
        }   
    }
    else {
        clearInterval(timerId)
    }
}

timerId = setInterval(() => {
    GetMessage();
}, 5000)
let timerId;
let flag = false;
let localId = 0;
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

const Condition = (id) => {
    if (localId !== id) {
        localId = id;
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
        if (Condition(obj.id)) {
            CreateCard(obj);
        }
        else {
            return;
        }   
    }
    else {
        flag = true;
    }
}

timerId = setInterval(() => {
    if(flag){
        clearTimer();
    }
    GetMessage();
}, 1000)

const clearTimer = () => {
    clearInterval(timerId);
}
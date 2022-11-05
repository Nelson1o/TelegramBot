let timerId;
let flag = false;
let localId = 0;
const messageContainer = document.querySelector('.message_container');

function CreateCard(obj) {
    const date = new Date(obj.time);

    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    if (hours < 10) {
        hours = '0' + hours;
    }
    else if (minutes < 10) {
        minutes = '0' + minutes;
    }
    else if (seconds < 10) {
        seconds = '0' + seconds;
    }

    const card = document.createElement('div');
    card.innerHTML = `
    <div class="message_card">
        <div class="user_name">${obj.name}</div>
        <div class="message_text">${obj.text}</div>
        <div class="message_date">${hours}:${minutes}:${seconds}</div>
    </div>
    `;
    messageContainer.append(card);
}

const Condition = (id) => {
    if (localId !== id) {
        localId = id;
        return true;
    }
    return false;
};

async function GetMessage() {
    const response = await fetch('/api/getMessage', {
        method: 'GET',
        headers: { Accept: 'application/json' },
    });
    if (response.ok === true) {
        const obj = await response.json();
        if (Condition(obj.id)) {
            CreateCard(obj);
        }
    }
    else {
        flag = true;
    }
}

const clearTimer = () => {
    clearInterval(timerId);
};

timerId = setInterval(() => {
    if (flag) {
        clearTimer();
    }
    GetMessage();
}, 1000);

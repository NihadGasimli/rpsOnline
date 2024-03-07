import db from './firebase.mjs';

import { get, set, ref, onValue, push, remove } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";

const user_input = document.querySelector(".user_input");
const user_btn = document.querySelector(".user_btn");
const inp = document.querySelector(".inp");
const sendBtn = document.querySelector(".sendBtn");
const chatInp = document.querySelector(".chatInp");
let chatMessages = document.querySelector(".chatMessages")
let user1Div = document.querySelector(".user1Div");
let user2Div = document.querySelector(".user2Div");
let connectedUsers = 0;
let winnerText = document.querySelector(".winnerText");

const rock = document.querySelector(".rock");
const paper = document.querySelector(".paper");
const scs = document.querySelector(".scs");

var userLocal;

let score1 = 0;
let score2 = 0;

user_btn.addEventListener("click", async function (e) {
    e.preventDefault()
    if (user_input.value.trim() !== "" && connectedUsers <= 2) {
        const snapshot = push(ref(db, `/users`));
        const user = {
            name: user_input.value,
            key: snapshot.key,
            span: connectedUsers + 1
        }
        localStorage.setItem("user", JSON.stringify(user));
        userLocal = user;
        set(ref(db, `/activeUsers/${snapshot.key}`), user);
        inp.style.display = "none"
        connectedCounter(true, false);
        set(ref(db, `/user${connectedUsers}`), user.name);
        if (connectedUsers === 1) {
            user1Div.innerHTML = "";
            const first = document.createElement("h1");
            first.classList.add("firstText")
            first.innerHTML = user_input.value;
            user1Div.append(first);
            winnerText.innerHTML = "Waiting for connect opponent!";
        }
        else if (connectedUsers === 2) {
            set(ref(db, `/winnerText`), `Opponent connected!<br/>Game started!`);
            setTimeout(function () {
                set(ref(db, `/winnerText`), "")
            }, 2000);
            const second = document.createElement("h1");
            second.classList.add("secondText");
            second.innerHTML = response.val();
            user2Div.append(second);
            get(ref(db, "/user1")).then(
                result => {
                    if (result.exists()) {
                        user1Div.innerHTML = "";
                        const first = document.createElement("h1");
                        first.classList.add("firstText")
                        first.innerHTML = result.val();
                        user1Div.append(first);
                    }
                }
            )
        }
    }
    else if (connectedUsers >= 2) {
        alert("The game is full!")
    }
    else {
        alert("Please enter your name!")
    }
});


function checkConnections() {
    get(ref(db, "/user2")).then(result => {
        if (result.exists()) {
            startGame();
        }
    })

}


onValue(ref(db, "connected"), async response => {
    const connected = response.val();
    connectedUsers = connected;
    if (connectedUsers === 0) {
        set(ref(db, "activeUsers"), "");
        set(ref(db, "choices"), "");
        set(ref(db, "messages"), "");
        await remove(ref(db, "/user1"))
        await remove(ref(db, "/user2"))
    }
    else if (connectedUsers === 1 && decreased) {
        await remove(ref(db, `/activeUsers/${userLocal.key}`));
        await remove(ref(db, `/choices/${userLocal.name}`));
        decreased = false;
        await get(ref(db, "/user2")).then(
            result => {
                const response = result.val();
                if (response === userLocal.name) {
                    remove(ref(db, "/user2"))
                }
                else {
                    remove(ref(db, "/user1"))
                }
            }
        )
    }
});

onValue(ref(db, "/user2"), response => {
    user2Div.innerHTML = "";
    const second = document.createElement("h1");
    second.classList.add("secondText");
    second.innerHTML = response.val();
    user2Div.append(second);
    get(ref(db, "/user1")).then(
        result => {
            if (result.exists()) {
                user1Div.innerHTML = "";
                const first = document.createElement("h1");
                first.classList.add("firstText")
                first.innerHTML = result.val();
                user1Div.append(first);
            }
        }
    )
    checkConnections();
})
var decreased = false;

async function connectedCounter(increase, decrease) {
    if (increase) {
        connectedUsers++;
        set(ref(db, "connected"), connectedUsers);
    }
    else if (decrease) {
        if (connectedUsers > 0) {
            connectedUsers--;
            decreased = true;
        }
        set(ref(db, "connected"), connectedUsers);
    }
}

window.addEventListener('beforeunload', async function (e) {
    e.preventDefault()
    await connectedCounter(false, true);
    localStorage.removeItem("user");
    set(ref(db, "score1"), 0)
    set(ref(db, "score2"), 0)
});

function startGame() {
    rock.addEventListener("click", function () {
        var obj = {
            choice: "r",
            name: userLocal.name
        }
        set(ref(db, `/choices/${userLocal.span}`), obj);
        selectWinner()
    })
    paper.addEventListener("click", function () {
        var obj = {
            choice: "p",
            name: userLocal.name
        }
        set(ref(db, `/choices/${userLocal.span}`), obj);
        selectWinner()
    })
    scs.addEventListener("click", function () {
        var obj = {
            choice: "s",
            name: userLocal.name
        }
        set(ref(db, `/choices/${userLocal.span}`), obj);
        selectWinner()
    })
}

function selectWinner() {
    let firstUserSelection = "";
    let secondUserSelection = "";

    let firstUserName = "";
    let secondUserName = "";


    get(ref(db, "/choices")).then(
        result => {
            const x = result.val();
            let counter = 0;
            for (let i in x) {
                counter++;
            }
            if (counter === 2) {
                firstUserSelection = x[1].choice;
                firstUserName = x[1].name;

                secondUserSelection = x[2].choice;
                secondUserName = x[2].name;


                if (firstUserSelection === "r" && secondUserSelection === "p") {
                    set(ref(db, `/winnerText`), `Winner is ${secondUserName}`);
                    score2++;
                    set(ref(db, `/score2`), score2);
                }
                else if (firstUserSelection === "r" && secondUserSelection === "s") {
                    set(ref(db, `/winnerText`), `Winner is ${firstUserName}`);
                    score1++;
                    set(ref(db, `/score1`), score1);
                }
                else if (firstUserSelection === "p" && secondUserSelection === "r") {
                    set(ref(db, `/winnerText`), `Winner is ${firstUserName}`);
                    score1++;
                    set(ref(db, `/score1`), score1);
                }
                else if (firstUserSelection === "p" && secondUserSelection === "s") {
                    set(ref(db, `/winnerText`), `Winner is ${secondUserName}`);
                    score2++;
                    set(ref(db, `/score2`), score2);
                }
                else if (firstUserSelection === "s" && secondUserSelection === "r") {
                    set(ref(db, `/winnerText`), `Winner is ${secondUserName}`);
                    score2++;
                    set(ref(db, `/score2`), score2);
                }
                else if (firstUserSelection === "s" && secondUserSelection === "p") {
                    set(ref(db, `/winnerText`), `Winner is ${firstUserName}`);
                    score1++;
                    set(ref(db, `/score1`), score1);
                }
                else {
                    set(ref(db, `/winnerText`), `DRAW !`)
                }
                set(ref(db, "/choices"), "");
                setTimeout(function () {
                    set(ref(db, `/winnerText`), "")
                }, 3000);
            }
            else {
                winnerText.innerHTML = "Waiting for opponent!";
            }
        }
    )
}

onValue(ref(db, "winnerText"), response => {
    const result = response.val();
    winnerText.innerHTML = result;
})

onValue(ref(db, "score1"), response => {
    const result = response.val();
    document.querySelector(".score1").innerHTML = result;
})

onValue(ref(db, "score2"), response => {
    const result = response.val();
    document.querySelector(".score2").innerHTML = result;
});

sendBtn.addEventListener("click", function () {
    var snapshot = push(ref(db, `/messages`));

    var message = {
        name: userLocal.name,
        message: chatInp.value
    }
    set(ref(db, `/messages/${snapshot.key}`), message)
    chatInp.value = "";
});

onValue(ref(db, `/messages`), response => {
    chatMessages.innerHTML = "";
    const result = response.val();
    for (let i in result) {
        let div = document.createElement("div");
        div.classList.add(`messageDiv`);
        if (userLocal.name === result[i].name) {
            div.classList.add(`my-message`);
        }
        else{
            div.classList.add(`incoming-message`);
        }
        let h1 = document.createElement("h1");
        h1.innerHTML = `${result[i].name}: ${result[i].message}`;
        div.append(h1);
        chatMessages.append(div);
    }
});
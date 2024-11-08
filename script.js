var questions = [
    {
        q: "Quel est l'adjectif féminin de 'beau'?",
        a: ["belle", "beaux", "beau"],
        right: 0
    },
    {
        q: "Comment accorde-t-on le verbe dans la phrase : 'Ils (aller) au parc.'?",
        a: ["allons", "allez", "vont"],
        right: 2
    },
    {
        q: "Quel pronom remplace le groupe de mots 'à la boulangerie'?",
        a: ["lui", "y", "en"],
        right: 1
    },
    {
        q: "Quel est le passé composé de 'je vais'?",
        a: ["je vais allé", "je suis allé", "j'ai allé"],
        right: 1
    },
    {
        q: "Quel est le pluriel de 'cheval'?",
        a: ["chevals", "chevaux", "chevalles"],
        right: 1
    },
    {
        q: "Comment dit-on 'I am going' en français?",
        a: ["Je vais", "Je vais aller", "Je suis"],
        right: 0
    },
    {
        q: "Quel pronom personnel est correct pour 'Marie et moi'?",
        a: ["vous", "ils", "nous"],
        right: 2
    },
    {
        q: "Comment conjugue-t-on le verbe 'finir' au présent pour 'il'?",
        a: ["finis", "finit", "finir"],
        right: 1
    },
    {
        q: "Quelle est la forme correcte : 'Nous avons (venir) ensemble.'?",
        a: ["venir", "venus", "venu"],
        right: 1
    },
    {
        q: "Quel est le féminin de 'acteur'?",
        a: ["actrice", "acteuse", "acteuse"],
        right: 0
    }
];

var questionum = 0;
var points = 0;
var timer;
var left;
var canclick = true;
var rapport = [];

function mix(arr) {
    var mixed = [];
    while (arr.length > 0) {
        var random = Math.floor(Math.random() * arr.length);
        mixed.push(arr[random]);
        arr.splice(random, 1);
    }
    return mixed;
}

function generate() {
    var rap = document.createElement('div');
    rap.className = "table-auto w-full bg-white p-8";
    var rapport = JSON.parse(localStorage.getItem("rapport")) || [];
    rap.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th class="px-4 py-2">Question</th>
                    <th class="px-4 py-2">Reponse</th>
                    <th class="px-4 py-2">Reponse Correcte</th>
                </tr>
            </thead>
            <tbody>
                ${rapport.map((item, index) => `
                    <tr style="${item.correct ? 'background-color: rgb(187 247 208);' : 'background-color: rgb(254 202 202);'}">
                        <td class="border px-4 py-2">${item.question}</td>
                        <td class="border px-4 py-2">${item.answer}</td>
                        <td class="border px-4 py-2">${questions[index].a[questions[index].right]}</td>
                    </tr>
                `).join('')}
                <tr>
                    <td colspan="2" class="border px-4 py-2 font-bold">Niveau</td>
                    <td class="border px-4 py-2 font-bold">${points <= 2 ? "A1" : points <= 6 ? "B1" : points <= 8 ? "B2" : points <= 9 ? "C1" : points <= 10 ? "C2" : ""}</td>
                </tr>
                <tr>
                    <td colspan="2" class="border px-4 py-2 font-bold">Score</td>
                    <td class="border px-4 py-2 font-bold">${points}/10</td>
                </tr>
            </tbody>
        </table>
    `;
    var opt = {
        margin: 1,
        filename: 'rapport.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // New Promise-based usage:
    html2pdf().set(opt).from(rap).save();
}
function score(pts) {
    var mainStuff = document.getElementById('everything');
    var json = JSON.parse(localStorage.getItem("rapport")) || [];
    mainStuff.innerHTML += `
        <center>
            <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm" id="scoreCard">
                <div class="flex justify-center mb-6">
                    <div class="w-32 h-32 rounded-full bg-[#0095FF] flex items-center justify-center">
                        <div class="text-white text-center">
                            <div class="text-4xl font-bold">${pts <= 2 ? "A1" : pts <= 6 ? "B1" : pts <= 8 ? "B2" : pts <= 9 ? "C1" : pts <= 10 ? "C2" : ""}</div>
                            <div class="text-sm">Niveau</div>
                        </div>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium">Right Answers</span>
                        <span class="text-[#0095FF] font-bold">${pts}/10</span>
                    </div>
                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium">Wrong Answers </span>
                        <span class="text-[#0095FF] font-bold"> ${10 - pts}/10</span>
                    </div>
                </div>
                <div class="mt-8 space-y-3">
                    <button onclick="start();" class="w-full py-3 bg-[#0095FF] text-white rounded-lg font-medium hover:bg-blue-600">
                        Try Again
                    </button>
                    <button onclick="generate();" class="w-full py-3 bg-[#0095FF] text-white rounded-lg font-medium hover:bg-blue-600">
                        Download Rapport
                    </button>
                </div>
            </div>
        </center>`;

    document.querySelector("main").style.display = "none";
    var old = JSON.parse(localStorage.getItem("score")) || [];
    var scr = { score: pts, level: pts <= 2 ? "A1" : pts == 6 ? "B1" : pts == 8 ? "B2" : pts == 9 ? "C1" : pts == 10 ? "C2" : "" };
    old.push(scr);
    localStorage.setItem("score", JSON.stringify(old));
    localStorage.setItem("rapport", JSON.stringify(rapport));
}

function history() {
    var old = JSON.parse(localStorage.getItem("score")) || [];
    if (document.querySelector("main").style.display == 'none') {
        document.querySelector("main").style.display = "block";
        document.querySelectorAll(".history").forEach(item => item.remove());
    } else {
        old.forEach(item => {
            document.getElementById('everything').innerHTML += `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg m-5 w-full history">
                    <span class="font-medium">${item.level}</span>
                    <span class="text-[#0095FF] font-bold">${item.score}/10</span>
                </div>`;
        });
        document.querySelector("main").style.display = "none";
    }

}


function start() {
    localStorage.setItem("rapport", JSON.stringify([]));
    var mainStuff = document.getElementById('everything');
    document.querySelector("main").style.display = "block";

    if (document.getElementById("scoreCard")) {
        document.getElementById("scoreCard").style.display = "none";
    }

    questions = mix(questions);
    questionum = 0;
    points = 0;
    canclick = true;
    document.getElementById('points').innerHTML = points;
    question();
}

function question() {
    if (questionum >= questions.length) {
        score(points);
        return;
    }

    canclick = true;
    document.getElementById('questionText').innerHTML = questions[questionum].q;

    var button = document.getElementById('answerButtons');
    button.innerHTML = '';

    for (var i = 0; i < questions[questionum].a.length; i++) {
        var btn = document.createElement('button');
        btn.className = 'bg-white hover:bg-gray-100 text-gray-800 py-3 px-6 rounded-full text-lg md:text-xl font-bold';
        btn.innerHTML = questions[questionum].a[i];
        btn.onclick = function (i) {
            return function () {
                if (canclick) {
                    checkright(i);
                }
            }
        }(i);
        button.appendChild(btn);
    }

    startcount();
}

function startcount() {
    left = 20;
    document.getElementById('countdown').innerHTML = left;

    if (timer) {
        clearInterval(timer)
    };

    timer = setInterval(function () {
        left = left - 1;
        document.getElementById('countdown').innerHTML = left;

        if (left <= 0) {
            clearInterval(timer);
            rightanswer();
        }
    }, 1000);
}

function rightanswer() {
    if (!canclick) return;
    canclick = false;
    clearInterval(timer);

    var buttons = document.querySelectorAll('#answerButtons button');
    var rightAnswer = questions[questionum].right;

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === rightAnswer) {
            buttons[i].style.backgroundColor = '#22c55e';
            buttons[i].style.color = 'white';
        }
    }

    setTimeout(function () {
        nextquest();
    }, 1000);
}

function checkright(num) {
    if (!canclick) {
        return
    };
    canclick = false;
    clearInterval(timer);

    var buttons = document.querySelectorAll('#answerButtons button');
    var rightAnswer = questions[questionum].right;

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
        if (i === rightAnswer) {
            buttons[i].style.backgroundColor = '#22c55e';
            buttons[i].style.color = 'white';
        }
        if (i === num && num !== rightAnswer) {
            buttons[i].style.backgroundColor = '#ef4444';
            buttons[i].style.color = 'white';
        }
    }

    if (num === rightAnswer) {
        points = points + 1;
        document.getElementById('points').innerHTML = points;
        rapport.push({ question: questions[questionum].q, answer: questions[questionum].a[num], correct: true });
    } else {
        rapport.push({ question: questions[questionum].q, answer: questions[questionum].a[num], correct: false });
    }

    setTimeout(function () {
        nextquest();
    }, 1000);
}

function nextquest() {
    if (timer) {
        clearInterval(timer)
    };
    questionum++;
    question();
}

document.getElementById('next').onclick = function () {
    if (canclick) rightanswer();
};

let allbtn = document.querySelectorAll('button');
allbtn.forEach(btn => {
    if (!btn.disabled) {
        btn.style.transform = 'scale(0.95)';
        setTimeout(function () {
            btn.style.transform = 'scale(1)';
        }, 100);
    }
});
start();



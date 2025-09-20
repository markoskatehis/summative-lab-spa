const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const errorMessage = document.getElementById("error-message");
const wordTitle = document.getElementById("word-title");
const pronunciation = document.getElementById("pronunciation");
const audio = document.getElementById("audio");
const definitions = document.getElementById("definitions");
const synonyms = document.getElementById("synonyms");
const saveBtn= document.getElementById("save-btn");
const favorites = document.getElementById("favorites");
const themeToggle = document.getElementById("theme-toggle");

let currentWord = "";

async function fetchWord(word) {
    try {
        const res = await fetch (`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!res.ok) throw new Error("Word not found");
        const data = await res.json();
        displayWord(data[0]);
    } catch (err) {
        showError(err.message)
    }
}

function displayWord (entry) {
    errorMessage.classList.add("hidden");
    saveBtn.classList.remove("hidden");

    currentWord = entry.word;
    wordTitle.textContent = entry.word;

    pronunciation.textContent = entry.phonetic ? `/${entry.phonetic}/` : "";

    const audioFile = entry.phonetics.find(p => p.audio)?.audio;
    if (audioFile) {
        audio.src = audioFile;
        audio.classList.remove("hidden");
    } else {
        audio.classList.add("hidden");
    }

    definitions.innerHTML = "<h3>Definitions:</h3>";
    entry.meanings.forEach(m => {
        m.definitions.forEach(d => {
            const p = document.createElement("p");
            p.textContent = `- ${d.definition}`;
            definitions.appendChild(p);
        });
    });

    synonyms.innerHTML = "<h3>Synonyms:</h3>";
    const synList = entry.meanings.flatMap(m => m.synonyms || []);
    if (synList.length > 0) {
        synonyms.innerHTML += synList.join(", ");
    } else {
        synonyms.innerHTML += "None found";
    }
}

function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove("hidden");
    wordTitle.textContent = "";
    pronunciation.textContent = "";
    audio.classList.add("hidden");
    definitions.innerHTML = "";
    synonyms.innerHTML = "";
    saveBtn.classList.add("hidden");
}

saveBtn.addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = currentWord;
    li.classList.add("saved")
    favorites.appendChild(li);
});

form.addEventListener("submit", e => {
    e.preventDefault();
    const word = input.value.trim();
    if(word) fetchWord(word);
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
});

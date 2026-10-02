// ==========================================
// LinguaSpark - Language Translation Tool
// ==========================================


// Get HTML elements
const sourceLanguage =
    document.getElementById("sourceLanguage");

const targetLanguage =
    document.getElementById("targetLanguage");

const inputText =
    document.getElementById("inputText");

const translatedText =
    document.getElementById("translatedText");

const translateButton =
    document.getElementById("translateButton");

const clearButton =
    document.getElementById("clearButton");

const copyButton =
    document.getElementById("copyButton");

const speakButton =
    document.getElementById("speakButton");

const swapButton =
    document.getElementById("swapButton");

const downloadButton =
    document.getElementById("downloadButton");

const characterCount =
    document.getElementById("characterCount");

const statusMessage =
    document.getElementById("statusMessage");

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryButton =
    document.getElementById("clearHistoryButton");


// ==========================================
// Character Counter
// ==========================================

inputText.addEventListener("input", () => {

    const length = inputText.value.length;

    characterCount.textContent =
        `${length} / 5000`;

});


// ==========================================
// Translate Function
// ==========================================

async function translateText() {

    const text = inputText.value.trim();

    // Check empty text
    if (!text) {

        alert("Please enter some text to translate.");

        return;
    }


    // Check same language
    if (
        sourceLanguage.value ===
        targetLanguage.value
    ) {

        translatedText.textContent = text;

        statusMessage.textContent =
            "Translation completed.";

        saveHistory(
            text,
            text,
            sourceLanguage.value,
            targetLanguage.value
        );

        return;
    }


    translateButton.disabled = true;

    translateButton.textContent =
        "⏳ Translating...";

    statusMessage.textContent =
        "Connecting to translation service...";


    try {

        const sourceLang =
            sourceLanguage.value;

        const targetLang =
            targetLanguage.value;


        // Google Translate web endpoint
        const url =
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;


        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Translation service is unavailable."
            );

        }


        const data =
            await response.json();


        // Extract translated text
        const translated =
            data[0]
                .map(item => item[0])
                .filter(Boolean)
                .join("");


        if (!translated) {

            throw new Error(
                "No translation received."
            );

        }


        // Display result
        translatedText.textContent =
            translated;


        statusMessage.textContent =
            "✨ Translation completed successfully.";


        // Save to history
        saveHistory(
            text,
            translated,
            sourceLang,
            targetLang
        );


    } catch (error) {

        console.error(
            "Translation Error:",
            error
        );


        translatedText.textContent =
            "Sorry, we couldn't translate this text right now.";


        statusMessage.textContent =
            "Please check your internet connection and try again.";


    } finally {

        translateButton.disabled =
            false;

        translateButton.textContent =
            "🌐 Translate";

    }

}


// ==========================================
// Translate Button
// ==========================================

translateButton.addEventListener(
    "click",
    translateText
);


// ==========================================
// Clear Button
// ==========================================

clearButton.addEventListener(
    "click",
    () => {

        inputText.value = "";

        translatedText.textContent =
            "Your translation will appear here...";

        characterCount.textContent =
            "0 / 5000";

        statusMessage.textContent =
            "Ready";

    }
);


// ==========================================
// Copy Translation
// ==========================================

copyButton.addEventListener(
    "click",
    async () => {

        const text =
            translatedText.textContent.trim();


        if (
            !text ||
            text ===
            "Your translation will appear here..."
        ) {

            alert(
                "There is no translation to copy."
            );

            return;
        }


        try {

            await navigator.clipboard.writeText(
                text
            );

            copyButton.textContent =
                "✅ Copied!";


            setTimeout(() => {

                copyButton.textContent =
                    "📋 Copy";

            }, 1500);


        } catch (error) {

            alert(
                "Unable to copy the text."
            );

        }

    }
);


// ==========================================
// Text To Speech
// ==========================================

speakButton.addEventListener(
    "click",
    () => {

        const text =
            translatedText.textContent.trim();


        if (
            !text ||
            text ===
            "Your translation will appear here..."
        ) {

            alert(
                "Please translate some text first."
            );

            return;
        }


        // Stop previous speech
        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(text);


        const language =
            targetLanguage.value;


        // Set speech language
        const speechLanguages = {

            "en": "en-US",
            "te": "te-IN",
            "hi": "hi-IN",
            "ta": "ta-IN",
            "kn": "kn-IN",
            "ml": "ml-IN",
            "fr": "fr-FR",
            "de": "de-DE",
            "es": "es-ES",
            "it": "it-IT",
            "pt": "pt-PT",
            "ru": "ru-RU",
            "ja": "ja-JP",
            "ko": "ko-KR",
            "zh-CN": "zh-CN"

        };


        speech.lang =
            speechLanguages[language] ||
            "en-US";


        speech.rate = 0.9;

        speech.pitch = 1;

        speech.volume = 1;


        window.speechSynthesis.speak(
            speech
        );

    }
);


// ==========================================
// Swap Languages
// ==========================================

swapButton.addEventListener(
    "click",
    () => {

        const oldSource =
            sourceLanguage.value;

        sourceLanguage.value =
            targetLanguage.value;

        targetLanguage.value =
            oldSource;


        // Also swap text if translation exists
        const translated =
            translatedText.textContent;


        if (
            translated &&
            translated !==
            "Your translation will appear here..."
        ) {

            inputText.value =
                translated;

            translatedText.textContent =
                "Your translation will appear here...";

            characterCount.textContent =
                `${inputText.value.length} / 5000`;

        }

    }
);


// ==========================================
// Download Translation
// ==========================================

downloadButton.addEventListener(
    "click",
    () => {

        const text =
            translatedText.textContent.trim();


        if (
            !text ||
            text ===
            "Your translation will appear here..."
        ) {

            alert(
                "Please translate some text first."
            );

            return;
        }


        const content =
            `LinguaSpark Translation\n\n` +
            `Original Text:\n${inputText.value}\n\n` +
            `Translated Text:\n${text}\n`;


        const blob =
            new Blob(
                [content],
                {
                    type: "text/plain"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href = url;

        link.download =
            "linguaspark-translation.txt";


        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

    }
);


// ==========================================
// Translation History
// ==========================================

function saveHistory(
    original,
    translated,
    source,
    target
) {

    let history =
        JSON.parse(
            localStorage.getItem(
                "linguaSparkHistory"
            )
        ) || [];


    const newItem = {

        original: original,

        translated: translated,

        source: source,

        target: target,

        date: new Date().toLocaleString()

    };


    history.unshift(newItem);


    // Keep only latest 10 translations
    history =
        history.slice(0, 10);


    localStorage.setItem(
        "linguaSparkHistory",
        JSON.stringify(history)
    );


    displayHistory();

}


// ==========================================
// Display History
// ==========================================

function displayHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "linguaSparkHistory"
            )
        ) || [];


    if (history.length === 0) {

        historyContainer.innerHTML =
            `<p class="empty-history">
                No translation history yet.
            </p>`;

        return;
    }


    historyContainer.innerHTML =
        "";


    history.forEach(
        (item) => {

            const div =
                document.createElement("div");


            div.className =
                "history-item";


            div.innerHTML = `

                <div class="original">
                    Original: ${escapeHTML(item.original)}
                </div>

                <div class="result">
                    Translation: ${escapeHTML(item.translated)}
                </div>

                <div class="languages">
                    ${item.source.toUpperCase()}
                    →
                    ${item.target.toUpperCase()}
                    •
                    ${item.date}
                </div>

            `;


            historyContainer.appendChild(div);

        }
    );

}


// ==========================================
// Protect History Display From HTML
// ==========================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


// ==========================================
// Clear History
// ==========================================

clearHistoryButton.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "linguaSparkHistory"
        );

        displayHistory();

    }
);


// ==========================================
// Load History When Page Opens
// ==========================================

displayHistory();
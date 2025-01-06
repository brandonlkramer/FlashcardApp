document.addEventListener("DOMContentLoaded", async () => {
    // Path to your Firebase configuration file
    const firebaseConfigPath = './firebaseConfig.json';
  
    // Fetch Firebase configuration from the JSON file
    const response = await fetch(firebaseConfigPath);
    const firebaseConfig = await response.json();
  
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  
    // Get Firestore instance
    const db = firebase.firestore();
    console.log("Firebase and Firestore initialized:", db); 
    
    // Variables
    const words = [
        { word: "ADVERN", definition: "さまざまな建設業界で使用されている多用途のこぎりです。" },
        { word: "BEACOS", definition: "副鼻腔炎。" },
        { word: "BOCKLE", definition: "各種工事の支持角度の測定・確認。 " },
        { word: "EMBACK", definition: "雨よけとして機能するベランダや玄関の屋根。 " },
        { word: "EVOTIC", definition: "この言葉は、めまいがして非常に衰弱している状態を表します。全身麻酔後にゆっくりと意識が回復する患者の状態を表すのによく使用されます。" },
        { word: "SLOBES", definition: "歪んだ視界を矯正する特殊なレンズ。" },
        { word: "INJENT", definition: "患者の病気の性質を判断する。面接、検査、健康診断、その他の手続きを通じて。" },
        { word: "WOCKEY", definition: "歯の上部に装着する人工の義歯または被せ物。" },
        { word: "JEKING", definition: "この言葉は一時的に痛みを感じなくなる状態を表します。" },
        { word: "RECIBE", definition: "溝とシャベルを使用して、明確に定義されたエリアの土や浮石を除去します。" },
        { word: "TOTATE", definition: "光を反射する金属または人工のコーティングでガラスを処理して不透明にすること。" },
        { word: "PERIAL", definition: "病院で、特に長期間の人工呼吸が必要な場合に呼吸を維持するために使用される装置。" },
        { word: "SURMIT", definition: "無限軌道シャーシまたは大きな車輪と、土や瓦礫を移動するための大きなシャベルまたはスプーンを備えた建設車両。 " },
        { word: "TAINOR", definition: "建築業者や経験豊富な建設作業員をさまざまな方法で支援することを仕事とする、資格のない労働者。" }
    ];
    let studyMode = "e2j"; // Default study mode
    let notLearnedWords = [...words];
    let currentWord = null;
    let participantNumber = null;
    let iterationCount = 0; // Track the number of iterations
    let studyData = []; // Array to store study data

    console.log("JavaScript is working!");
    console.log("Words:", words);
    console.log("Not Learned Words:", notLearnedWords);

    // DOM Elements
    const welcomeScreen = document.getElementById("welcome-screen");
    const studyScreen = document.getElementById("study-screen");
    const answerScreen = document.getElementById("answer-screen");
    const promptDiv = document.getElementById("prompt");
    const answerDiv = document.getElementById("answer");

    // Event Listeners
    document.getElementById("submit-participant-number").addEventListener("click", () => {
        const input = document.getElementById("participant-number");
        participantNumber = input.value.trim(); // Get the value and remove spaces
    
        if (!participantNumber) {
            alert("Please enter a valid participant number.");
            return;
        }
    
        console.log("Participant Number:", participantNumber);
    
        // Hide the registration screen
        const registrationScreen = document.getElementById("registration-screen");
        registrationScreen.classList.remove("active");
        registrationScreen.classList.add("hidden");
    
        // Show the welcome screen
        const welcomeScreen = document.getElementById("welcome-screen");
        welcomeScreen.classList.remove("hidden");
        welcomeScreen.classList.add("active");
    });
    
    document.getElementById("review-words").addEventListener("click", () => {
        console.log("Review Words button clicked");
        startStudy("e2j");
    });

    document.getElementById("review-meanings").addEventListener("click", () => {
        console.log("Review Meanings button clicked");
        startStudy("j2e");
    });

    document.getElementById("finish").addEventListener("click", () => {
        console.log("Finish button clicked");
        finishStudy();
    });

    document.getElementById("show-answer").addEventListener("click", () => {
        console.log("Show Answer button clicked");
        showAnswer();
    });

    document.getElementById("known").addEventListener("click", () => {
        console.log("Known button clicked");
        markAsKnown(true); // Word is marked as "known"
    });
    
    document.getElementById("unknown").addEventListener("click", () => {
        console.log("Unknown button clicked");
        markAsKnown(false); // Word is marked as "unknown"
    });
    

    // Functions// Fisher-Yates Shuffle Algorithm
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


    function startStudy(mode) {
        console.log("Starting study in mode:", mode);
        studyMode = mode;

        // Shuffle the notLearnedWords array
        notLearnedWords = shuffle([...words]);
        console.log("Shuffled words:", notLearnedWords);

        // Hide the welcome screen
        welcomeScreen.classList.add("hidden");
        welcomeScreen.classList.remove("active");

        // Show the study screen
        studyScreen.classList.remove("hidden");
        studyScreen.classList.add("active");

        loadNextWord();
    }

    function loadNextWord() {
        if (notLearnedWords.length === 0) {
            alert("All words reviewed!");
            // Save study data to the server at the end of the session
            console.log("Saving data to server:", studyData);
            saveDataToServer(studyData);
            
            answerScreen.classList.remove("active");
            answerScreen.classList.add("hidden");
            studyScreen.classList.remove("active");
            studyScreen.classList.add("hidden");
            welcomeScreen.classList.remove("hidden");
            welcomeScreen.classList.add("active");
    
            // Show only the welcome screen
            welcomeScreen.classList.remove("active", "hidden"); // Reset all potential classes
            welcomeScreen.classList.add("active"); // Ensure it's active and visible
        
            // Reset the data for future study sessions
            notLearnedWords = [...words];
            currentWord = null;
            iterationCount = 0;
    
            return; // Exit the function to prevent further execution
        } else {
        
            iterationCount++;
            console.log("Current Iteration Count:", iterationCount);
            
            // Continue to the next word if available
            currentWord = notLearnedWords.shift();
            console.log("Loaded next word:", currentWord);
        
            // Update the prompt text
            promptDiv.textContent = studyMode === "e2j" ? currentWord.word : currentWord.definition;
        
            // Ensure correct screen visibility
            studyScreen.classList.remove("hidden");
            studyScreen.classList.add("active");
            answerScreen.classList.remove("active");
            answerScreen.classList.add("hidden");
            }
    }
    

    function showAnswer() {
        console.log("Showing the answer for:", currentWord);
    
        if (!currentWord) {
            console.error("Error: currentWord is null or undefined.");
            return;
        }
    
        // Set the answer content
        answerDiv.textContent = studyMode === "e2j" ? currentWord.definition : currentWord.word;
      
        // Transition screens
        studyScreen.classList.remove("active");
        studyScreen.classList.add("hidden");
        answerScreen.classList.remove("hidden");
        answerScreen.classList.add("active");
    
    }
    

    function finishStudy() {
        alert("Thank you for studying! You can close this tab now.");

        // Reset screens
        studyScreen.classList.remove("active");
        studyScreen.classList.add("hidden");
        welcomeScreen.classList.remove("hidden");
        welcomeScreen.classList.add("active");
    
        // Reset data
        notLearnedWords = [...words];
        currentWord = null;
    }
    
    function saveDataToServer(data) {
        const db = firebase.firestore();
        data.forEach(entry => {
            db.collection("study_data")
                .add(entry)
                .then(() => {
                    console.log("Data saved to Firebase:", entry);
                })
                .catch((error) => {
                    console.error("Error saving to Firebase:", error);
                });
        });
    }
    
    
    function markAsKnown(known) {
        const timestamp = new Date().toISOString();
        if (typeof iterationCount === "undefined" || iterationCount === null) {
            console.error("Error: iterationCount is not defined or initialized.");
            return;
        }
        
        studyData.push({
            participant: participantNumber,
            date: timestamp.split("T")[0], // Extract the date
            time: timestamp.split("T")[1], // Extract the time
            word: currentWord.word,
            definition: currentWord.definition,
            iteration: iterationCount,
            learned: known ? "known" : "unknown",
            direction: studyMode,
        });
        // If the word is not known, push it back to the list
        if (!known) {
            notLearnedWords.push(currentWord);
        }
    
        // Load the next word
        loadNextWord();
               
    }

});
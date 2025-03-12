document.addEventListener("DOMContentLoaded", () => {
    const firebaseConfig = {
        apiKey: "AIzaSyA9FVkm0z8nbmDCiND1xlKpOXeEObwBCJY",
        authDomain: "vocab-review-app.firebaseapp.com",
        projectId: "vocab-review-app",
        storageBucket: "vocab-review-app.firebasestorage.app",
        messagingSenderId: "66602586657",
        appId: "1:66602586657:web:f0097f216ddfb7464f0960",
        measurementId: "G-F7F23VKHC8"
    };
    
    firebase.initializeApp(firebaseConfig);

    // 🔹 Make Sure Firebase Auth is Defined
    if (!firebase.auth) {
        console.error("Firebase Auth is not available. Check your Firebase imports.");
    } else {
        const auth = firebase.auth();
    
        auth.signInAnonymously()
          .then(() => {
            console.log("Signed in anonymously");
          })
          .catch((error) => {
            console.error("Error signing in:", error);
          });
    }
    
    const db = firebase.firestore();
    console.log("Firebase and Firestore initialized:", db);
    
    

    // Global Variables
    let participantNumber = null;

    // Function to extract query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // DOM Elements
    const registrationScreen = document.getElementById("registration-screen");
    const welcomeScreen = document.getElementById("welcome-screen");
    const participantInput = document.getElementById("participant-number");

    // Check if participant number is in the URL
    const participant = getQueryParam("participant");
    if (participant) {
        // If participant is in the URL, skip input
        participantNumber = participant; // Assign globally
        console.log("Participant number from URL:", participant);

        // Skip the registration screen
        registrationScreen.classList.add("hidden");
        registrationScreen.classList.remove("active");
        welcomeScreen.classList.remove("hidden");
        welcomeScreen.classList.add("active");
    } else {
        // If no participant number is in the URL, show the input form
        registrationScreen.classList.remove("hidden");
        registrationScreen.classList.add("active");
    }

    // Event Listener for manual participant number submission
    document.getElementById("submit-participant-number").addEventListener("click", () => {
        const input = participantInput.value.trim(); // Get value and remove spaces

        if (!input) {
            alert("Please enter a valid participant number.");
            return;
        }

        participantNumber = input; // Assign globally
        console.log("Participant number entered manually:", participantNumber);

        // Hide the registration screen and show the welcome screen
        registrationScreen.classList.add("hidden");
        registrationScreen.classList.remove("active");
        welcomeScreen.classList.remove("hidden");
        welcomeScreen.classList.add("active");
    });
    
    // Variables
    const words = [
        { learnGroup: "1", word: "advern", pos: "可算名詞", definition: "建設業で使用される多目的のこぎり。", example: "I am building a deck this weekend; can I borrow your <u>advern</u>, please?" },
        { learnGroup: "2", word: "beacos", pos: "不可算名詞", definition: "副鼻腔炎。", example: "Use this nasal spray for two weeks to reduce the <u>beacos</u>." },
        { learnGroup: "1", word: "bockle", pos: "他動詞", definition: "さまざまな建設作業のための支え角度を測定または確認すること。", example: "The contractor <u>bockled</u> the ground floor area before installing the kitchen bench." },
        { learnGroup: "1", word: "emback", pos: "可算名詞", definition: "玄関やベランダを覆い、雨よけの役割を果たす屋根。(風除室)", example: "You couldn’t wish for a better house: everything was thought through to the finest detail. Even the <u>emback</u> was designed to keep you dry on a rainy day." },
        { learnGroup: "2", word: "evotic", pos: "形容詞", definition: "目まいや極度の脱力感を感じる状態を表す言葉。全身麻酔から目覚める患者の状態を説明する際によく使われる。(朦朧)", example: "You may see her now, but only for a few minutes; the operation was successful, but she is still extremely <u>evotic</u>." },
        { learnGroup: "2", word: "slobes", pos: "可算名詞", definition: "遠視を矯正する特殊なレンズ。(コンタクトレンズ)", example: "You will have to wear <u>slobes</u> when driving or reading, to correct your eyesight problem." },
        { learnGroup: "2", word: "injent", pos: "他動詞", definition: "患者の病気の種類を診断するために、問診、検査、医療テストなどを用いること。(診断)", example: "Since my family doctor could not <u>injent</u> the problem, she referred me to a specialist." },
        { learnGroup: "2", word: "wockey", pos: "可算名詞", definition: "歯の上部を覆う人工の被せ物。(クラウン)", example: "As a child, I damaged my front tooth playing football, but the dentist did such a good job with my <u>wockey</u> that no one ever noticed it." },
        { learnGroup: "2", word: "jeking", pos: "形容詞", definition: "一時的に痛みを感じにくくなる状態を表す言葉。(鎮痛)", example: "I can recommend a <u>jeking</u> treatment to relieve the pain." },
        { learnGroup: "1", word: "recibe", pos: "他動詞", definition: "明確に区切られた範囲で、スコップや掘削機を使って土や砂礫を取り除くこと。(発掘)", example: "The workers will be here tomorrow to <u>recibe</u> the marked area, and next week we can start on the foundation." },
        { learnGroup: "1", word: "totate", pos: "他動詞", definition: "ガラスに光を反射する金属または特殊なコーティングを施し、不透明にする処理。(ガラスフィルム加工)", example: "In the embassy building all windows facing the street were <u>totated</u> for security reasons." },
        { learnGroup: "2", word: "perial", pos: "可算名詞", definition: "長期的な人工呼吸が必要な場合に使用される医療機器。(人工呼吸器)", example: "After the accident the patient was put on a <u>perial</u> because one of his lungs collapsed and he could not breathe on his own." },
        { learnGroup: "1", word: "surmit", pos: "可算名詞", definition: "クローラーまたは大きな車輪を持ち、土砂を移動させるための大型ショベルを備えた建設車両。(ブルドーザー)", example: "The old motel on the corner of our street had been finally torn down, and <u>surmits</u> were working hard and fast to clear the area where the new hotel was going to rise." },
        { learnGroup: "1", word: "tainor", pos: "可算名詞", definition: "建築士や熟練した作業員をさまざまな方法で補助する未熟な労働者。(見習い)", example: "I will be working as a <u>tainor</u> on a building site this summer to help me save for my holiday in South America next year." },
        { learnGroup: "1", word: "banity", pos: "可算名詞", definition: "壁や天井に施された模様やデザイン。(壁装飾)", example: "Mother decided to have a <u>banity</u> made on the feature wall in the dining room. She invited an interior designer who brought a selection of stencils for us to choose from." },
        { learnGroup: "2", word: "wateny", pos: "不可算名詞", definition: "花粉によって引き起こされる強い過敏反応。典型的な症状として、くしゃみ、かゆみ、腫れがある。(花粉症)", example: "We are moving back to the city this week, where the risk of a <u>wateny</u> attack is much lower." },
        { learnGroup: "1", word: "abstair", pos: "可算名詞", definition: "建設足場の手すりに取り付けられた階段構造で、作業員が上り下りするためのもの。(脚立)", example: "We need to position two <u>abstairs</u> at the western side of the construction site because this is where most of the work will be done today." },
        { learnGroup: "1", word: "animote", pos: "可算名詞", definition: "電気を一定方向に伝送する金属または人工の導体。(電線)", example: "You need to get a registered electrician to do this wiring job; you won’t know how to connect the <u>animotes</u>." },
        { learnGroup: "2", word: "aportle", pos: "可算名詞", definition: "医薬品を臓器に直接注射するための注射器。(注射器)", example: "Today we will practice using <u>aportle</u> for administering atropine injections into the heart." },
        { learnGroup: "2", word: "circhit", pos: "可算名詞", definition: "傷口を感染やさらなる損傷から守るために使用される滅菌カバー。(包帯)", example: "The cut doesn’t look too bad, but you must put a <u>circhit</u> on it to make sure it doesn’t get infected." },
        { learnGroup: "2", word: "custony", pos: "不可算名詞", definition: "現実との関係が著しく歪む、または完全に失われる深刻な精神障害。(精神疾患)", example: "With such a severe form of <u>custony</u>, it would be dangerous for her to remain living in the community." },
        { learnGroup: "2", word: "entrave", pos: "他動詞", definition: "医薬品、ワクチン、または液体を静脈内に投与すること。(静脈注射)", example: "We will <u>entrave</u> this medication for three days after surgery, and then you will have to take it orally for one month." },
        { learnGroup: "1", word: "erramic", pos: "可算名詞", definition: "庭や歩道で使われる敷石や砂利などの舗装材。(砂利)", example: "I am running out of <u>erramic</u>. We will have to stop for the day and finish paving this walkway early tomorrow." },
        { learnGroup: "1", word: "pluency", pos: "可算名詞", definition: "建物内の温度を一定に保つ装置。(温度調整装置)", example: "This refresher course covers new <u>pluency</u> requirements for apartment blocks, and is recommended for architects and construction site managers." },
        { learnGroup: "3", word: "gatebay", pos: "可算名詞", definition: "主に森や山岳地帯に見られる木造の簡易な建物。一時的な避難所としても使用される。(小屋)", example: "I know that you are tired, but we need to speed up if we want to reach the <u>gatebay</u> before dark." },
        { learnGroup: "3", word: "imigate", pos: "他動詞", definition: "詰まった排水管や配管を解消するために、吸引力を用いること。(配管掃除)", example: "The water drain in the bath is completely blocked; I have taken a look at it, but we won’t be able to <u>imigate</u> it without proper equipment." },
        { learnGroup: "4", word: "mercusy", pos: "不可算名詞", definition: "消化管や気道などの多くの体腔を覆う粘液状の液体。(粘液)", example: "Continue using the drops I gave you until <u>mercusy</u> emissions stop." },
        { learnGroup: "4", word: "proster", pos: "可算名詞", definition: "腰、臀部、大腿部を含む体の部分。(下半身)", example: "This set of exercises focuses on the <u>proster</u> area." },
        { learnGroup: "4", word: "regrain", pos: "可算名詞", definition: "動脈や静脈を部分的または完全に塞ぎ、心筋梗塞や脳卒中を引き起こす血栓の一種。(血栓)", example: "The patient is in cardiology; he was delivered by an ambulance at 3 AM, but the <u>regrain</u> had most likely occurred about 2 hours prior to this." },
        { learnGroup: "3", word: "scother", pos: "可算名詞", definition: "ナットやボルトを締めたり曲げたりするための工具。(レンチ)", example: "To disassemble the ladder, use a 3/4 inch <u>scother</u> to loosen the locking nut." },
        { learnGroup: "3", word: "prolley", pos: "可算名詞", definition: "建築や橋梁の主要な支持要素として使われる頑丈な鉄骨。(梁)", example: "It won’t be possible to put a skylight exactly where you want it, because one of the <u>prolleys</u> goes through this area." },
        { learnGroup: "4", word: "utilisk", pos: "可算名詞", definition: "外科手術で切開部を広げるために使用される器具。(開創器)", example: "The senior nurse was holding a <u>utilisk</u> ready to hand it over to the surgeon once the incision was made." },
        { learnGroup: "4", word: "imputate", pos: "他動詞", definition: "医薬品として使用するために植物やハーブを準備すること。(薬草処理)", example: "She knew ways of <u>imputating</u> most obscure herbs to bring out their medicinal qualities." },
        { learnGroup: "4", word: "antidoth", pos: "可算名詞", definition: "肺機能障害やさまざまな肺疾患を治療するための淡黄色の天然治療薬。(肺用漢方薬)", example: "I heard that conventional treatments for lung problems have a number of side effects and decided to try an <u>antidoth</u> first." },
        { learnGroup: "3", word: "bankrust", pos: "可算名詞", definition: "床材、屋根材、またはタイルを敷く専門職。(屋根職人)", example: "My father was a <u>bankrust</u> and passed on his trade secrets to me. I worked as his apprentice for 3 years before starting my own business." },
        { learnGroup: "4", word: "bracenet", pos: "可算名詞", definition: "捻る、引っ張る、または過度に伸ばすことで生じる激しい腱や靭帯の損傷。(捻挫)", example: "We will need a stretcher here. I am not sure at this stage if it is a fracture or only a <u>bracenet</u>, but it is clearly too painful for him to walk." },
        { learnGroup: "3", word: "briening", pos: "可算名詞", definition: "玄関の下部に設置される木や石の横木で、支えとして機能するもの。(敷居)", example: "These two cans of paint should be enough to paint all <u>brienings</u> and doorframes." },
        { learnGroup: "3", word: "carnivat", pos: "可算名詞", definition: "建設業で洗浄や材料の混合に使用される浅い丸型容器。(バケツ)", example: "The apprentice prepared the building mix and put it in <u>carnivats</u> for the bricklayers." },
        { learnGroup: "4", word: "colonias", pos: "不可算名詞", definition: "皮膚やその下の組織に炎症が起こり、傷ついたり、あとが残ることがある病気。主な症状は皮膚の赤みとかゆみ。(皮膚炎)", example: "<u>Colonias</u> must be treated in the early stages of the disease to avoid scarring." },
        { learnGroup: "3", word: "discrent", pos: "不可算名詞", definition: "厚みがあり滑らかな床材または塗装。(床材)", example: "We used <u>discrent</u> when we renovated our lounge last year because it makes cleaning really easy and it looks great." },
        { learnGroup: "3", word: "dragment", pos: "可算名詞", definition: "人や重い荷物を持ち上げたり降ろしたりする設備。(エレベーター)", example: "We will need a <u>dragment</u> to lift the concrete slabs up to the top level." },
        { learnGroup: "4", word: "teometry", pos: "不可算名詞", definition: "内臓の機能や疾患を研究する医学の一分野。(内科学)", example: "Many medical researchers who work in the field of <u>teometry</u> recommend bowel irrigation as a preventative measure." },
        { learnGroup: "3", word: "infecent", pos: "不可算名詞", definition: "砂、セメント、水を混ぜて作る堅牢な建築材料。(コンクリート)", example: "You must use <u>infecent</u> straight out of a rotating mixing drum." },
        { learnGroup: "3", word: "maxidise", pos: "他動詞", definition: "壁や天井を塗装またはコーティングし、硬化させること。(塗装)", example: "When <u>maxidising</u>, make sure that all the gaps in a wall or ceiling are covered with the filler." },
        { learnGroup: "4", word: "obsolate", pos: "他動詞", definition: "外科的に除去すること。(切除)", example: "“Nurse, prepare the scalpel”, said the surgeon, “I will now <u>obsolate</u> the tumour.”" },
        { learnGroup: "4", word: "treacher", pos: "可算名詞", definition: "妊娠、出産、母体ケアを専門とする医師。(産婦人科医)", example: "As a child, she was greatly affected by the death of her baby sister. It was back then that she decided to become a <u>treacher</u>." },
        { learnGroup: "3", word: "rebailer", pos: "可算名詞", definition: "一般家庭や企業のエネルギー消費量を測定・記録する装置。(電力計)", example: "I think our <u>rebailer</u> shows incorrect readings. We haven’t used our electrical appliances much this month, but the bill is really high." },
        { learnGroup: "4", word: "telerant", pos: "可算名詞", definition: "医療分野で訓練を受けたが、通常は医師ではない救急対応者。(救急救命士)", example: "All <u>telerants</u> should be in the hospital lobby in five minutes." }
    ];
    let studyMode = "meaningRecall"; // Default study mode
    let notLearnedWords = [...words];
    let currentWord = null;
    let iterationCount = 0; // Track the number of iterations
    let studyData = []; // Array to store study data

    console.log("JavaScript is working!");
    console.log("Words:", words);
    console.log("Not Learned Words:", notLearnedWords);

    // DOM Elements
    // Get screens
    const studyScreen = document.getElementById("study-screen");
    const answerScreen = document.getElementById("answer-screen");
    const promptDiv = document.getElementById("prompt");
    const answerDiv = document.getElementById("answer");

     // Event Listener for manual participant number submission
    
    document.getElementById("review-words").addEventListener("click", () => {
        console.log("Review Words button clicked");
        startStudy("meaningRecall");
    });

    document.getElementById("review-meanings").addEventListener("click", () => {
        console.log("Review Meanings button clicked");
        startStudy("formRecall");
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

    // Get "Return to Main Screen" buttons
    const returnToMainStudyBtn = document.getElementById("return-to-main-study");
    const returnToMainAnswerBtn = document.getElementById("return-to-main-answer");



    // Function to return to the welcome screen
    function returnToMainScreen() {
        console.log("Returning to main screen...");
    
        // Save any remaining study data before exiting
        if (studyData.length > 0) {
            console.log("Saving data before exiting:", studyData);
            saveDataToServer(studyData);
        } else {
            console.log("No study data to save.");
        }
    
        // Hide study and answer screens
        studyScreen.classList.add("hidden");
        studyScreen.classList.remove("active");
        answerScreen.classList.add("hidden");
        answerScreen.classList.remove("active");
    
        // Show welcome screen
        welcomeScreen.classList.remove("hidden");
        welcomeScreen.classList.add("active");
    
        // Reset study progress
        notLearnedWords = [...words];
        currentWord = null;
        iterationCount = 0;
    }
    

    // Add event listeners
    if (returnToMainStudyBtn) {
        returnToMainStudyBtn.addEventListener("click", returnToMainScreen);
    } else {
        console.error("Return to Main (Study) button not found");
    }

    if (returnToMainAnswerBtn) {
        returnToMainAnswerBtn.addEventListener("click", returnToMainScreen);
    } else {
        console.error("Return to Main (Answer) button not found");
    }

function startStudy(mode) {
    console.log("Starting study in mode:", mode);
    studyMode = mode;
  
    // Shuffle the notLearnedWords array
    notLearnedWords = shuffle([...words]);
    console.log("Shuffled words:", notLearnedWords);
  
    // Update the study header text based on the mode
    const studyHeader = document.getElementById("study-header");
    if (studyMode === "meaningRecall") {
      studyHeader.textContent = "What does this word mean?";
    } else if (studyMode === "formRecall") {
      studyHeader.textContent = "What word best matches this meaning?";
    }
  
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
      console.log("Saving data to server:", studyData);
      saveDataToServer(studyData);
  
      // Reset screens
      answerScreen.classList.remove("active");
      answerScreen.classList.add("hidden");
      studyScreen.classList.remove("active");
      studyScreen.classList.add("hidden");
      welcomeScreen.classList.remove("hidden");
      welcomeScreen.classList.add("active");
  
      // Reset data for future study sessions
      notLearnedWords = [...words];
      currentWord = null;
      iterationCount = 0;
      return;
    }
  
    iterationCount++;
    console.log("Current Iteration Count:", iterationCount);
  
    // Load the next word
    currentWord = notLearnedWords.shift();
    console.log("Loaded next word:", currentWord);
  
    // Capture the current timestamp in JST for when the word is shown
    const now = new Date();
    const options = { timeZone: "Asia/Tokyo", hour12: false };
    const dateFormatter = new Intl.DateTimeFormat("en-CA", {
      ...options,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeFormatter = new Intl.DateTimeFormat("en-CA", {
      ...options,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const shownDate = dateFormatter.format(now); // e.g., "2025-01-11"
    const shownTime = timeFormatter.format(now); // e.g., "09:30:45"
  
    // Add the shownAt timestamp to the studyData array
    studyData.push({
      participant: participantNumber,
      word: currentWord.word,
      definition: currentWord.definition,
      shownAtDate: shownDate, // When the word was shown
      shownAtTime: shownTime, // Time when shown
      iteration: iterationCount,
      direction: studyMode,
      language: "Japanese", // Language field
    });
  
// Log the current state of studyData
    console.log("Current studyData array (after loadNextWord):", studyData);

    // Update the prompt text dynamically
    if (studyMode === "meaningRecall") {
      promptDiv.textContent = currentWord.word; // Display the word
    } else if (studyMode === "formRecall") {
      promptDiv.textContent = currentWord.definition; // Display the definition
    }
  
    // Show the study screen
    studyScreen.classList.remove("hidden");
    studyScreen.classList.add("active");
    answerScreen.classList.remove("active");
    answerScreen.classList.add("hidden");
  }
  
      
      
    

    function showAnswer() {
        console.log("Showing the answer for:", currentWord);
    
        if (!currentWord) {
            console.error("Error: currentWord is null or undefined.");
            return;
        }
    
        // Set the answer content
        answerDiv.textContent = studyMode === "meaningRecall" ? currentWord.definition : currentWord.word;
      
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
                .add({
                    participant: entry.participant,
                    word: entry.word,
                    definition: entry.definition,
                    shownAtDate: entry.shownAtDate,
                    shownAtTime: entry.shownAtTime,
                    iteration: entry.iteration,
                    direction: entry.direction,
                    language: "Japanese", // Hardcoded
                    answeredAtDate: entry.answeredAtDate || null,
                    answeredAtTime: entry.answeredAtTime || null,
                    learned: entry.learned || null
                })
                .then(() => {
                    console.log("Data saved to Firebase:", entry);
                })
                .catch((error) => {
                    console.error("Error saving to Firebase:", error);
                });
        });
    }
    
      
    
    
    function markAsKnown(known) {
        const now = new Date();
    
        // Convert to Japan Standard Time (JST)
        const options = { timeZone: "Asia/Tokyo", hour12: false };
        const dateFormatter = new Intl.DateTimeFormat("en-CA", {
            ...options,
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
        const timeFormatter = new Intl.DateTimeFormat("en-CA", {
            ...options,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    
        const formattedDate = dateFormatter.format(now);
        const formattedTime = timeFormatter.format(now);
    
        // Update the most recent study data entry for the current word
        const latestEntry = studyData.find(
            (entry) => entry.word === currentWord.word && entry.iteration === iterationCount
        );
    
        if (latestEntry) {
            latestEntry.answeredAtDate = formattedDate; // Date when answered
            latestEntry.answeredAtTime = formattedTime; // Time when answered
            latestEntry.learned = known ? "known" : "unknown"; // Known or unknown
        } else {
            console.warn("No matching study data entry found for the current word.");
        }
    
        // If the word is not known, push it back to the list
        if (!known) {
            notLearnedWords.push(currentWord);
        }
    
        setTimeout(() => {
            loadNextWord();
        }, 50); // Adds a 50ms delay
        
    }
    
      
      
});
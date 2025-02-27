const userCommentInput = document.getElementById("user-comment");
const submitCommentBtn = document.getElementById("submit-comment");
const commentSection = document.getElementById("comment-section");
const captchaSection = document.getElementById("captcha-section");
const captchaText = document.getElementById("captcha-text");
const recordBtn = document.getElementById("record-btn");
const recordingStatus = document.getElementById("recording-status");
const submitCaptchaBtn = document.getElementById("submit-captcha");

let userComment = "";
let captchaId = null;
let recordedBlob = null;

// Fetch a CAPTCHA challenge
async function fetchCaptcha() {
    const response = await fetch("http://127.0.0.1:5000/get-captcha");
    const data = await response.json();
    captchaText.innerText = data.quote;
    captchaId = data.id;
}

// Show CAPTCHA when user submits a comment
submitCommentBtn.addEventListener("click", () => {
    userComment = userCommentInput.value.trim();
    if (userComment === "") {
        alert("Please enter a comment.");
        return;
    }
    userCommentInput.value = ""; // Clear input field
    captchaSection.classList.remove("hidden");
    fetchCaptcha();
});

// Handle voice recording
async function recordAudio() {
    recordingStatus.innerText = "🎙️ Recording...";
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        recordedBlob = new Blob(audioChunks, { type: "audio/wav" });
        recordingStatus.innerText = "✅ Recording complete!";
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 4000);
}

recordBtn.addEventListener("click", recordAudio);

// Verify CAPTCHA and add comment
async function verifyCaptcha() {
    if (!recordedBlob) {
        alert("Record your answer first!");
        return;
    }

    const formData = new FormData();
    formData.append("audio", recordedBlob);
    formData.append("id", captchaId);

    submitCaptchaBtn.innerText = "Verifying...";

    const response = await fetch("http://127.0.0.1:5000/verify", {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    if (result.success) {
        captchaSection.classList.add("hidden");
        commentSection.innerHTML += `<div class="comment user-comment"><div class="comment-avatar">🧑‍💻</div><div class="comment-content"><p><strong>You</strong> <span class="comment-timestamp"> - Just now</span></p><p>${userComment}</p></div></div>`;
    } else {
        alert(`❌ Try again! You said: "${result.user_text}"`);
    }
}

submitCaptchaBtn.addEventListener("click", verifyCaptcha);

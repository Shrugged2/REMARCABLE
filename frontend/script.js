const API_BASE_URL = "http://127.0.0.1:5000";  // Flask backend URL
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

// Fetch existing comments from backend
async function loadComments() {
    const response = await fetch(`${API_BASE_URL}/get-comments`);
    const comments = await response.json();

    commentSection.innerHTML = `<h2>💬 Comments</h2>`; // Reset comments section
    comments.forEach(comment => {
        commentSection.innerHTML += `
            <div class="comment">
                <div class="comment-avatar">🧑‍💻</div>
                <div class="comment-content">
                    <p><strong>${comment.username}</strong> <span class="comment-timestamp"> - Just now</span></p>
                    <p>${comment.comment}</p>
                </div>
            </div>
        `;
    });
}

// Handle comment submission
submitCommentBtn.addEventListener("click", async () => {
    userComment = userCommentInput.value.trim();
    if (!userComment) {
        alert("Please enter a comment.");
        return;
    }

    const response = await fetch(`${API_BASE_URL}/submit-comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: userComment })
    });

    const data = await response.json();
    if (data.captcha) {
        userCommentInput.value = ""; // Clear input field
        captchaSection.classList.remove("hidden");
        captchaText.innerText = data.captcha;
        captchaId = data.captcha_id;
    }
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
    formData.append("comment", userComment); // Attach the comment

    submitCaptchaBtn.innerText = "Verifying...";

    const response = await fetch(`${API_BASE_URL}/verify`, {
        method: "POST",
        body: formData
    });

    const result = await response.json();
    if (result.success) {
        captchaSection.classList.add("hidden");
        loadComments(); // Refresh comments after successful CAPTCHA
    } else {
        alert(`❌ Try again! You said: "${result.user_text}"`);
    }
}

submitCaptchaBtn.addEventListener("click", verifyCaptcha);

// Load initial comments on page load
loadComments();

const API_BASE_URL = "https://remarc-able-4ad78ce5058a.herokuapp.com";

// Elements
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

// 📌 Load existing comments on page load
async function loadComments() {
    try {
        const response = await fetch(`${API_BASE_URL}/get-comments`);
        const comments = await response.json();
        commentSection.innerHTML = `<h2>💬 Comments</h2>`; // Reset section
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
    } catch (error) {
        console.error("Error loading comments:", error);
    }
}

// 📌 Handle comment submission (Step 1)
submitCommentBtn.addEventListener("click", async () => {
    userComment = userCommentInput.value.trim();
    if (!userComment) {
        alert("Please enter a comment.");
        return;
    }

    try {
        // Send the comment to the backend to generate a CAPTCHA challenge
        const response = await fetch(`${API_BASE_URL}/submit-comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: userComment })
        });

        const data = await response.json();
        if (data.captcha) {
            // Hide input, show CAPTCHA
            userCommentInput.value = "";  // Clear input field
            captchaSection.classList.remove("hidden");
            captchaText.innerText = data.captcha;
            captchaId = data.captcha_id;
        }
    } catch (error) {
        console.error("Error submitting comment:", error);
    }
});

// 📌 Handle voice recording (Step 2)
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
    setTimeout(() => mediaRecorder.stop(), 4000); // Stop after 4 seconds
}

recordBtn.addEventListener("click", recordAudio);

// 📌 Verify CAPTCHA & Submit Final Comment (Step 3)
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

    try {
        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            // Hide CAPTCHA, refresh comments
            captchaSection.classList.add("hidden");
            loadComments();
        } else {
            alert(`❌ Try again! You said: "${result.user_text}"`);
        }
    } catch (error) {
        console.error("Error verifying CAPTCHA:", error);
    }
}

submitCaptchaBtn.addEventListener("click", verifyCaptcha);

// 📌 Load comments when the page starts
loadComments();

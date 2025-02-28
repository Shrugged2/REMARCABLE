const API_BASE_URL = "https://remarc-able-4ad78ce5058a.herokuapp.com";

// Elements
const userCommentInput = document.getElementById("user-comment");
const submitCommentBtn = document.getElementById("submit-comment");
const captchaSection = document.getElementById("captcha-section");
const captchaText = document.getElementById("captcha-text");
const recordBtn = document.getElementById("record-btn");
const recordingStatus = document.getElementById("recording-status");
const submitCaptchaBtn = document.getElementById("submit-captcha");

let userComment = "";
let captchaId = null;
let recordedBlob = null;

// ✅ **Handle Comment Submission (Step 1)**
submitCommentBtn.addEventListener("click", async () => {
    userComment = userCommentInput.value.trim();
    if (!userComment) {
        alert("🚨 Please enter a comment.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/submit-comment`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ comment: userComment })
        });

        const data = await response.json();
        if (data.captcha) {
            userCommentInput.value = "";  // Clear input field
            captchaSection.classList.remove("hidden");
            captchaText.innerText = data.captcha;
            captchaId = data.captcha_id;
        }
    } catch (error) {
        console.error("❌ Error submitting comment:", error);
    }
});

// ✅ **Handle Audio Recording (Step 2)**
async function recordAudio() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = event => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
            recordedBlob = new Blob(audioChunks, { type: "audio/wav" });
            console.log("🎙️ Audio recorded:", recordedBlob);

            // Automatically verify CAPTCHA after recording
            await verifyCaptcha();
        };

        mediaRecorder.start();
        setTimeout(() => mediaRecorder.stop(), 4000);

        recordingStatus.innerText = "🎤 Recording... (4 sec)";
        console.log("🎙️ Recording started...");

    } catch (error) {
        console.error("❌ Error accessing microphone:", error);
        alert("🚨 Unable to access microphone.");
    }
}

recordBtn.addEventListener("click", recordAudio);

// ✅ **Verify CAPTCHA & Submit Final Comment (Step 3)**
async function verifyCaptcha() {
    if (!recordedBlob) {
        alert("🚨 Record your answer first!");
        return;
    }

    const formData = new FormData();
    formData.append("audio", recordedBlob, "audio.wav");
    formData.append("id", captchaId);
    formData.append("comment", userComment);

    submitCaptchaBtn.innerText = "Verifying...";

    try {
        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: "POST",
            body: formData,
            headers: {
                "Accept": "application/json"  // Ensures JSON response
            }
        });

        console.log("🔍 Raw response:", response);

        if (!response.ok) {
            throw new Error(`❌ HTTP ${response.status} - ${response.statusText}`);
        }

        const result = await response.json();
        console.log("🎯 Server Response:", result);

        if (result.success) {
            alert("🎉 YAAAAAASSSS BITCHES! 🎊✨");
            captchaSection.classList.add("hidden");  // Hide CAPTCHA
        } else {
            alert(`❌ Try again! You said: "${result.user_text}", but expected: "${result.expected}"`);
        }
    } catch (error) {
        console.error("❌ Error verifying CAPTCHA:", error);
        alert("🚨 Something went wrong with verification.");
    } finally {
        submitCaptchaBtn.innerText = "Submit Answer";
    }
}

submitCaptchaBtn.addEventListener("click", verifyCaptcha);

const recordBtn = document.getElementById("record-btn");
const recordingStatus = document.getElementById("recording-status");
const captchaSection = document.getElementById("captcha-section");
const captchaText = document.getElementById("captcha-text");
const submitCaptchaBtn = document.getElementById("submit-captcha");

let captchaId = null;
let recordedBlob = null;

async function fetchCaptcha() {
    const response = await fetch("http://127.0.0.1:5000/get-captcha");
    const data = await response.json();
    captchaText.innerText = data.quote;
    captchaId = data.id;
}

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

        // Show CAPTCHA after a slight delay
        setTimeout(() => {
            captchaSection.classList.remove("hidden");
            fetchCaptcha();
        }, 1000);
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 4000);
}

async function sendAudio() {
    if (!recordedBlob) {
        alert("Record your comment first!");
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
        submitCaptchaBtn.innerText = "✅ Verified!";
    } else {
        submitCaptchaBtn.innerText = `❌ Try again! You said: "${result.user_text}"`;
    }
}

recordBtn.addEventListener("click", recordAudio);
submitCaptchaBtn.addEventListener("click", sendAudio);

const recordBtn = document.getElementById("record-btn");
const statusText = document.getElementById("status");
let captchaId = null;

async function fetchCaptcha() {
    const response = await fetch("http://127.0.0.1:5000/get-captcha");
    const data = await response.json();
    document.getElementById("captcha-text").innerText = data.quote;
    captchaId = data.id;
}

async function recordAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("id", captchaId);

        statusText.innerText = "Verifying...";

        const response = await fetch("http://127.0.0.1:5000/verify", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            statusText.innerText = "✅ CAPTCHA Passed!";
        } else {
            statusText.innerText = `❌ Failed. You said: "${result.user_text}"`;
        }
    };

    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 4000); // Auto-stop after 4 sec
}

recordBtn.addEventListener("click", recordAudio);
fetchCaptcha();

document.addEventListener("DOMContentLoaded", () => {
  urlInput = document.getElementById("url");
  customInput = document.getElementById("custom");
  shortenButton = document.querySelector(".shorten");
  mainbox = document.querySelector(".mainbox");

  urlInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      shorten();
    }
  });
  urlInput.focus();
});

const urlRegex =
  /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

async function shorten() {
  const url = urlInput.value.trim();
  const alias = customInput.value.trim() || generateRandomString();

  if (!url) {
    alert("Please provide a URL");
    return;
  }

  if (!urlRegex.test(url)) {
    alert("Invalid URL format.");
    return;
  }

  try {
    const response = await fetch("https://api.ch3n.cc/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ alias, url }),
    });

    if (response.ok) {
      let html = `
          <input class="input" id="url" autocomplete="off" disabled />
        <br>
        <p class="customize">MiniURL:</p>
        <a class='link' href="https://8ms.me/${alias}">8ms.me/${alias}</a><br><br>

        <br>
        <button class="buttons" onclick="qr('https://8ms.me/${alias}')"><i class="fa-solid fa-qrcode"></i> QR</button><button class="buttons green"
            onclick="copy('https://8ms.me/${alias}')"><i class="fa-solid fa-copy"></i> Copy</button><br>
        <button class="buttons" onclick="location.href = '/'">Generate Another</button>
        `;
      mainbox.innerHTML = html;
      const resultInput = document.getElementById("url");
      resultInput.value = url;
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while shortening the URL.");
  }
}
function generateRandomString() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function qr(url) {
  window.open(
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${url}`,
    "_blank"
  );
}

function copy(text) {
  navigator.clipboard.writeText(text);
}

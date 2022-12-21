/////////////////////////////////////////////////////////////
//changing animation name for the text animation for second time
// const textAnimDuration =
//   window.getComputedStyle(document.querySelector(".flip span:first-child"))
//     ?.animationDuration?.[0] || 4;

// setTimeout(() => {
//   document.querySelectorAll(".flip span:first-child").forEach((el) => {
//     el.style.setProperty("--top", "-100%");
//   });
// }, textAnimDuration * 1000);

function setVendor(element, property, value) {
  const capitalize = property.charAt(0).toUpperCase() + property.slice(1);
  element.style["webkit" + capitalize] = value;
  element.style[property] = value;
}

document.querySelectorAll(".flip-content").forEach((el) => {
  let currentText = 0;
  setInterval(() => {
    if (currentText === 1) {
      el.classList.remove("no-transition");
    }

    // el.style.transform = `translateY(calc(${currentText * 100}% + ${
    //   10 * currentText
    // }px))`;
    setVendor(
      el,
      "transform",
      `translateY(calc(${currentText * 100}% + ${10 * currentText}px))`
    );
    currentText += 1;

    if (currentText === el.childElementCount) {
      setTimeout(() => {
        el.classList.add("no-transition");
        // el.style.transform = `translateY(0)`;
        setVendor(el, "transform", `translateY(0)`);
        currentText = 1;
        // setTimeout(() => {
        //   el.classList.remove("no-transition");
        // }, 200);
      }, 400);
    }
  }, 1300);
});

///////////////////////////////////////////////////////////////
//search
const searchBtn = document.getElementById("searchBtn");
const searchForm = document.querySelector(".search-bar form");
const searchCloseBtn = document.getElementById("closeHomeForm");
const home = document.querySelector(".home");

const searchActive = () => {
  home.classList.toggle("search");
};

// const searchSubmit = (e) => {
//   console.log(e);
//   if (e.preventDefault) e.preventDefault();

//   document.getElementById('searchTerm').value
//   home.classList.toggle("search");
// };

searchBtn.addEventListener("click", searchActive);
searchCloseBtn.addEventListener("click", searchActive);
searchForm.addEventListener("submit", searchActive);

/////////////////////////////////////////////////
//search suggession

const searchRes = [
  { name: "Adam", countryCode: "in", page: "pageLinkAdam" },
  { name: "Adnan", countryCode: "sp", page: "pageLinkAdnan" },
  { name: "Guru", countryCode: "uk", page: "pageLinkGuru" },
  { name: "Samantha", countryCode: "us", page: "pageLinkSamantha" },
  { name: "Zathani", countryCode: "de", page: "pageLinkZathani" },
];

const searchInput = document.querySelector(".home .search-bar input");
const searchSug = document.querySelector(".home .search-bar .sug");

let searchTi;

function searchSubmit(name) {
  console.log(searchInput);
  searchInput.value = name;
  searchForm.submit();
}

function updateSug(el) {
  if (searchTi) clearTimeout(searchTi);
  searchTi = setTimeout(() => {
    if (el.target.value) {
      searchSug.innerHTML = "";

      const filterdRes = searchRes.filter((e) =>
        e.name.toLowerCase().includes(el.target.value.toLowerCase())
      );

      filterdRes.forEach((e) => {
        searchSug.insertAdjacentHTML(
          "beforeend",
          `<p onclick="searchSubmit('${e.name}')">${e.name}</p>`
        );
      });

      if (filterdRes.length) searchSug.classList.remove("hide");
      else searchSug.classList.add("hide");
    }
  }, 1000);
}

searchInput.addEventListener("focus", updateSug);
searchInput.addEventListener("input", updateSug);
document.querySelector(".home .search-bar").addEventListener("blur", () => {
  searchSug.classList.add("hide");
});

/////////////////////////////////////////////////////
//insert chat-box from data
const chatHtml = ({ name, IPA, countryFlag, shorcut, audioFile }) =>
  `<div class="chat">
  <a href="/${shorcut}">
    <div class="top">
      <img src="./images/flags/flag-${countryFlag}" alt="flag" />
      <div class="content">
        <p>[${IPA}]</p>
        <h3>${name}</h3>
      </div>
    </div>
  </a>
  <div class="bottom" onclick="chatClick(this, '${audioFile}')">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11 5L6 9H2V15H6L11 19V5Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M19.07 4.93005C20.9447 6.80533 21.9979 9.34841 21.9979 12.0001C21.9979 14.6517 20.9447 17.1948 19.07 19.0701M15.54 8.46005C16.4774 9.39769 17.004 10.6692 17.004 11.9951C17.004 13.3209 16.4774 14.5924 15.54 15.5301"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <h4>Pronounce</h4>
  </div>
  <svg
    class="shape"
    width="71"
    height="73"
    viewBox="0 0 71 73"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 62.5252V10.3583C0 4.6975 4.6946 0.165303 10.3519 0.364504L64.6056 2.27485C68.173 2.40046 71 5.3288 71 8.89836C71 10.5707 70.3678 12.1812 69.2302 13.4069L17.3296 69.3279C11.1461 75.9905 0 71.6151 0 62.5252Z"
      fill="white"
    />
  </svg>
</div>`;

const dataNames = [
  {
    name: "Joe",
    IPA: "JoeIPA",
    countryFlag: "us.png",
    shorcut: "linkOne",
    audioFile: "joe.mp3",
  },
  {
    name: "Samantha",
    IPA: "SamanthaIPA",
    countryFlag: "es.png",
    shorcut: "linkTwo",
    audioFile: "samantha.mp3",
  },
  {
    name: "David",
    IPA: "davidIPA",
    countryFlag: "ru.png",
    shorcut: "linkThree",
    audioFile: "david.mp3",
  },
];

const chatContainer = document.querySelector(".home .chat-container");

let audio = new Audio();
let isPlaying = false;
let currentChatNode = "";

function styleChat() {
  if (isPlaying) currentChatNode.classList.add("playing");
  else currentChatNode.classList.remove("playing");
}

audio.addEventListener("error", (e) => {
  console.error("Loading song Failed. Try reloading the page");
});

audio.addEventListener("play", () => {
  isPlaying = true;
  animateChat();
  styleChat();
});
audio.addEventListener("pause", () => {
  isPlaying = false;
  animateChat();
  styleChat();
});
audio.addEventListener("ended", () => {
  isPlaying = false;
  animateChat();
  styleChat();
});

audio.src = "./audio/Felipe.mp3";
function chatClick(e, audioFile) {
  console.log(audioFile);
  /////play audio
  // if (audio.src !== audioFile) {
  //   audio.src = "./audio/Felipe.mp3";
  //   audio.pause();
  // }
  if (audio.paused) {
    currentChatNode = e;
    audio.currentTime = 0;
    audio.play();
  } else {
    audio.pause();
  }
}

dataNames.forEach((el) => {
  chatContainer.insertAdjacentHTML("beforeend", chatHtml(el));
});

chatContainer.insertAdjacentHTML("beforeend", chatHtml(dataNames[0]));

///////////////////////////////////////////////////////
//animate chatbox
let currentChat = 0;
let chatHovered = false;
let isChatAni = true;

//showing first chat onstart
chatContainer.children[currentChat].classList.add("show-chat");

const chatAnimate = () => {
  //animate if chatContainer not hovered
  if (isChatAni) {
    //adding transition duration for the first element and container
    if (currentChat === 0) {
      chatContainer.classList.remove("end-chat");
      chatContainer.children[0].classList.remove("end-chat");
    }

    //hiding current chat
    chatContainer.children[currentChat].classList.remove("show-chat");

    // showing next chat
    chatContainer.children[currentChat + 1].classList.add("show-chat");
    // { current chat + 1 * (current chat height + currentchat margin bottom)}
    chatContainer.style.transform = `translateY(-${
      (currentChat + 1) *
      (chatContainer.children[currentChat].clientHeight + 80)
    }px)`;

    // if next chat is the last chat
    if (currentChat + 1 === dataNames.length) {
      //waiting for animation to complete
      setTimeout(() => {
        //removing transition duration for the first element and container, so it can switch from last chat instantly.
        chatContainer.classList.add("end-chat");
        chatContainer.children[0].classList.add("end-chat");

        //showing first element
        chatContainer.children[0].classList.add("show-chat");
        chatContainer.style.transform = `translateY(-${0}px)`;

        //hiding last element
        chatContainer.children[currentChat + 1].classList.remove("show-chat");

        //reseting chat
        currentChat = 0;
      }, 1000);
    } else {
      //updating current chat
      currentChat++;
    }
  }
};

setInterval(chatAnimate, 3000);

function animateChat() {
  if (chatHovered) {
    isChatAni = false;
  } else {
    if (!isPlaying) isChatAni = true;
    else isChatAni = false;
  }
}

//hover events to stop chat animation on hover
chatContainer.addEventListener("pointerenter", () => {
  chatHovered = true;
  animateChat();
});
chatContainer.addEventListener("pointerleave", () => {
  chatHovered = false;
  animateChat();
});

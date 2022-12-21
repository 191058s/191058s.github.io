//*******************************************************************//
//*******************************************************************//
//*******************************************************************//
// Form steps
const container = document.querySelector(".view-container");
const prev = document.querySelectorAll("#prev-step");
const steps = document.querySelectorAll(".step:not(.accounts, .success");
const progressBar = document.querySelector(
  ".mid-vectors .bottom.progress-bar .progress"
);

let currentStep = 0;
let interval;

function changeStep(type) {
  if (type === "prev") currentStep--;
  else if (type === "next") currentStep++;
  //scrolling to progressbar
  //slideing to next form
  container.style.transform = `translateX(${currentStep * -100}%)`;

  //removing previous steps current class
  setTimeout(() => {
    steps.forEach((el, i) => {
      document.querySelector(".mid-vectors .bg").scrollIntoView();
      if (i !== currentStep) el.classList.remove("current");
      steps[currentStep].classList.add("current");
    });
  }, 100);

  // updating current step class

  //calculating progress percent
  let percent = Math.round((currentStep / (steps.length - 1)) * 100);

  // getting previous progress precent
  let currentPercent = progressBar.getAttribute("percent");

  //if already animating stop it
  if (interval) {
    clearInterval(interval);
  }

  //updating percentage on 2 millisecond
  interval = setInterval(() => {
    //stoping if progressbar filled to percentage
    if (currentPercent !== percent) {
      //reducing or adding progress
      percent > currentPercent ? currentPercent++ : currentPercent--;

      //filling progress bar
      progressBar.style.background = `conic-gradient(white, ${
        currentPercent * 3.6
      }deg, var(--input-bg) 0deg)`;

      //updating progress value
      progressBar.setAttribute("percent", percent);
    } else {
      clearInterval(interval);
    }
  }, 2);
}
changeStep();

$("#skip-step").click(function () {
  currentStep++;
  changeStep();
});

// next.forEach((el) => {
//   el.addEventListener("click", (e) => {
//     currentStep++;
//     changeStep();
//   });
// });

prev.forEach((el) => {
  el.addEventListener("click", () => {
    changeStep("prev");
  });
});

//*******************************************************************//
//*******************************************************************//
//*******************************************************************//
//formdata
let formData = {};

// const validate = (step, btn) => {
//   //getting all required data
//   const required = document.querySelectorAll(`#step${step} input[required]`);

//   //creating new array with length of required nodes intialized to false
//   const requiredArr = [...Array(required.length)].map((e) => false);

//   const onChange = (node, i) => {
//     //tracking if required nodes has values
//     if (!node.value) requiredArr[i] = false;
//     else requiredArr[i] = true;

//     //disabling or enabling button based on required nodes are empty
//     if (requiredArr.includes(false)) btn.setAttribute("disabled", true);
//     else btn.removeAttribute("disabled");
//   };

//   required.forEach((el, i) => {
//     //checking if required nodes has values onload
//     onChange(el, i);

//     el.addEventListener("input", (e) => {
//       onChange(e.target, i);
//     });
//     el.addEventListener("change", (e) => {
//       onChange(e.target, i);
//     });
//   });
// };

const updateFData = (data, key = formData) => {
  data.forEach((el) => {
    if (el.value !== "") key[el.name] = el.value;
  });
};

//*******************************************************************//
//step1

// validate(1, s1Btn);
$("#step1 form").submit(function (e) {
  e.preventDefault();
  let data = $(this).serializeArray();

  formData.name = data.find((el) => el.name === "name").value;

  if (!formData.spellings) formData.spellings = [{}];
  updateFData(
    data.filter((el) => el.name !== "name"),
    formData.spellings[0]
  );
  console.log(formData);
  changeStep("next");
});

//*******************************************************************//
//step2
const step2 = document.querySelector("#step2");
//record audio
let recorder, audio_stream;
const recordButton = document.querySelectorAll("#recordButton");
const stopButton = document.querySelectorAll("#stopButton");
const redoButton = document.querySelectorAll("#redoRecord");
let timeout_status;

const audioInput = document.querySelectorAll("#audioFile");
const recBtn = document.querySelector("#step2 .title button");
// const recPlaybar = document.querySelector("#step2 .playbar-container");
const recPlayBtn = document.querySelectorAll("#recplay");
const recPauseBtn = document.querySelectorAll("#recpause");
let recAudioFile;
const recAudio = new Audio();

$(".recvolbar").val(50);
recAudio.volume = $(".recvolbar").val() / 100;
let isChanging = false;
let recLoaded = false;

// start recording
recordButton.forEach((el) => {
  el.addEventListener("click", startRecording);
});

// stop recording
stopButton.forEach((el) => {
  el.addEventListener("click", stopRecording);
});

redoButton.forEach((el) => {
  el.addEventListener("click", startRecording);
});

function startRecording() {
  //pausing audio if played on recording
  $(".upload #step2, .upload .edit-audio").removeClass("play playing");
  recAudio.pause();

  //clearing upload file input
  audioInput.forEach((el) => {
    el.value = "";
  });
  // button settings
  recordButton.forEach((el) => {
    el.parentNode.classList.add("recording");
  });

  redoButton.forEach((el) => {
    el.classList.add("disabled");
  });

  navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    audio_stream = stream;
    recorder = new MediaRecorder(stream);
    recorder.start();

    // when there is data, save it
    recorder.ondataavailable = function (e) {
      saveRecordFile(new File([e.data], "name", { type: "audio/mp3" }));
    };

    if (timeout_status) clearTimeout(timeout_status);

    timeout_status = setTimeout(function () {
      console.log("30 secs timeout");
      stopRecording();
    }, 30000);
  });
}

function stopRecording() {
  if (timeout_status) clearTimeout(timeout_status);
  recorder.stop();
  audio_stream.getAudioTracks()[0].stop();

  // buttons reset
  recordButton.forEach((el) => {
    el.parentNode.classList.remove("recording");
  });
}

// upload audio file
audioInput.forEach((el) => {
  el.addEventListener("change", (e) => {
    saveRecordFile(e.target.files[0]);
  });
});

//save audio file
function saveRecordFile(file) {
  $(".record-err").removeClass("show");
  recLoaded = false;
  audioFileSize = file.size;
  console.log(audioFileSize);
  //alert(audioFileSize);
  if (
    audioFileSize > 1048576 ||
    audioFileSize < 1024 
    //|| !file.type.includes("audio/")
  ) {
    $(".record-err p").text(
      "File must be audio only, larger than 1K and smaller than 1MB."
    );
    $(".record-err").addClass("show");
  } else {
    //alert("saved");
    recAudioFile = file;
    recAudio.src = URL.createObjectURL(file);
    recAudio.load();

    //enabling redo record btn
    redoButton.forEach((el) => {
      el.classList.remove("disabled");
    });
  }
}

//playbar functionalities

//change volume
$(".recvolbar").on("input", (e) => {
  recAudio.volume = e.target.value / 100;
});

$(".recvolbar").on("wheel", (e) => {
  if (e.deltaY < 0) {
    if (Number(e.target.value) < 90) {
      recAudio.volume = (Number(e.target.value) + 10) / 100;
    } else {
      recAudio.volume = 1;
    }
  } else {
    if (Number(e.target.value) > 10) {
      recAudio.volume = (Number(e.target.value) - 10) / 100;
    } else {
      recAudio.volume = 0;
    }
  }
});

function changeRecBar(value) {
  $(".recbar").val(value);
  $(".recbar").css(
    "--seek-before-width",
    `${(value / recAudio.duration) * 100}%`
  );
}

//onload
recAudio.addEventListener("loadeddata", (e) => {
  recLoaded = true;
  //alert("loaded");
  $(".upload #step2, .upload .edit-audio").addClass("play");
  recBtn.removeAttribute("disabled");
  changeRecBar(0);
  $(".recbar").attr("max", `${recAudio.duration}`);
});

//error
recAudio.addEventListener("error", () => {
  $(".record-err p").text("something went wrong with Audio file");
  $(".record-err").addClass("show");
});

//play
recPlayBtn.forEach((el) => {
  el.addEventListener("click", () => {
    recAudio.play();
    $(".upload #step2, .upload .edit-audio").addClass("playing");
    recBtn.setAttribute("disabled", "");
  });
});

// playing
recAudio.addEventListener("timeupdate", (e) => {
  if (!isChanging) changeRecBar(e.target.currentTime);
});

//changing current time if recbar changed
$(".recbar").on("mousedown touchstart", () => {
  isChanging = true; //stop updating while playing
});

//changing current time if recbar changed
$(".recbar").on("input", (e) => {
  changeRecBar(e.target.value);
});

//changing current time if recbar changed
$(".recbar").on("mouseup touchend", (e) => {
  isChanging = false;
  recAudio.currentTime = e.target.value;
});

// pause
recPauseBtn.forEach((el) => {
  el.addEventListener("click", () => {
    recAudio.pause();
    $(".upload #step2, .upload .edit-audio").removeClass("playing");
    recBtn.removeAttribute("disabled", "");
  });
});

//ended
recAudio.addEventListener("ended", () => {
  setTimeout(() => {
    changeRecBar(recAudio.duration - 0.001);
    $(".upload #step2, .upload .edit-audio").removeClass("playing");
    recBtn.removeAttribute("disabled", "");
    changeRecBar(0);
  }, 500);
});

$("#step2 #next-step").click(function (e) {
  if (recLoaded) {
    formData.spellings[0].audio = recAudioFile;
    recAudio.pause();
    changeStep("next");
  } else {
    $(".record-err p").text("Please record or upload an audio file");
    $(".record-err").addClass("show");
  }

  console.log(formData);
});

//*******************************************************************//
//step3

// dynamic form
const dMoreBtn = document.querySelector("#step3 .more");
const dForm = document.querySelector("#step3 .dynamic-form");
const dWrapper = document.querySelector("#step3 #dynamic-wrapper");
const dContent = document.querySelector("#step3 #dynamic-wrapper #form0");
let count = 0;
let dData = [];

dMoreBtn.addEventListener("click", () => {
  //update count
  count++;

  //clone element with its childs
  let newNode = dContent.cloneNode(true);
  newNode.id = `form${count}`;

  //change value and name of inputs
  let spelling = newNode.querySelector("#spelling");
  spelling.value = "";
  spelling.setAttribute("name", `spelling${count}`);

  //change value and name of inputs
  let country = newNode.querySelector("#countriesList");
  country.value = "";
  country.setAttribute("name", `country${count}`);

  //delete event
  newNode.querySelector("#delete").addEventListener("click", () => {
    dWrapper.querySelector("#" + newNode.id).remove();
  });

  dWrapper.appendChild(newNode);
});

$("#step3 .dynamic-form").submit(function (e) {
  e.preventDefault();

  // Get all the forms elements and their values in one step jquery
  const values = $(this).serializeArray();

  //saving as object
  for (let i = 0; i < values.length; i += 2) {
    if (values[i].value && values[i + 1].value) {
      formData.spellings.push({
        spelling: values[i].value,
        country: values[i + 1].value,
      });
    }
  }
  changeStep("next");

  console.log(formData);
});

//*******************************************************************//
//step4

// upload photo
document.querySelectorAll("#uploadProfile").forEach((el) => {
  el.addEventListener("change", () => {
    let img = el.files[0];

    if (img.size > 5242880 || img.size < 1024 || !img.type.includes("image/")) {
      $(".img-err p").text(
        "File must be image only, larger than 1K and smaller than 5MB."
      );
      $(".img-err").addClass("show");
    } else {
      $(".img-err").removeClass("show");

      formData.avatar = img;

      console.log(URL.createObjectURL(img));
      console.log(formData);
    }
  });
});

//connect account
let accountConnected = false;
$("#connectAccounts").click(function () {
  //remove error msg
  $("#step4 .err-msg").removeClass("show");

  //show accounts step
  $(".step.accounts").addClass("show");
  accountConnected = true;

  //swipe to accounts step without updating currentStep
  container.style.transform = `translateX(${(currentStep + 1) * -100}%)`;

  //removing previous steps current class
  setTimeout(() => {
    steps.forEach((el) => {
      if (!el.classList.contains("accounts")) el.classList.remove("current");
    });
  }, 100);

  // updating current step class
  $(".step.accounts").addClass("current");
});

$("#step4 #next-step").click(function () {
  changeStep("next");
  populateData();
});

//*******************************************************************//
//accounts step
$(".step.accounts #cancel-step").click(function () {
  $(".step.accounts").removeClass("show");
  accountConnected = false;

  changeStep();
});

//*******************************************************************//
//step5
let pAudio = new Audio();
let pPlaying = false;
let pCurrentAudio = 0;
let pCurrentPri = 0;
let pCurrentSec = 0;

pAudio.addEventListener("ended", () => {
  pPlaying = false;
  $("#step5 .preview .sec #audio").removeClass("playing");
});

//update populated data
function populateData() {
  //profile img
  let img = document.querySelector("#step5 .preview .profile .img");
  if (formData.avatar) {
    img.style.backgroundImage = `url("${URL.createObjectURL(
      formData.avatar
    )}")`;
  } else {
    img.style.backgroundImage = `url("${img.getAttribute("defaulturl")}")`;
  }

  //profile name
  $("#step5 .preview .profile p").text(formData.name);

  //primary spelling name
  document.querySelectorAll("#step5 .preview .dashed.spell").forEach((n) => {
    n.parentNode.removeChild(n);
  });

  function populatePopupForm(frm, data) {
    $.each(data, function (key, value) {
      console.log(key, value);
      $("[name=" + key + "]", frm).val(value);
    });
  }

  //element with no upcoming events
  let element = $("#step5 .preview .dashed");
  formData.spellings.forEach((el, i) => {
    let node = element.clone(true); //clone element with event listners
    node.attr("id", i);

    //primary
    node.find(".main .content h1").text(formData.name);
    node.find(".main .content p").text(`[${el.spelling}]`);
    node.find(".main .icon").on("click", () => {
      pCurrentPri = i;
      populatePopupForm(".edit-name.pop-up-container form", {
        ...el,
        name: formData.name,
      });
      document.querySelector(".edit-name").classList.remove("hide");
    });

    //secondary
    node.find(".sec .content .gray").text(formData.name);
    node.find(".sec .content .cou").text(el.country);
    node.find(".sec .icon").on("click", () => {
      pCurrentSec = i;
      pAudio.pause();
      if (el.audio) {
        recAudioFile = el.audio;
        recAudio.src = URL.createObjectURL(el.audio);
      } else {
        recAudioFile = undefined;
        recAudio.src = "";
        setTimeout(() => {
          $(".record-err").removeClass("show");
        }, 100);
      }

      $(".edit-audio").removeClass("hide");
    });

    //audio event
    node.find(".sec #audio").on("click", (e) => {
      if (pPlaying && pCurrentAudio === i) {
        pAudio.pause();
        pPlaying = false;
        e.currentTarget.classList.remove("playing");
      } else {
        if (el.audio) {
          pAudio.src = URL.createObjectURL(el.audio);
          pAudio.play();
          pCurrentAudio = i;
          pPlaying = true;
          e.currentTarget.classList.add("playing");
        } else {
          pAudio.pause();
          pPlaying = false;
          $("#step5 .preview .sec #audio").removeClass("playing");
        }
      }
    });

    if (i) {
      node.addClass("spell");
      $("#step5 .preview").append(node);
    } else {
      $("#step5 .preview .dashed").first().replaceWith(node);
    }
  });
}

$("#submitForm").click(function () {
  console.log(formData);
  if (!accountConnected) {
    $(".step.accounts").addClass("show");

    //removing previous steps current class
    // setTimeout(() => {
    steps.forEach((el) => {
      if (!el.classList.contains("accounts")) el.classList.remove("current");
    });
    // }, 1000);

    // updating current step class
    $(".step.accounts").addClass("current");
  } else {
    container.style.transform = `translateX(${(currentStep + 1) * -100}%)`;

    steps.forEach((el) => {
      console.log(el);
      if (el.id !== "stepSuccess") el.classList.remove("current");
    });

    // updating current step class
    console.log($("#stepSuccess"));
    $("#stepSuccess").addClass("current");
    $(".mid-vectors").addClass("upload-success");
  }
});

// drag and swap
function addDrag(e) {
  e.target.parentNode.setAttribute("draggable", "true");
}
function removeDrag(e) {
  e.target.parentNode.removeAttribute("draggable");
}

//current dragged element index
let dragIndex = 0;
//to store clone node
let clone = "";

function dragStart(e) {
  //saving dragged id in datatransfer
  e.dataTransfer.setData("dragId", e.target.id);
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  let dragId = e.dataTransfer.getData("dragId");
  if (e.currentTarget.id && e.currentTarget.id !== dragId) {
    //cloning node
    clone = $(e.currentTarget).clone(true);

    //getting index before replace
    dragIndex = $(`#${dragId}`).index();

    // replace drop box to drag box
    $(e.currentTarget).replaceWith($(`#${dragId}.dashed`));

    //insert cloned drop box where drag box existed
    $(".upload .preview")
      .children()
      .eq(dragIndex - 1)
      .after(clone);
  }
}

//pop up
//image open
document
  .querySelector("#step5 .profile .img .icon")
  .addEventListener("click", () => {
    document.querySelector(".edit-image").classList.remove("hide");
  });

//image submit
$(".edit-image.pop-up-container form").submit(function (e) {
  e.preventDefault();
  populateData();
  $(".edit-image.pop-up-container").addClass("hide");
});

//name submit
$(".edit-name.pop-up-container form").submit(function (e) {
  e.preventDefault();

  let data = $(this).serializeArray();

  formData.name = data.find((el) => el.name === "name").value;

  updateFData(
    data.filter((el) => el.name !== "name"),
    formData.spellings[pCurrentPri]
  );
  console.log(formData);
  populateData();

  $(".edit-name.pop-up-container").addClass("hide");
});

//audio submit
$(".edit-audio.pop-up-container button[type='submit']").click(function () {
  if (recLoaded) {
    formData.spellings[pCurrentSec].audio = recAudioFile;
    recAudio.pause();
    $(".edit-audio.pop-up-container").addClass("hide");
  } else {
    $(".record-err p").text("Please record or upload an audio file");
    $(".record-err").addClass("show");
  }
});

//close popups
document.querySelectorAll(".pop-up-container").forEach((el) => {
  el.querySelectorAll("#flagCloseButton").forEach((e) => {
    e.addEventListener("click", () => {
      el.classList.add("hide");
    });
  });

  el.querySelector(".trans-bg").addEventListener("click", () => {
    el.classList.add("hide");
  });
});

// target date of the event
const EVENT_DATE_STR = "August 10, 2024 13:00:13";
// meh, quick and dirty
const SEPERATOR_ELEMENT_HTML_STR = `<span class="seperator">:</span>`;

// is the element curretly visible
let isVisible = true;
// should use the red class
let showRed = false;

// closed over below
let index = 0;

function doTypewriter(ms, textElement, textContent) {
  return new Promise((resolve) => setTimeout(resolve, ms)).then(() => {
    (function typewriterEffect(textElement, textContent) {
      if (index < textContent.length) {
        const spanChild = document.createElement("span");
        spanChild.classList.add("messageChar");
        spanChild.textContent = textContent.charAt(index);
        textElement.appendChild(spanChild);
        index++;
        setTimeout(() => {
          typewriterEffect(textElement, textContent);
        }, 100);
      }
    })(textElement, textContent);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const SEPERATOR_ELEMENTS = document.getElementsByClassName("seperator");

  const eventDate = new Date(EVENT_DATE_STR).getTime();
  const countdownElement = document.getElementById("countdown");

  const eventElement = document.getElementById("eventdate");
  const eventStr = `Event date: ${EVENT_DATE_STR}`;

  // this is hardcoded to the same duration as the fade-in effect
  doTypewriter(1500, eventElement, eventStr);

  function setCountdownText() {
    const now = new Date().getTime();

    const remaining = eventDate - now;
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `${days} Days ${hours}${SEPERATOR_ELEMENT_HTML_STR}${minutes}${SEPERATOR_ELEMENT_HTML_STR}${seconds}`;
    return remaining;
  }

  // run on DOM load to avoid waiting until the initial interval to display countdown
  setCountdownText();

  const interval = setInterval(function () {
    if (setCountdownText() < 0) {
      clearInterval(interval);
      countdownElement.innerText = "Time's up";
    }

    // blink the seperator ':' on each invocation of this interval
    const sepElementsArr = Array.from(SEPERATOR_ELEMENTS);

    // invoked when isVisible
    function toggleClassesWhenVisible() {
      sepElementsArr.forEach((el) => {
        el.classList.remove("invisible"); // show on next invocation
        showRed ? el.classList.add("loudRed") : el.classList.remove("loudRed"); // toggle the color
      });
      showRed = !showRed;
    }

    isVisible
      ? toggleClassesWhenVisible()
      : sepElementsArr.forEach((el) => {
          el.classList.add("invisible");
        });

    isVisible = !isVisible;
  }, 1000);
});

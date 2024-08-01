const EVENT_DATE_STR = "August 10, 2024 13:00:13";
// meh, quick and dirty
const SEPERATOR_ELEMENT_HTML_STR = `<span class="seperator">:</span>`;

let isVisible = true;
let showRed = false;

document.addEventListener("DOMContentLoaded", function () {
  const SEPERATOR_ELEMENTS = document.getElementsByClassName("seperator");

  const eventDate = new Date(EVENT_DATE_STR).getTime();
  const countdownElement = document.getElementById("countdown");
  document.getElementById(
    "eventdate"
  ).innerText = `Event date: ${EVENT_DATE_STR}`;

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
    function addClasses() {
      sepElementsArr.forEach((el) => {
        el.classList.remove("invisible");
        showRed ? el.classList.add("loudRed") : el.classList.remove("loudRed");
      });
      showRed = !showRed;
    }

    isVisible
      ? addClasses()
      : sepElementsArr.forEach((el) => {
          el.classList.add("invisible");
        });

    isVisible = !isVisible;
  }, 1000);
});

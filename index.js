(function () {
  // target date of the event
  const EVENT_DATE_STR = "August 10, 2024 13:00:13";

  // meh, quick and dirty
  const SEPERATOR_ELEMENT_HTML_STR = `<span class="seperator">:</span>`;

  // is the element curretly visible
  let isVisible = true;
  // should use the red class
  let showRed = false;

  /*
wait waitDurationMs before applying adding each character in textContent as a new
element to textElement
*/
  function makeTypewriterFunction(
    waitDurationMs,
    textElement,
    textContent,
    timeBetweenCharacters = 100 /* ms */
  ) {
    // closed over below
    let index = 0;

    return async function () {
      await new Promise((resolve) => setTimeout(resolve, waitDurationMs));
      (function typewriterEffect(textElement, textContent) {
        if (index < textContent.length) {
          const spanChild = document.createElement("span");
          spanChild.classList.add("messageChar");
          spanChild.textContent = textContent.charAt(index);
          textElement.appendChild(spanChild);
          index++;

          setTimeout(() => {
            typewriterEffect(textElement, textContent);
          }, timeBetweenCharacters);
        }
      })(textElement, textContent);
    };
  }

  document.addEventListener("DOMContentLoaded", async function () {
    const SEPERATOR_ELEMENTS = document.getElementsByClassName("seperator");

    const eventDate = new Date(EVENT_DATE_STR).getTime();
    const countdownElement = document.getElementById("countdown");

    const eventElement = document.getElementById("eventdate");
    const eventStr = `Event date: ${EVENT_DATE_STR}`;

    // this is hardcoded to the same duration as the fade-in effect
    await makeTypewriterFunction(1200, eventElement, eventStr)();
    await makeTypewriterFunction(
      755,
      document.getElementById("remaining"),
      "Time Remaining:",
      55
    )();

    /*
  Set the countdown element's html to the remaining duration; return
  the remaining time from now until the target date
  */
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
      const initClassesCountdownEl = (() => {
        let hasRunInit = false;

        return function () {
          if (!hasRunInit) {
            hasRunInit = true;
            countdownElement.classList.add(
              "borderedElement",
              "gradientBackground"
            );
          }
        };
      })();

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
          showRed
            ? el.classList.add("loudRed")
            : el.classList.remove("loudRed"); // toggle the color
        });
        if (showRed) {
          countdownElement.classList.remove("borderedElement");
          countdownElement.classList.add("redBorderedElement");
        } else {
          countdownElement.classList.add("borderedElement");
          countdownElement.classList.remove("redBorderedElement");
        }
        showRed = !showRed;
      }

      isVisible
        ? toggleClassesWhenVisible()
        : sepElementsArr.forEach((el) => {
            el.classList.add("invisible");
            countdownElement.className = "";
          });

      isVisible = !isVisible;
    }, 1000);
  });
})();

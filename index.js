const EVENT_DATE_STR = "August 10, 2024 13:00:13";

document.addEventListener("DOMContentLoaded", function () {
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

    countdownElement.innerText = `${days} Days, ${hours} hours ${minutes} minutes ${seconds} seconds`;
    return remaining;
  }

  // run on DOM load to avoid waiting until the initial interval to display countdown
  setCountdownText();

  const interval = setInterval(function () {
    if (setCountdownText() < 0) {
      clearInterval(interval);
      countdownElement.innerText = "Time's up";
    }
  }, 1000);
});

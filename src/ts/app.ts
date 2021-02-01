//----------------------MODAL----------------------
const modal = document.getElementById("modal");
const modalBtn = document.getElementById("modalBtn");
const closeBtn = document.getElementById("closeModal");
const clockForm: HTMLFormElement = document.querySelector("#clockForm");

modalBtn.addEventListener("click", () => {
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
});

closeBtn.addEventListener("click", () => {
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
});

clockForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(clockForm);
  const editedDeadline = setDeadline({
    days: Number(formData.get("day")),
    hours: Number(formData.get("hour")),
    minutes: Number(formData.get("minute")),
    seconds: Number(formData.get("second")) + 2,
  });
  // Hide modal
  modal.style.opacity = "0";
  modal.style.visibility = "hidden";
  // Reinitialize Clock
  clearInterval(timeInterval);
  initializeClock(editedDeadline);
  clockForm.reset();
});

window.onclick = (event: Event) => {
  if (event.target == modal) {
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
  }
};

window.addEventListener("load", () => {
  modal.style.opacity = "1";
  modal.style.visibility = "visible";
});

//----------------------CLOCK----------------------
interface countdownDate {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

//----------------------Calculate Remaining Time----------------------
const getTimeRemaining = (endtime: string) => {
  const total = Date.parse(endtime) - new Date().getTime();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  let days = Math.floor(total / (1000 * 60 * 60 * 24));

  if (days > 99) {
    days = 99;
  }

  return {
    total,
    days,
    hours,
    minutes,
    seconds,
  };
};

// Define Clock Main Interval Globally
let timeInterval = setInterval(() => {}, 1000);

const initializeClock = (endtime: string) => {
  const daysSpan = document.querySelectorAll("#days-number");
  const daysSpanFlip = document.querySelectorAll("#flip-days-number");
  const hoursSpan = document.querySelectorAll("#hours-number");
  const hoursSpanFlip = document.querySelectorAll("#flip-hours-number");
  const minutesSpan = document.querySelectorAll("#minutes-number");
  const minutesSpanFlip = document.querySelectorAll("#flip-minutes-number");
  const secondsSpan = document.querySelectorAll("#seconds-number");
  const secondsSpanFlip = document.querySelectorAll("#flip-seconds-number");

  const updateClock = () => {
    const t = getTimeRemaining(endtime);

    //Animate Function
    const animateCountdown = (
      elementTop: HTMLElement,
      elementBottom: HTMLElement,
      spanFlipTop: Element,
      spanFlipBottom: Element,
      time: Number
    ) => {
      elementTop.style.animation = "top-to-bottom 0.5s linear";
      elementBottom.style.animation = "bottom-to-top 0.5s linear";

      const animationTopCB = () => {
        elementTop.style.animation = "";
        elementTop.removeEventListener("animationend", animationTopCB);
        spanFlipTop.innerHTML = ("0" + time).slice(-2);
      };

      const animationBottomCB = () => {
        elementBottom.style.animation = "";
        elementBottom.removeEventListener("animationend", animationBottomCB);
        spanFlipBottom.innerHTML = ("0" + time).slice(-2);
      };

      elementTop.addEventListener("animationend", animationTopCB);
      elementBottom.addEventListener("animationend", animationBottomCB);
    };

    // Update Seconds if has changed (Always)
    if (t.seconds >= 0) {
      const flipCardTopS = document.getElementById("flip-card-top-s");
      const flipCardBottomS = document.getElementById("flip-card-bottom-s");

      secondsSpan[0].innerHTML = ("0" + t.seconds).slice(-2);
      animateCountdown(
        flipCardTopS,
        flipCardBottomS,
        secondsSpanFlip[0],
        secondsSpan[1],
        t.seconds
      );
      secondsSpanFlip[1].innerHTML = ("0" + t.seconds).slice(-2);
    }

    // Update Minutes if has changed
    if (parseInt(minutesSpan[0].innerHTML) !== t.minutes && t.minutes >= 0) {
      console.log(minutesSpan[0].innerHTML);
      console.log(t.minutes.toString());
      const flipCardTopM = document.getElementById("flip-card-top-m");
      const flipCardBottomM = document.getElementById("flip-card-bottom-m");

      minutesSpan[0].innerHTML = ("0" + t.minutes).slice(-2);
      animateCountdown(
        flipCardTopM,
        flipCardBottomM,
        minutesSpanFlip[0],
        minutesSpan[1],
        t.minutes
      );
      minutesSpanFlip[1].innerHTML = ("0" + t.minutes).slice(-2);
    }

    // Update Hours if has changed
    if (parseInt(hoursSpan[0].innerHTML) !== t.hours && t.hours >= 0) {
      const flipCardTopH = document.getElementById("flip-card-top-h");
      const flipCardBottomH = document.getElementById("flip-card-bottom-h");

      hoursSpan[0].innerHTML = ("0" + t.hours).slice(-2);
      animateCountdown(
        flipCardTopH,
        flipCardBottomH,
        hoursSpanFlip[0],
        hoursSpan[1],
        t.hours
      );
      hoursSpanFlip[1].innerHTML = ("0" + t.hours).slice(-2);
    }

    // Update Days if has changed
    if (parseInt(daysSpan[0].innerHTML) !== t.days && t.days >= 0) {
      const flipCardTopD = document.getElementById("flip-card-top-d");
      const flipCardBottomD = document.getElementById("flip-card-bottom-d");

      daysSpan[0].innerHTML = ("0" + t.days).slice(-2);
      animateCountdown(
        flipCardTopD,
        flipCardBottomD,
        daysSpanFlip[0],
        daysSpan[1],
        t.days
      );
      daysSpanFlip[1].innerHTML = ("0" + t.days).slice(-2);
    }

    // Stops the countdown when it reaches zero
    if (t.total <= 0) {
      clearInterval(timeInterval);
    }
  };

  timeInterval = setInterval(() => {
    updateClock();
  }, 1000);
};

//
const setDeadline = ({ days, hours, minutes, seconds }: countdownDate) => {
  return new Date(
    new Date().getTime() +
      days * 86400000 +
      hours * 3600000 +
      minutes * 60000 +
      seconds * 1000
  ).toISOString();
};

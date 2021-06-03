window.addEventListener("DOMContentLoaded", () => {
  //Tabs

  const tabs = document.querySelectorAll(".tabheader__item"),
    tabsContent = document.querySelectorAll(".tabcontent"),
    tabsParent = document.querySelector(".tabheader__items");

  function hideTabContent() {
    tabsContent.forEach((tab) => {
      tab.classList.add("hide");
      tab.classList.remove("show", "fade");
    });

    tabs.forEach((tab) => {
      tab.classList.remove("tabheader__item_active");
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add("show", "fade");
    tabsContent[i].classList.remove("hide");
    tabs[i].classList.add("tabheader__item_active");
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener("click", (e) => {
    const target = e.target;

    if (target && target.classList.contains("tabheader__item")) {
      tabs.forEach((tab, i) => {
        if (target == tab) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //Timer

  const deadline = "2021-06-30";

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadline);

  //Modal

  const modalTrigger = document.querySelectorAll("[data-modal]"),
    modal = document.querySelector(".modal");

  modalTrigger.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  function openModal() {
    modal.classList.add("show");
    modal.classList.remove("hide");
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  function closeModal() {
    modal.classList.add("hide");
    modal.classList.remove("show");
    document.body.style.overflow = "";
  }

  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.getAttribute("data-close") == "") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  const modalTimerId = setTimeout(openModal, 10000);

  function showModalByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModal();
      window.removeEventListener("scroll", showModalByScroll);
    }
  }

  window.addEventListener("scroll", showModalByScroll);

  //MenuClasses

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.classes = classes;
      this.transfer = 2.5;
      this.changeToBYN();
    }
    changeToBYN() {
      this.price = this.price * this.transfer;
    }

    render() {
      const element = document.createElement("div");
      if (this.classes.length === 0) {
        this.element = "menu__item";
        element.classList.add(this.element);
      } else {
        this.classes.forEach((className) => element.classList.add(className));
      }

      element.innerHTML = `

        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
        </div>
          `;
      this.parent.append(element);
    }
  }

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getResource("db.json").then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new MenuCard(
        img,
        altimg,
        title,
        descr,
        price,
        ".menu .container"
      ).render();
    });
  });

  //Form

  const forms = document.querySelectorAll("form");

  const message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
      display: block;
      margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      setTimeout(() => {
        console.log(
          document
            .querySelectorAll(".modal__input")
            .forEach((inp) => console.log(inp.value)) ||
            document
              .querySelectorAll(".order__input")
              .forEach((inp) => console.log(inp.value))
        );

        showThanksModal(message.success);
        statusMessage.remove();
        form.reset();
      }, 1666);

      // const request = new XMLHttpRequest();

      // request.open("POST", "server.php");

      // const formData = new FormData(form);

      // request.send(formData);

      // request.addEventListener("load", () => {
      //   if (request.status === 200) {
      //     console.log(request.response);
      //     statusMessage.textContent = message.success;
      //   } else {
      //     statusMessage.textContent = message.failure;
      //   }
      // });
    });
  }

  // forms.forEach((item) => {
  //   bindPostData(item);
  // });

  // const postData = async (url, data) => {
  //   const res = await fetch(url, {
  //     method: "POST",
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //     body: data,
  //   });

  //   return await res.json();
  // };

  // function bindPostData(form) {
  //   form.addEventListener("submit", (e) => {
  //     e.preventDefault();

  //     const statusMessage = document.createElement("img");
  //     statusMessage.src = message.loading;
  //     statusMessage.style.cssText = `
  //     display: block;
  //     margin: 0 auto;
  //     `;
  //     form.insertAdjacentElement("afterend", statusMessage);

  //     const formData = new FormData(form);

  //     const json = JSON.stringify(Object.fromEntries(formData.entries));

  //     postData("http://localhost:3000/requests", json)
  //       .then((data) => {
  //         console.log(data);
  //         showThanksModal(message.success);
  //         statusMessage.remove();
  //       })
  //       .catch(() => {
  //         showThanksModal(message.failure);
  //       })
  //       .finally(() => {
  //         form.reset();
  //       });
  //   });
  // }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.classList.add("hide");

    openModal();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
    <div class="modal__content">
        <div class="modal__close" data-close>&times;</div>
        <div class="modal__title">${message}</div>
    </div>
    `;

    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.remove("hide");
      // prevModalDialog.classList.add("show");
      closeModal();
    }, 1666);
  }

  //Slider

  const slides = document.querySelectorAll(".offer__slide"),
    slider = document.querySelector(".offer__slider"),
    prev = document.querySelector(".offer__slider-prev"),
    next = document.querySelector(".offer__slider-next"),
    total = document.querySelector("#total"),
    current = document.querySelector("#current"),
    slidesWrapper = document.querySelector(".offer__slider-wrapper"),
    slidesField = document.querySelector(".offer__slider-inner"),
    width = window.getComputedStyle(slidesWrapper).width;

  let slideIndex = 1;
  let offset = 0;

  slidesCount();

  slidesField.style.width = 100 * slides.length + "%";
  slidesField.style.display = "flex";
  slidesField.style.transition = "0.5s all";
  slidesWrapper.style.overflow = "hidden";

  slides.forEach((slide) => {
    slide.style.width = width;
  });

  slider.style.position = "relative";

  const dots = document.createElement("ol");
  dotsArr = [];
  dots.classList.add("carousel-indicators");
  dots.style.cssText = `
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 15;
  display: flex;
  justify-content: center;
  margin-right: 15%;
  margin-left: 15%;
  list-style: none;`;
  slider.append(dots);

  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement("li");
    dot.setAttribute("data-slide-to", i + 1);
    dot.style.cssText = `
    box-sizing: content-box;
    flex: 0 1 auto;
    width: 30px;
    height: 6px;
    margin-right: 3px;
    margin-left: 3px;
    cursor: pointer;
    background-color: #fff;
    background-clip: padding-box;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    opacity: 0.5;
    transition: opacity 0.6s ease;
  }`;
    if (i == 0) {
      dot.style.opacity = 1;
    }
    dots.append(dot);
    dotsArr.push(dot);
  }

  next.addEventListener("click", () => {
    if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
      offset = 0;
    } else {
      offset += +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
      slideIndex = 1;
    } else {
      slideIndex++;
    }

    slidesCount();

    slidesOpacity();
  });

  prev.addEventListener("click", () => {
    if (offset == 0) {
      offset = +width.slice(0, width.length - 2) * (slides.length - 1);
    } else {
      offset -= +width.slice(0, width.length - 2);
    }
    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
      slideIndex = slides.length;
    } else {
      slideIndex--;
    }

    slidesCount();

    slidesOpacity();
  });

  dotsArr.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const slideTo = e.target.getAttribute("data-slide-to");

      slideIndex = slideTo;
      offset = +width.slice(0, width.length - 2) * (slideTo - 1);

      slidesField.style.transform = `translateX(-${offset}px)`;

      slidesCount();

      slidesOpacity();
    });
  });

  function slidesOpacity() {
    dotsArr.forEach((dot) => (dot.style.opacity = ".5"));
    dotsArr[slideIndex - 1].style.opacity = "1";
  }

  function slidesCount() {
    if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
    } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
    }
  }

  //Calc

  const calcRes = document.querySelector(".calculating__result span"),
    calcArea = document.querySelector(".calculating__field"),
    genders = document
      .querySelector("#gender")
      .querySelectorAll(".calculating__choose-item"),
    ratios = document.querySelectorAll("[data-ratio]");

  let calcHeight, calcWeight, calcAge, calcSex, calcRatio;

  if (localStorage.getItem("sex")) {
    calcSex = localStorage.getItem("sex");
    genders.forEach((gender) =>
      gender.classList.remove("calculating__choose-item_active")
    );
    genders.forEach((gender) =>
      gender.getAttribute("id") == localStorage.getItem("sex")
        ? gender.classList.add("calculating__choose-item_active")
        : ""
    );
  } else {
    calcSex = "female";
    localStorage.setItem("sex", "female");
  }

  if (localStorage.getItem("ratio")) {
    calcRatio = +localStorage.getItem("ratio");
    ratios.forEach((ratio) =>
      ratio.classList.remove("calculating__choose-item_active")
    );
    ratios.forEach((ratio) =>
      ratio.getAttribute("data-ratio") == +localStorage.getItem("ratio")
        ? ratio.classList.add("calculating__choose-item_active")
        : ""
    );
  } else {
    calcRatio = 1.375;
    localStorage.setItem("ratio", 1.375);
  }

  function calc() {
    let res;
    if (!calcHeight || !calcWeight || !calcAge || !calcSex || !calcRatio) {
      calcRes.textContent = "____";
      return;
    }
    if (calcSex == "female") {
      res = Math.round(
        (447.6 + 9.2 * calcWeight + 3.1 * calcHeight - 4.3 * calcAge) *
          calcRatio
      );
      return (calcRes.textContent = +res < 0 ? "____" : +res);
    } else if (calcSex == "male") {
      res = Math.round(
        (88.36 + 13.4 * calcWeight + 4.8 * calcHeight - 5.7 * calcAge) *
          calcRatio
      );
      return (calcRes.textContent = +res < 0 ? "____" : +res);
    }
  }

  function calcParams() {
    calcArea.addEventListener("click", (e) => {
      if (e.target.getAttribute("id") == "male") {
        calcSex = "male";
        genders.forEach((gender) =>
          gender.classList.remove("calculating__choose-item_active")
        );
        e.target.classList.add("calculating__choose-item_active");
        localStorage.setItem("sex", "male");
      } else if (e.target.getAttribute("id") == "female") {
        calcSex = "female";
        genders.forEach((gender) =>
          gender.classList.remove("calculating__choose-item_active")
        );
        e.target.classList.add("calculating__choose-item_active");
        localStorage.setItem("sex", "female");
      } else if (e.target.hasAttribute("data-ratio")) {
        calcRatio = +e.target.getAttribute("data-ratio");
        ratios.forEach((ratio) =>
          ratio.classList.remove("calculating__choose-item_active")
        );
        e.target.classList.add("calculating__choose-item_active");
        localStorage.setItem("ratio", +e.target.getAttribute("data-ratio"));
      }

      calc();
    });
  }

  function calcStats() {
    const inputs = calcArea.querySelectorAll("input");
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        if (input.value.match(/\D/g) || !input.value) {
          e.target.style.border = "1px solid red";
        } else {
          e.target.style.border = "none";
        }

        switch (e.target.getAttribute("id")) {
          case "height":
            calcHeight = +e.target.value;
            break;
          case "weight":
            calcWeight = +e.target.value;
            break;
          case "age":
            calcAge = +e.target.value;
            break;
        }
        calc();
      });
    });
  }

  calc();
  calcParams();
  calcStats();
});

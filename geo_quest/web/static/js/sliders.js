document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".slider-container").forEach((container, index) => {
    const leftInput = container.querySelector(".left-range");
    const rightInput = container.querySelector(".right-range");
    const sliderDiv = container.querySelector(".slider");
    const rangeDiv = container.querySelector(".range");
    const thumbL = container.querySelector(".thumb.left");
    const thumbR = container.querySelector(".thumb.right");

    const min = +leftInput.min;
    const max = +leftInput.max;
    const minGap = 1;

    const labelL = document.createElement("div");
    const labelR = document.createElement("div");
    labelL.className = "slider-label";
    labelR.className = "slider-label";
    thumbL.appendChild(labelL);
    thumbR.appendChild(labelR);

    const updateUI = () => {
      let l = +leftInput.value;
      let r = +rightInput.value;

      if (r - l < minGap) {
        if (document.activeElement === leftInput) {
          l = Math.min(l, max - minGap);
          r = l + minGap;
        } else {
          r = Math.max(r, min + minGap);
          l = r - minGap;
        }
        leftInput.value = l;
        rightInput.value = r;
      }

      const percentL = ((l - min) / (max - min)) * 100;
      const percentR = ((r - min) / (max - min)) * 100;

      thumbL.style.left = percentL + "%";
      thumbR.style.left = percentR + "%";
      rangeDiv.style.left = percentL + "%";
      rangeDiv.style.right = 100 - percentR + "%";

      labelL.textContent = l;
      labelR.textContent = r;
    };

    const startDrag = (thumb, isLeft) => {
      const onMove = (e) => {
        const rect = sliderDiv.getBoundingClientRect();
        let x = e.clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));
        const pct = x / rect.width;
        const val = Math.round(min + pct * (max - min));

        if (isLeft) {
          leftInput.value = Math.min(val, rightInput.value - minGap);
        } else {
          rightInput.value = Math.max(val, +leftInput.value + minGap);
        }

        updateUI();
      };

      const endDrag = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", endDrag);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", endDrag);
    };

    thumbL.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startDrag(thumbL, true);
    });

    thumbR.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startDrag(thumbR, false);
    });

    leftInput.addEventListener("input", updateUI);
    rightInput.addEventListener("input", updateUI);

    updateUI();
  });
});

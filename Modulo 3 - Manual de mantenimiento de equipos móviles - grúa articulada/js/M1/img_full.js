  function openFullscreen(imgElement) {
    const fullscreenContainer = document.getElementById("fullscreenContainer");
    const fullscreenImg = document.getElementById("fullscreenImg");
    fullscreenImg.src = imgElement.src;
    fullscreenContainer.style.display = "flex";
  }

  function closeFullscreen() {
    document.getElementById("fullscreenContainer").style.display = "none";
  }

  
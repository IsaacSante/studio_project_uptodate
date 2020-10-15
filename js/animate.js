images = [
  {
    name: "img1",
    src: "pics/pics5.jpg",
    text:
      "Up to 90% of Sub-Saharan Africa’s cultural artifacts are outside of the continent.",
  },
  {
    name: "img2",
    src: "pics/pic2.jpg",
    text:
      "The European powers took hunderds of thousands of artifacts during the colonial period.",
  },
  {
    name: "img3",
    src: "pics/pics3.jpg",
    text:
      "Paris alone host 90,000 artifacts, of which about 70,000 are hosted at the Quai Branly Museum.",
  },
  {
    name: "img4",
    src: "pics/pic4.jpeg",
    text: "Till today the musuem has only agreed to return 26.",
  },
  {
    name: "img4",
    src: "pics/pic2.jpg",
    text: "Till today the musuem has only agreed to return 26.",
  },
];
imgIndex = 0;

function changeImg() {
  document.getElementById("slideshow").src = images[imgIndex].src;
  document.getElementById("picDesc").innerHTML = images[imgIndex].text;
  if (5 > imgIndex + 1) {
    document.getElementById("blackbox").style.color = "white";
    imgIndex++;
  } else {
    // imgIndex = 0;
    document.getElementById("slideshow").style.display = "none";
    document.getElementById("picDesc").style.display = "none";
  }
}

changeImg();
setInterval(changeImg, 7500);

/* 2. kvíz – Környezet, pip */
window.QUIZZES = window.QUIZZES || [];
window.QUIZZES.push({
  id: 2,
  title: "Környezet, pip",
  questions: [
    {
      id: "q2_2", quiz: 2, num: 2, type: "radio",
      prompt: "Hogyan lehet telepíteni egy pygame nevű csomagot?",
      options: ["pip import pygame", "install pygame", "pip install pygame", "import pygame from pip"],
      correct: 2
    },
    {
      id: "q2_3", quiz: 2, num: 3, type: "radio",
      prompt: "Mi igaz a Python-ra?",
      options: [
        "Tisztán funkcionális nyelv.",
        "Nem objektumorientált.",
        "A Python egy open source és multiplatform programozási nyelv.",
        "A Python3 és a Python2 kompatibilis egymással."
      ],
      correct: 2
    },
    {
      id: "q2_4", quiz: 2, num: 4, type: "radio",
      prompt: "Melyik igaz?",
      options: ["A Python interpretert használ.", "A Python compilert használ."],
      correct: 0
    },
    {
      id: "q2_7", quiz: 2, num: 7, type: "radio",
      prompt: "A következők közül melyik a Python program kiterjesztése?",
      options: [".py", ".pt", ".pyt", ".p"],
      correct: 0
    },
    {
      id: "q2_8", quiz: 2, num: 8, type: "radio",
      prompt: "Mire használjuk a pip-et?",
      options: ["Semmire.", "Csomagolásra.", "Csomagok telepítésére.", "Modulok betöltésére."],
      correct: 2
    }
  ],
});

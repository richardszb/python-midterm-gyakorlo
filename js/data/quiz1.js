/* 1. kvíz – Alapok, ciklusok */
window.QUIZZES = window.QUIZZES || [];
window.QUIZZES.push({
  id: 1,
  title: "Alapok, ciklusok",
  questions: [
    {
      id: "q1_1", quiz: 1, num: 1, type: "radio",
      prompt: "Python-ban a while ciklus egy elől tesztelő feltételes, pozitív kiértékelésű ciklus.",
      options: ["Hamis", "Igaz"],
      correct: 1
    },
    {
      id: "q1_2", quiz: 1, num: 2, type: "radio",
      prompt: "Mi lesz a kimenet?",
      code: "a = 2\nprint(f'a = {a}')",
      options: ["f a = 2", "a={2}", "a = 2", "a2"],
      correct: 2
    },
    {
      id: "q1_3", quiz: 1, num: 3, type: "radio",
      prompt: "Mi lesz a kimenet?",
      code: "sz = 1\nfor i in range(121):\n    sz = sz * i\nprint(sz)",
      options: ["0", "Error", "121 faktoriálisa", "120 faktoriálisa"],
      correct: 0,
      explanation: "A range(121) 0-tól indul, így már az első iterációban (sz = 1 * 0) lenullázódik a szorzat."
    },
    {
      id: "q1_4", quiz: 1, num: 4, type: "text", multiline: true,
      prompt: "Elemezd a kódot és írd le azt a feladatot, amit ez a kód megold!\nAdd meg a kimenetet!",
      code: "uj=[]\nfor i in range(1,120):\n    if i % 10 == 0:\n        uj.append(i)\nprint(uj)",
      answer: "Az 1 és 119 közötti (120-nál kisebb) 10-zel osztható pozitív egész számokat gyűjti az 'uj' listába, majd kiírja a listát.\nKimenet: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110]"
    },
    {
      id: "q1_5", quiz: 1, num: 5, type: "radio",
      prompt: "A Python kódban az utasítás lezáráshoz elegendő a sorvége jelet használni.",
      options: ["Igaz", "Hamis"],
      correct: 0
    },
    {
      id: "q1_6", quiz: 1, num: 6, type: "radio",
      prompt: "Helyes-e az alábbi értékadás:",
      code: "a, b, c = 1, 2, 3",
      options: ["True", "False"],
      correct: 0
    },
    {
      id: "q1_7", quiz: 1, num: 7, type: "radio",
      prompt: "A print(\"2\", 2) eredménye a következő lesz:",
      options: ["2 2", "22", "4", "Egyik sem."],
      correct: 0
    },
    {
      id: "q1_8", quiz: 1, num: 8, type: "radio",
      prompt: "Python-ban az x = '1' és az y = \"1\" értékadások esetén",
      options: [
        "egy szám és egy string típus jön létre.",
        "egy karakter és egy string típus jön létre.",
        "két karakter típus jön létre.",
        "két string típus jön létre."
      ],
      correct: 3,
      explanation: "Pythonban nincs külön karakter (char) típus; az egyszeres ('1') és a kétszeres (\"1\") idézőjel is string (str) típust hoz létre."
    },
    {
      id: "q1_9", quiz: 1, num: 9, type: "radio",
      prompt: "Hogyan lehet eltávolítani egy pygame nevű csomagot?",
      options: ["pip delete pygame", "pip uninstall pygame", "pip remove pygame", "pip erase pygame"],
      correct: 1
    },
    {
      id: "q1_10", quiz: 1, num: 10, type: "radio",
      prompt: "Mi lesz az eredménye az alábbi utasításnak?",
      code: "print ('2' + '2')",
      options: ["2 2", "2 + 2", "22", "4"],
      correct: 2
    },
    {
      id: "q1_11", quiz: 1, num: 11, type: "radio",
      prompt: "Mi a kimenet?",
      code: "print(len('alma'+\"fa\"))",
      options: ["7", "almafa", "6", "Error"],
      correct: 2
    },
    {
      id: "q1_12", quiz: 1, num: 12, type: "radio",
      prompt: "Mi lesz az eredménye az alábbi programrészletnek?",
      code: "for i in range(0, 6, 3):\n    print(i)",
      options: ["0", "0\n3\n6", "3", "0\n3"],
      correct: 3
    },
    {
      id: "q1_13", quiz: 1, num: 13, type: "radio",
      prompt: "Mi lesz az eredménye az alábbi kódrészletnek, ha 10 a bemenet?",
      code: "x=input('Kérek egy számot: ')\ny=x+1\nprint(y)",
      options: ["11", "Error", "101", "10"],
      correct: 1,
      explanation: "Az input() mindig stringet (str) ad vissza, amihez nem lehet közvetlenül egész számot (int) hozzáadni (TypeError)."
    },
    {
      id: "q1_15", quiz: 1, num: 15, type: "radio",
      prompt: "Mi lesz az eredménye az alábbi kódrészletnek, ha 3 a bemenet?",
      code: "x=int(input('Kérek egy számot: '))\ny=x*'3'\nprint (y)",
      options: ["333", "27", "Error", "9"],
      correct: 0
    }
  ],
});

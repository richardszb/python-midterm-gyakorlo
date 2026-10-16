/* 5. kvíz – Függvények, lambda */
window.QUIZZES = window.QUIZZES || [];
window.QUIZZES.push({
  id: 5,
  title: "Függvények, lambda",
  questions: [
    {
      id: "q5_1", quiz: 5, num: 1, type: "radio",
      prompt: "Igaz vagy hamis az állítás?\nA következő kód kimenete az 5 lesz:",
      code: "print((lambda a,b: (a**2 + b**2)**0.5)(-3,-4))",
      options: ["Hamis", "Igaz"],
      correct: 0,
      explanation: "Hamis, mert a 0.5-ödik hatványra emelés lebegőpontos számot eredményez, így a kimenet 5.0 lesz (nem 5)."
    },
    {
      id: "q5_2", quiz: 5, num: 2, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "a = lambda lst: list(filter(lambda x: x % 2 == 0, lst))\nprint(a([0, 1, 2, 3, 4, 5]))",
      answer: "[0, 2, 4]"
    },
    {
      id: "q5_3", quiz: 5, num: 3, type: "radio",
      prompt: "Mi a kimenet?",
      code: "def gyök(n):\n    for i in range(n):\n        gyök = i**0.5\n        yield round(gyök,2)\nfor elem in gyök(2):\n    print(elem, end = ' ')",
      options: ["0.0. 1.0 1.41", "0 1", "0.0 1.0", "Error"],
      correct: 2
    },
    {
      id: "q5_4", quiz: 5, num: 4, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "m = lambda lst: \" \".join(lst)\nprint(m([\"Ez\", \"egy\", \"teszt\"]))",
      answer: "Ez egy teszt"
    },
    {
      id: "q5_5", quiz: 5, num: 5, type: "radio",
      prompt: "Mi a kimenet?",
      code: "def hi():\n    print(\"hi!\")\nprint(hi())",
      options: ["hi!\nNone", "hi!\nError", "hi!", "hi!\nhi!"],
      correct: 0
    },
    {
      id: "q5_6", quiz: 5, num: 6, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "b = lambda a: a[::-1] + a\nprint(b(\"cba\"))",
      answer: "abccba"
    },
    {
      id: "q5_7", quiz: 5, num: 7, type: "radio",
      prompt: "Mi a kimenet?",
      code: "def Hello():\n    print(\"Hello\")\n    return \"hello\"\nprint(Hello())",
      options: ["Hello", "Hello\nhello", "hello\nHello", "hello"],
      correct: 1
    },
    {
      id: "q5_8", quiz: 5, num: 8, type: "radio",
      prompt: "Mi a kimenet?",
      code: "n = lambda y: [x**2 for x in range(y+1)]\nprint(n(3))",
      options: ["[0, 1, 4]", "[1, 4, 9, 16]", "[0, 1, 4, 9]", "[1, 4, 9]"],
      correct: 2
    },
    {
      id: "q5_9", quiz: 5, num: 9, type: "text", multiline: true,
      prompt: "Írd le, mi a következő kód kimenete:",
      code: "def a(**b):\n    for x,y in b.items():\n        if isinstance(y, int):\n            print(f\"{x}: {y}\")\n    if \"fizetes\" not in b or not b[\"fizetes\"]:\n        print(\"Nincs fizetési mód megadva.\")\na(termek=\"Laptop\", ar=123000, darab=2, fizetes=\"\")",
      answer: "ar: 123000\ndarab: 2\nNincs fizetési mód megadva."
    },
    {
      id: "q5_10", quiz: 5, num: 10, type: "radio",
      prompt: "Mi a kimenet?",
      code: "def hello():\n    print(\"Hello!\")\n    return\nprint(hello())",
      options: ["Hello!\nError", "Hello!", "Hello!\nNone", "Hello!\nFalse"],
      correct: 2
    },
    {
      id: "q5_11", quiz: 5, num: 11, type: "text", multiline: true,
      prompt: "ABC = \"abcdefghijklmnopqrstuvwxyz\"\nÍrd meg azt a kódot, amely létrehozza az ABC-ből azt a stringet, amelyik a 4-gyel osztható indexű karakterekből áll. Írasd ki az eredményt! (Kimenet: aeimquy)",
      answer: "uj_string = ABC[::4]\nprint(uj_string)"
    },
    {
      id: "q5_12", quiz: 5, num: 12, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "def összeg(*a):\n    return sum(a)\nprint(összeg(0, 2, 4, 6))",
      answer: "12"
    },
    {
      id: "q5_13", quiz: 5, num: 13, type: "radio",
      prompt: "Mi a kimenet?",
      code: "b = lambda oldal: oldal ** 3\na = [b(x) for x in range(1,4)]\nprint(a)",
      options: ["[0, 1, 8, 27]", "[1, 4, 9]", "[1, 8, 27, 64]", "[1, 8, 27]"],
      correct: 3
    },
    {
      id: "q5_14", quiz: 5, num: 14, type: "text", multiline: true,
      prompt: "Írj a #### helyére egy lambda függvényt, amely kigyűjti egy számokat tartalmazó listából a 0-ra végződő egészeket.",
      code: "fv = ####\nprint(fv([100.5, -20, 8, 0, 47]))   # Kimenet: [-20, 0]",
      answer: "lambda lst: list(filter(lambda x: isinstance(x, int) and x % 10 == 0, lst))"
    },
    {
      id: "q5_15", quiz: 5, num: 15, type: "radio",
      prompt: "Mi a kimenet?",
      code: "def szorzat(a,b=4,c=2):\n    return a * b * c\nprint(szorzat(1,3))",
      options: ["8", "Error", "0", "6"],
      correct: 3
    },
    {
      id: "q5_16", quiz: 5, num: 16, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "def szorzat(a=1,b=1,c):\n    return a * b * c\nprint(szorzat(2,4,1))",
      answer: "SyntaxError (vagy Error)",
      explanation: "Pythonban nem alapértelmezett paraméter (c) nem állhat alapértelmezett értékkel rendelkező paraméterek (a=1, b=1) után."
    },
    {
      id: "q5_17", quiz: 5, num: 17, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "b = lambda x: 1 if x == 1 else x + b(x - 1)\nprint(b(4))",
      answer: "10"
    },
    {
      id: "q5_18", quiz: 5, num: 18, type: "radio",
      prompt: "Mi a kimenet?",
      code: "h = lambda lst: list(map(lambda x: len(x), lst))\nprint(h([\"hello!\", \"world\"]))",
      options: ["[10]", "[6, 6]", "[5, 5]", "[6, 5]"],
      correct: 3
    }
  ],
});

/* 3. kvíz – Operátorok, típusok */
window.QUIZZES = window.QUIZZES || [];
window.QUIZZES.push({
  id: 3,
  title: "Operátorok, típusok",
  questions: [
    {
      id: "q3_1", quiz: 3, num: 1, type: "radio",
      prompt: "Mi a kimenet?",
      code: "i=2\nwhile i<5:\n    i += 2\nprint(i)",
      options: ["4", "2", "i", "6"],
      correct: 3
    },
    {
      id: "q3_2", quiz: 3, num: 2, type: "radio",
      prompt: "Mi a kimenet?",
      code: "for i in range(-1,3):\n    if i > 1:\n        break\n    print(i, end=\" \")",
      options: ["-1 0", "-1 0 1", "-1 0 1 2", "Error"],
      correct: 1
    },
    {
      id: "q3_3", quiz: 3, num: 3, type: "radio",
      prompt: "Mi az eredmény?",
      code: "print((-1)** 3 ** 2)",
      options: ["-1", "1", "6", "-9"],
      correct: 0,
      explanation: "A hatványozás jobbról balra köt: 3 ** 2 = 9, majd (-1) ** 9 = -1."
    },
    {
      id: "q3_4", quiz: 3, num: 4, type: "radio",
      prompt: "Mi lesz az eredménye az alábbi kódrészletnek, ha 2 a bemenet?",
      code: "a=float(input('Kérek egy egész számot: '))\nb=a*'12'\nprint(b)",
      options: ["Error", "24", "1212", "12 12"],
      correct: 0,
      explanation: "Stringet ('12') nem lehet lebegőpontos számmal (float) megszorozni, csak egész számmal (int) -> TypeError."
    },
    {
      id: "q3_5", quiz: 3, num: 5, type: "radio",
      prompt: "Mi lesz az eredménye az alábbi kódrészletnek, ha 2 a bemenet?",
      code: "a=int(input('Kérek egy számot: '))\nb=str(a) + \"12\"\nprint (b)",
      options: ["1212", "14", "Error", "212"],
      correct: 3
    },
    {
      id: "q3_6", quiz: 3, num: 6, type: "text", multiline: true,
      prompt: "Mi a kimenet?",
      code: "for i in range(7, 10, -1):\n    print(i, end=\" \")",
      answer: "Nem ír ki semmit (üres kimenet), mivel 7-től indulva -1-es lépésközzel (csökkenve) nem lehet elérni a 10-et."
    },
    {
      id: "q3_7", quiz: 3, num: 7, type: "radio",
      prompt: "Mi a kimenet?",
      code: "x, y = 1, 2\nz = ((x == y) or (x < y)) and not(x != y)\nprint(not(z))",
      options: ["False", "True", "1", "0"],
      correct: 1,
      explanation: "(x == y) or (x < y) -> True. Viszont not(x != y) -> False. Így z = True and False = False. A print(not(z)) tehát True lesz."
    },
    {
      id: "q3_8", quiz: 3, num: 8, type: "radio",
      prompt: "Mi az eredménye az alábbi programrészletnek?",
      code: "for k in range(10, 5, -2):\n    print(k, end=\" \")",
      options: ["10 8 6 4", "10 8", "10 8 6", "10"],
      correct: 2
    },
    {
      id: "q3_9", quiz: 3, num: 9, type: "radio",
      prompt: "Mi lesz a kimenet?",
      code: "print(13 % 5.)",
      options: ["3", "3.", "Error", "3.0"],
      correct: 3
    },
    {
      id: "q3_10", quiz: 3, num: 10, type: "radio",
      prompt: "Mi a következő kód várható kimenete?",
      code: "s1 = '23.4'\ni = int(s1)\ns2 = str(i)\nf = float(s2)\nprint(s1 == s2)",
      options: ["False", "True", "Error"],
      correct: 2,
      explanation: "Az int('23.4') ValueError hibát dob, mert tizedespontot tartalmazó stringet nem lehet közvetlenül int-re konvertálni."
    },
    {
      id: "q3_11", quiz: 3, num: 11, type: "radio",
      prompt: "Mi a kimenet?",
      code: "print(5 % 2 + 3 // -2)",
      options: ["-1", "0", "2", "0.0"],
      correct: 0,
      explanation: "5 % 2 = 1. Az egészosztás (3 // -2) lefelé kerekít (-1.5 -> -2). Így 1 + (-2) = -1."
    },
    {
      id: "q3_12", quiz: 3, num: 12, type: "radio",
      prompt: "Mi a kimenet?",
      code: "x, y = 5, 2\na = x & y\nb = x | y\nc = ~y\nd = y ^ 3\ne = y >> 1\nf = x << 2\nprint(a, b, c, d, e, f)",
      options: ["0 5 -5 1 1 16", "0 7 -3 1 1 20", "Error", "0 7 -7 1 1 8"],
      correct: 1
    },
    {
      id: "q3_13", quiz: 3, num: 13, type: "text", multiline: true,
      prompt: "Tölts fel egy listát az [1,10] zárt intervallum egész számainak négyzeteivel.\nKérj be a billentyűzetről egy 100-nál nem nagyobb pozitív egész számot, és a lista segítségével döntsd el, hogy négyzetszám-e.",
      answer: "negyzetek = [i**2 for i in range(1, 11)]\nszam = int(input(\"Adjon meg egy 100-nál nem nagyobb pozitív egész számot: \"))\nif szam in negyzetek:\n    print(\"Négyzetszám\")\nelse:\n    print(\"Nem négyzetszám\")"
    },
    {
      id: "q3_14", quiz: 3, num: 14, type: "text", multiline: false,
      prompt: "Mi a kimenet?",
      code: "a = 0o13\nb = 0x11\nprint(a+b)",
      answer: "28",
      explanation: "0o13 (oktális) = 1*8 + 3 = 11. 0x11 (hexadecimális) = 1*16 + 1 = 17. Összegük: 11 + 17 = 28."
    },
    {
      id: "q3_15", quiz: 3, num: 15, type: "radio",
      prompt: "Hány darab csillag karakter kerül ki a képernyőre a program futását követően?",
      code: "i = 2\nwhile i >= 0:\n    print(\"*\")\n    i -= 2",
      options: ["három", "nulla", "kettő", "egy"],
      correct: 2
    },
    {
      id: "q3_16", quiz: 3, num: 16, type: "radio",
      prompt: "Mi lesz a kimenet, ha 2100 a bemenet?",
      code: "year = int(input('Kérek egy évszámot:'))\nprint(year % 4 == 0 and (year % 100 != 0 or year % 400 == 0))",
      options: ["True", "False"],
      correct: 1
    },
    {
      id: "q3_17", quiz: 3, num: 17, type: "radio",
      prompt: "Mi a kimenet?",
      code: "a, b = 7, 2\nprint(f'A hatvány értéke: {b**a}')",
      options: ["Error", "A hatvány értéke: 49", "A hatvány értéke: 256", "A hatvány értéke: 128"],
      correct: 3,
      explanation: "b**a azt jelenti, hogy 2 a 7. hatványon (2**7), ami 128."
    },
    {
      id: "q3_18", quiz: 3, num: 18, type: "radio",
      prompt: "Mi lesz a kimenet?",
      code: "lista = [1, 2, 3]\nlista = lista.append(10)\nprint(lista)",
      options: ["[]", "Nincs kimenet", "None", "[1, 2, 3, 10]"],
      correct: 2,
      explanation: "A lista.append(10) helyben módosítja a listát, de a visszatérési értéke None, amit felülírunk a lista változóba."
    },
    {
      id: "q3_19", quiz: 3, num: 19, type: "radio",
      prompt: "Mi a kimenet?",
      code: "x = 2\nif x>2:\n    print(3)\nelif x%2==1:\n    print(1)\nelse:\n    print(x)",
      options: ["x", "1", "2"],
      correct: 2
    },
    {
      id: "q3_20", quiz: 3, num: 20, type: "radio",
      prompt: "Mi a kimenet?",
      code: "x = 5\nprint('x<10')",
      options: ["Error", "x<10", "true", "True"],
      correct: 1
    }
  ],
});

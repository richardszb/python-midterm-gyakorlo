/* 6. kvíz – OOP, kivételkezelés */
window.QUIZZES = window.QUIZZES || [];
window.QUIZZES.push({
  id: 6,
  title: "OOP, kivételkezelés",
  questions: [
    {
      id: "q6_1", quiz: 6, num: 1, type: "text", multiline: false,
      prompt: "Írj lambda függvényt egy szám páratlan voltának ellenőrzésére.\nA #### helyett írd meg a kódot.",
      code: "is_odd = ####\nprint(is_odd(3))      # Kimenet: True",
      answer: "lambda x: x % 2 != 0"
    },
    {
      id: "q6_2", quiz: 6, num: 2, type: "text", multiline: false,
      prompt: "Írd le a kódot, amivel a Játék osztályból létrehozod a Labda nevű példányt:",
      code: "class Játék:\n    pass",
      answer: "Labda = Játék()"
    },
    {
      id: "q6_3", quiz: 6, num: 3, type: "radio",
      prompt: "Miket tartalmaz egy osztály?",
      options: [
        "Attribútumokat és metódusokat",
        "Metódusokat és függvényeket",
        "Függvényeket és modulokat",
        "Kizárólag a konstruktort"
      ],
      correct: 0
    },
    {
      id: "q6_4", quiz: 6, num: 4, type: "radio",
      prompt: "Mi a várható kimenete a kódnak?",
      code: "import math\ntry:\n    a = math.sqrt(-9)\nexcept ValueError:\n    print(\"inf\")\nelse:\n    print(\"fine\")\nfinally:\n    print(\"end\")",
      options: ["fine", "inf", "fine\nend", "inf\nend"],
      correct: 3
    },
    {
      id: "q6_5", quiz: 6, num: 5, type: "radio",
      prompt: "Mit definiálunk a __init__() metódussal?",
      options: [
        "A függvény inicializáló metódusát.",
        "Egyiket sem a fentiek közül.",
        "Importáljuk az osztály adatait.",
        "Az osztály konstruktorát."
      ],
      correct: 3
    },
    {
      id: "q6_6", quiz: 6, num: 6, type: "radio",
      prompt: "Mi a kimenet?",
      code: "class MyZeroDivisionError(ZeroDivisionError):\n    pass\ndef do_the_division(mine):\n    if mine:\n        raise MyZeroDivisionError\n    else:\n        raise ZeroDivisionError\ntry:\n    do_the_division(False)\nexcept MyZeroDivisionError:\n    print('My division by zero')\nexcept ZeroDivisionError:\n    print('Original division by zero')",
      options: ["Original division by zero", "Division by zero", "My division by zero", "Error"],
      correct: 0
    },
    {
      id: "q6_7", quiz: 6, num: 7, type: "radio",
      prompt: "Mi a kimenet?",
      code: "s1 = '234'\na = float(s1)\ns2 = str(a)\nb = float(s2)\nprint(s1 == s2)",
      options: ["True", "False", "SyntaxError", "ValueError"],
      correct: 1,
      explanation: "Az s1 értéke '234', míg a float(s1) után az s2 értéke '234.0' lesz, így a két string nem egyenlő."
    },
    {
      id: "q6_8", quiz: 6, num: 8, type: "radio",
      prompt: "Melyik elv szerint működik a verem?",
      options: [
        "FIFO",
        "A legnagyobb értékű elem kerül ki először.",
        "LIFO",
        "Véletlenszerűen kerül ki egy elem."
      ],
      correct: 2
    },
    {
      id: "q6_9", quiz: 6, num: 9, type: "radio",
      prompt: "Mi a kimenet?",
      code: "class Egyenes:\n    def __init__(self):\n        self.b = 1\n        self.__m = 2\n    def get_M(self):\n        return self.__m\n    def set_M(self, meredek):\n        self.__m = meredek\ne = Egyenes()\ne.set_M(3)\nprint(e.get_M(), e.b)",
      options: ["3 1", "3 2", "AttributeError", "2 1"],
      correct: 0
    },
    {
      id: "q6_10", quiz: 6, num: 10, type: "radio",
      prompt: "Mi hiányzik az alábbi kódrészletből?",
      code: "class Piton:\n    def __init__():\n        self.hang = 'Szszszszszszsz'",
      options: [
        "A __init__() konstruktorból hiányzik a self paraméter.",
        "A __init__() konstruktorból hiányzik a hang paraméter.",
        "Nem hiányzik semmi.",
        "Az ősosztály inicializálása."
      ],
      correct: 0
    },
    {
      id: "q6_11", quiz: 6, num: 11, type: "radio",
      prompt: "Mi a kimenet?",
      code: "class PéldaOsztály:\n    def __init__(self, val = 1):\n        self.__a = val\n    def set_b(self, val = 2):\n        self.b = val\npéldány_1 = PéldaOsztály(2)\nprint(példány_1.__a)",
      options: ["2", "AttributeError", "1", "SyntaxError"],
      correct: 1
    },
    {
      id: "q6_12", quiz: 6, num: 12, type: "radio",
      prompt: "Mi a neve a Python legáltalánosabb kivételének?",
      options: ["AttributeError", "SyntaxError", "Except", "BaseException"],
      correct: 3
    },
    {
      id: "q6_13", quiz: 6, num: 13, type: "radio",
      prompt: "Mi a kimenet?",
      code: "import math\ntry:\n    print(math.sqrt(9))\nexcept ValueError:\n    print(\"the end\")\nelse:\n    print(\"fine\")",
      options: ["3.0\nthe end", "3\nfine", "3.0\nfine", "Error"],
      correct: 2
    },
    {
      id: "q6_14", quiz: 6, num: 14, type: "radio",
      prompt: "Mi a program kimenete?",
      code: "class Snake:\n    pass\nclass Cobra(Snake):\n    pass\npiton = Snake()\nkobra = Cobra()\nprint(issubclass(Cobra, Snake))\nprint(isinstance(kobra,Snake))",
      options: ["True\nTrue", "True\nFalse", "AttributeError", "False\nTrue"],
      correct: 0
    },
    {
      id: "q6_15", quiz: 6, num: 15, type: "text", multiline: false,
      prompt: "Írj egy rekurzív lambda függvényt egy szám faktoriálisának kiszámítására.\nA #### helyett írd meg a kódot.",
      code: "factor = ####\nprint(factor(5))      # Kimenet: 120",
      answer: "lambda x: 1 if x <= 1 else x * factor(x - 1)"
    },
    {
      id: "q6_16", quiz: 6, num: 16, type: "radio",
      prompt: "Melyik a helyes válasz?",
      code: "class Vásárlás:\n    def __init__(self):\n        self._ár = 300\n        self.__keret = True",
      options: [
        "A __keret privát változó.",
        "Az _ár és a __keret privát változók.",
        "Az _ár privát változó.",
        "Nincs a kódban privát változó."
      ],
      correct: 0
    },
    {
      id: "q6_17", quiz: 6, num: 17, type: "text", multiline: false,
      prompt: "Írd le a kódot, amellyel a leszármazott osztályt megalkotjuk, hivatkozva az ősosztályra. Csak az első sort írd le!\nA leszármazott osztály neve Child, az ős neve Parent.",
      answer: "class Child(Parent):"
    },
    {
      id: "q6_18", quiz: 6, num: 18, type: "radio",
      prompt: "Melyik kivétel lép fel a következő művelet esetén?",
      code: "b = 0\na = 1 / 'b'",
      options: ["TypeError", "ValueError", "ZeroDivisionError", "SyntaxError"],
      correct: 0
    }
  ],
});

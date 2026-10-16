/* 4. kvíz – Listák, szótárak, stringek */
window.QUIZZES = window.QUIZZES || [];
window.QUIZZES.push({
  id: 4,
  title: "Listák, szótárak, stringek",
  questions: [
    {
      id: "q4_1", quiz: 4, num: 1, type: "radio",
      prompt: "Mi a kimenet?",
      code: "negyz = {x: x**2 for x in range(6)}\nprint(negyz)",
      options: [
        "(0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25)",
        "{0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25}",
        "[0, 1, 4, 9, 16, 25]",
        "[0: 0, 1: 1, 2: 4, 3: 9, 4: 16, 5: 25]"
      ],
      correct: 1
    },
    {
      id: "q4_2", quiz: 4, num: 2, type: "text", multiline: false,
      prompt: "Írd a #### helyére a hiányzó kódot, hogy a kimenet [('Parking', 1), ('Shops', 2), ('Food Court', 3), ('Offices', 4)] legyen:",
      code: "floor_types = ['Parking', 'Shops', 'Food Court', 'Offices']\nfloor_numbers = ####\nzipped = list(zip(floor_types ,floor_numbers ))\nprint(zipped)",
      answer: "[1, 2, 3, 4]  vagy  range(1, 5)"
    },
    {
      id: "q4_3", quiz: 4, num: 3, type: "radio",
      prompt: "Mi a kimenet?",
      code: "greek_1 = ['omega', 'alpha', 'pi', 'gamma']\ngreek_2 = sorted(greek_1)\nprint(greek_2.sort(reverse = True))",
      options: ["['alpha', 'gamma', 'pi', 'omega' ]", "None", "['omega', 'pi', 'gamma', 'alpha']", "Error"],
      correct: 1,
      explanation: "A .sort() metódus helyben (in-place) rendezi a listát, és None értékkel tér vissza."
    },
    {
      id: "q4_4", quiz: 4, num: 4, type: "text", multiline: true,
      prompt: "List comprehension-nal töltsd fel a ptl listát a [1, 29] zárt intervallum páratlan egész számaival.\nAz s listába sorban alkosd meg a ptl lista elemeinek részletösszegeit.\nÍrasd ki az s listát. (A kimeneti lista eleje: [1,4,9,16,...])",
      answer: "ptl = [i for i in range(1, 30) if i % 2 != 0]\ns = []\nosszeg = 0\nfor x in ptl:\n    osszeg += x\n    s.append(osszeg)\nprint(s)"
    },
    {
      id: "q4_5", quiz: 4, num: 5, type: "radio",
      prompt: "Add meg a helyes választ!",
      code: "list_1 = [\"A\",\"B\",\"C\"]\nlist_2 = list_1\nlist_3 = list_2\ndel list_1[0]\ndel list_2[0]\nprint(list_3)",
      options: [
        "['C'] mert ez egy szeletelés művelet eredménye.",
        "[ ]",
        "['C'] mert hivatkozás másolás történik.",
        "list_3"
      ],
      correct: 2
    },
    {
      id: "q4_6", quiz: 4, num: 6, type: "radio",
      prompt: "Mi a kimenet?",
      code: "list_1 = [\"A\",\"B\",\"C\"]\nlist_2 = list_1\nlist_3 = list_2\ndel list_1[0]\ndel list_2[:]\nprint(list_3)",
      options: ["['A', 'B', 'C']", "[]", "Error", "[\"B\", \"C\"]"],
      correct: 1
    },
    {
      id: "q4_7", quiz: 4, num: 7, type: "radio",
      prompt: "Mi a következő kód kimenete?",
      code: "lista = [3, 2, [[1, 3], [0, 4, 5], 6], 7]\nn = lista[2][1][1]\nprint(n)",
      options: ["4", "3", "0", "1"],
      correct: 0
    },
    {
      id: "q4_8", quiz: 4, num: 8, type: "radio",
      prompt: "A következő beágyazott listában add meg az indexelést a 'this' string megragadására.",
      code: "lista = ['a','b',[4,10,'Hi Python learner'],['c',[1,66,'this'],2,111],'e',7]",
      options: ["lista[3][2][3]", "lista[3][1][2]", "lista[2][1][3]", "lista[3][1][3]"],
      correct: 1
    },
    {
      id: "q4_9", quiz: 4, num: 9, type: "radio",
      prompt: "Mi a kimenet?",
      code: "for char in \"bcd\":\n    print(chr(ord(char) - 1), end = ' ')",
      options: ["Error", "97 98 100", "a b c", "b c d"],
      correct: 2
    },
    {
      id: "q4_10", quiz: 4, num: 10, type: "radio",
      prompt: "Mi a kimenet?",
      code: "print(\"*\".join([\"Hol\", \"van\", \"a\", \"nyár?\"]))",
      options: ["Error", "Hol van a nyár?", "Hol*van*a*nyár?", "'Hol*van*a*nyár'"],
      correct: 2
    },
    {
      id: "q4_11", quiz: 4, num: 11, type: "radio",
      prompt: "Mi lesz a program eredménye?",
      code: "m_l = [3,-1,1]\nm_l[-1] = m_l[-2]\nprint (m_l)",
      options: ["[3, -2, 1]", "Error", "[3,-1,-2]", "[3,-1,-1]"],
      correct: 3
    },
    {
      id: "q4_12", quiz: 4, num: 12, type: "radio",
      prompt: "Mi a kimenet?",
      code: "lst = [i **2 for i in range(6) if i%2!=0]\nprint (lst)",
      options: ["[1, 4, 9, 16, 25]", "[1, 9, 25]", "[0, 4, 16]", "[0, 4, 16, 36]"],
      correct: 1,
      explanation: "A range(6) páratlan számai az 1, 3, 5. Ezek négyzetei: [1, 9, 25]."
    },
    {
      id: "q4_13", quiz: 4, num: 13, type: "radio",
      prompt: "Hogyan nevezzük a kódban található műveletet?",
      code: "list_1 = [\"A\", \"B\", \"C\"]\nlist_2 = list_1[:]\nlist_3 = list_2[:]\ndel list_1[0]\ndel list_2[1]\nprint(list_3)",
      options: ["Lista szeletelése", "Hivatkozás másolás lista művelet"],
      correct: 0,
      explanation: "A [:] szintaxis a lista szeletelése (slicing), amely új másolatot hoz létre a listáról."
    },
    {
      id: "q4_14", quiz: 4, num: 14, type: "radio",
      prompt: "Mi a kimenet?",
      code: "lst = [[1, 6], [2, 3], 4, 5]\nprint(lst[1])",
      options: ["Error", "6", "[1, 6]", "[2, 3]"],
      correct: 3
    },
    {
      id: "q4_15", quiz: 4, num: 15, type: "radio",
      prompt: "Mi a kimenet?",
      code: "lst = []\ndel lst\nprint(lst)",
      options: ["None", "[]", "False", "Error"],
      correct: 3,
      explanation: "A del lst magát a változónevet is törli a névtérből, így a print(lst) NameError-t dob."
    },
    {
      id: "q4_16", quiz: 4, num: 16, type: "radio",
      prompt: "Mi a kimenet?",
      code: "lst = [i + 2*i for i in range(5)]\nprint (lst)",
      options: ["[2, 4, 6, 8, 10]", "[0, 2, 4, 6, 8]", "[0, 3, 6, 9, 12]", "0 3 6 9 12 15"],
      correct: 2
    },
    {
      id: "q4_17", quiz: 4, num: 17, type: "radio",
      prompt: "Mi a kimenet?",
      code: "a = \"A\"\nb = \"B\"\nc = \"C\"\nd = \" \"\nlst = [d, c, b, a]\nlst.reverse()\nprint(lst)",
      options: ["[' ', 'C', 'B', 'A']", "Error", "[a, b, c, d]", "['A', 'B', 'C', ' ']", "[d, c, b, a]"],
      correct: 3
    }
  ],
});

# 🐍 Python Midterm Gyakorló

Böngészőben futó Python gyakorlókvíz a midterm előtti tanuláshoz. A felület a Canvas kérdéskártyáit és a Quizlet tanulási módját keveri: rossz válasz esetén a kérdés a következő körben újra előjön, amíg mind „Tudom” nem lesz.

**92 kérdés, 6 kvíz** – alapok, ciklusok, operátorok, listák/szótárak, függvények/lambda, OOP és kivételkezelés.

## Funkciók

- Feleletválasztós és beírós (önellenőrzős) kérdések
- Körök: a hibásan megválaszolt kérdések külön körben ismétlődnek
- Bal oldali kérdéslista: kvízenként lenyitható számozott rács, a cellák színe mutatja az eredményt (zöld = helyes, piros = hibás, szürke = még nincs válasz, szaggatott keret = ebben a körben újra jön), kattintásra a kérdésre ugrik
- Számláló: megválaszolt / összes (%), helyes / hibás / hátralévő, kvízenkénti bontásban is
- Kvíz szerinti szűrés (az eredmények szűrőváltáskor megmaradnak), keverés, reset (csak az aktuális szűrő eredményeit törli)
- Előző kártya gomb: visszanézhetők a korábbi válaszok, a beírós kérdések értékelése át is írható
- Az előrehaladás mentődik a böngészőben (`localStorage`), és az oldal frissítései után is megmarad (lásd lent)
- Teljesen billentyűzetről használható (lásd lent)
- Sötét téma, mobilbarát elrendezés

## Billentyűparancsok

| Helyzet | Billentyű | Hatás |
| --- | --- | --- |
| Feleletválasztós kérdés | `1`–`4` | válasz kiválasztása |
| | `Enter` | ellenőrzés, majd következő kérdés |
| Beírós kérdés (beírás közben) | `Enter` (soros) / `Ctrl+Enter` (többsoros) | megoldás megmutatása |
| Beírós kérdés (megoldás látszik) | `Enter` | „Helyes volt a válaszod?” → igen |
| | `Backspace` | „Helyes volt a válaszod?” → nem |
| Már értékelt kártya visszanézése | `Enter` | tovább, az értékelés nem változik |
| | `I` / `N` | értékelés átírása helyesre / hibásra, majd tovább |
| Bárhol | `←` | előző kártya (üres beviteli mezőben is) |
| Összesítő képernyő | `Enter` | új kör a hibásakból |

A lenyomva tartott billentyű nem pörget végig a kártyákon.

## Az oldalsáv működése

- A lista az **aktuális paklit** mutatja: a kiválasztott szűrő kérdéseit, a 2. körtől kezdve csak a hibásakat. A számláló is erre vonatkozik.
- Egy cellára kattintva az a kérdés lesz a **következő kártya**; a korábbi következő kártya egyet hátrébb csúszik, így az ugrálástól nem marad ki kérdés a körből.
- Az **← Előző** gomb az utoljára megválaszolt kártyára lép vissza (a válaszadás sorrendjében).
- Az **Összesítő** gomb akkor aktív, ha a pakli minden kérdése értékelve van.
- Széles képernyőn a lista elrejthető a fejléc **☰ Lista** gombjával vagy az oldalsáv tetején lévő ✕-szel; ilyenkor a kártya középre kerül. A választás megmarad a böngészőben.
- Mobilon a lista a „☰ Kérdések” gombbal nyitható ki.

## Frissítések és a mentett haladás

A haladás a kérdések `id`-ja alapján él, ezért a kérdések módosítása nem nullázza le a felhasználók állását:

- **Új kérdés** a pakli végére kerül, a többi marad a helyén.
- **Törölt kérdés** kiesik a mentésből, a pozíció korrigálódik.
- **Szövegesen javított kérdés** (ugyanazzal az `id`-val) megőrzi a korábbi jelölését.
- Régebbi verziójú mentés automatikusan frissül; csak teljesen használhatatlan mentésnél indul tiszta lappal az oldal.

Két szabály, hogy ez működjön: **ne változtasd meg egy meglévő kérdés `id`-ját**, és ne módosítsd a `STORAGE_KEY` értékét a `js/state.js`-ben. Ha egy kérdés tartalma érdemben megváltozik (pl. más lett a helyes válasz), adj neki új `id`-t, így mindenkinek újra előjön.

## Mappastruktúra

```
.
├── index.html          # oldalváz
├── css/
│   └── style.css      # egyedi stílusok (elrendezés, kérdésrács, Canvas jelvények)
└── js/
    ├── data/
    │   ├── quiz1.js    # 1. kvíz – Alapok, ciklusok
    │   ├── quiz2.js    # 2. kvíz – Környezet, pip
    │   ├── quiz3.js    # 3. kvíz – Operátorok, típusok
    │   ├── quiz4.js    # 4. kvíz – Listák, szótárak, stringek
    │   ├── quiz5.js    # 5. kvíz – Függvények, lambda
    │   └── quiz6.js    # 6. kvíz – OOP, kivételkezelés
    ├── utils.js        # segédfüggvények
    ├── state.js        # állapot, pakli, eredmények, mentés
    ├── stats.js        # számlálók az aktuális paklira
    ├── sidebar.js      # bal oldali kérdéslista és számláló
    ├── render.js       # kártyák, fejléc, összesítő
    ├── actions.js      # kattintások, billentyűparancsok
    └── main.js         # indítás
```

## Futtatás

Nincs build lépés. Nyisd meg az `index.html`-t a böngészőben, vagy indíts egy helyi szervert:

```bash
python -m http.server 8000
# majd: http://localhost:8000
```

## Közzététel GitHub Pages-en

1. Töltsd fel a repóba a fájlokat.
2. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, ág = `main`, mappa = `/ (root)`.
3. Pár perc múlva elérhető: `https://<felhasználónév>.github.io/<repo-neve>/`

## Új kérdés hozzáadása

Vedd fel a kérdést a megfelelő `js/data/quizN.js` fájl `questions` tömbjébe. Új kvíz esetén hozz létre egy `quizN.js` fájlt ugyanezzel a szerkezettel, és vedd fel az `index.html` adatfájlok közé. A legördülő menü és a darabszámok automatikusan frissülnek.

Feleletválasztós kérdés:

```js
{
  id: "q3_21", quiz: 3, num: 21, type: "radio",
  prompt: "Mi a kimenet?",
  code: "print(2 ** 3)",          // opcionális
  options: ["6", "8", "9"],
  correct: 1,                      // a helyes válasz indexe
  explanation: "2 a 3. hatványon 8." // opcionális
}
```

Beírós kérdés:

```js
{
  id: "q3_22", quiz: 3, num: 22, type: "text", multiline: false,
  prompt: "Mi a kimenet?",
  code: "print(len('abc'))",
  answer: "3"
}
```

## Technológia

HTML, vanilla JavaScript, [Tailwind CSS](https://tailwindcss.com) (CDN), Inter és JetBrains Mono betűtípusok.

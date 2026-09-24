"use strict";
(() => {
  function extra(id, canonical, acceptedForms, he, suggestedLevel, hints, category = "accessory") {
    const levels = ["beginner", "intermediate", "advanced"];
    return { id, canonical, acceptedForms, he, suggestedLevel, category,
      hints: Object.fromEntries(levels.map((level, index) => [level, {
        en: hints[index * 2], he: hints[index * 2 + 1]
      }])) };
  }
  const extras = [
    extra("overalls", "overalls", ["overalls", "dungarees"], "סרבל", "intermediate", [
      "These pants have a front panel and straps over the shoulders.", "למכנסיים האלה יש חלק קדמי ורצועות מעל הכתפיים.",
      "This one-piece outfit joins pants to a bib with shoulder straps.", "הבגד הזה מחבר מכנסיים לחלק קדמי עם רצועות כתף.",
      "Look for the garment with a chest bib, buckled straps and pant legs.", "חפשו בגד עם חלק שמכסה את החזה, רצועות עם אבזמים ורגלי מכנסיים."
    ], "clothing"),
    extra("bag", "bag", ["bag", "bags", "shoulder bag", "crossbody bag", "satchel"], "תיק", "beginner", [
      "You carry things inside it. This one hangs from a strap.", "נושאים בתוכו דברים. התיק הזה תלוי על רצועה.",
      "Look for a small container worn on a long shoulder strap.", "חפשו כלי נשיאה קטן שתלוי על רצועת כתף ארוכה.",
      "This carrying accessory hangs beside the body rather than across both shoulders.", "אביזר הנשיאה הזה תלוי לצד הגוף ולא על שתי הכתפיים."
    ]),
    extra("beret", "beret", ["beret", "berets"], "כובע ברט", "advanced", [
      "This soft, round hat sits on the head.", "הכובע הרך והעגול הזה יושב על הראש.",
      "This rounded hat has a soft top and no long front visor.", "לכובע המעוגל הזה יש חלק עליון רך ואין מצחייה ארוכה.",
      "Name the soft, flat-crowned hat often worn tilted to one side.", "איך נקרא הכובע הרך בעל החלק העליון השטוח, שלעתים חובשים בהטיה?"
    ]),
    extra("earmuffs", "earmuffs", ["earmuffs", "earmuff", "ear muffs", "ear muff"], "מחממי אוזניים", "intermediate", [
      "These two soft pads keep your ears warm.", "שתי הכריות הרכות האלה מחממות את האוזניים.",
      "A band over the head joins two warm ear covers.", "סרט מעל הראש מחבר שני כיסויים מחממים לאוזניים.",
      "This winter accessory covers both ears with padded cups connected by a band.", "אביזר החורף הזה מכסה את שתי האוזניים בכריות שמחוברות בסרט."
    ]),
    extra("knee-pads", "knee pads", ["knee pad", "knee pads", "kneepad", "kneepads"], "מגני ברכיים", "intermediate", [
      "These covers protect your knees.", "הכיסויים האלה מגנים על הברכיים.",
      "Look for the protective pads on the fronts of the knees.", "חפשו את המגנים בקדמת הברכיים.",
      "These protective pieces cushion the joints in the middle of the legs.", "החלקים המגנים האלה מרפדים את המפרקים שבאמצע הרגליים."
    ]),
    extra("armband", "armband", ["armband", "armbands", "arm band", "arm bands"], "סרט זרוע", "intermediate", [
      "This band goes around the upper arm.", "הסרט הזה מקיף את החלק העליון של הזרוע.",
      "Unlike a bracelet, this band is worn above the elbow.", "בניגוד לצמיד, את הסרט הזה עונדים מעל המרפק.",
      "Name the strip worn around the upper arm, sometimes bearing a symbol.", "איך נקראת הרצועה שעונדים סביב הזרוע העליונה, ולעתים נושאת סמל?"
    ]),
    extra("badge", "badge", ["badge", "badges", "explorer badge", "ribbon badge", "rainbow badge"], "תג", "intermediate", [
      "This small sign is attached to the clothes.", "הסימן הקטן הזה מחובר לבגדים.",
      "Look for a small emblem worn on the shirt, coat or jacket.", "חפשו סמל קטן שעונדים על החולצה, המעיל או הז'קט.",
      "This wearable emblem may show membership, a role or an achievement.", "הסמל הזה על הבגד עשוי לציין חברות בקבוצה, תפקיד או הישג."
    ]),
    extra("brooch", "brooch", ["brooch", "brooches", "pin", "pins", "flower pin", "flower brooch", "leaf brooch"], "סיכה דקורטיבית", "advanced", [
      "This pretty pin decorates the clothes.", "הסיכה היפה הזאת מקשטת את הבגדים.",
      "This decorative pin is fastened to a jacket or coat.", "הסיכה הדקורטיבית הזאת מחוברת לז'קט או למעיל.",
      "Name the ornamental piece of jewellery pinned to fabric rather than worn on a chain.", "איך נקרא התכשיט הדקורטיבי שמצמידים לבד בסיכה במקום לענוד על שרשרת?"
    ]),
    extra("anklets", "anklets", ["anklet", "anklets", "ankle bracelet", "ankle bracelets"], "צמידי קרסול", "advanced", [
      "These bracelets go around the ankles.", "את הצמידים האלה עונדים סביב הקרסוליים.",
      "Look just above the shoes for jewellery worn around the ankles.", "חפשו ממש מעל הנעליים תכשיטים סביב הקרסוליים.",
      "These decorative bands encircle the joints between the lower legs and the feet.", "הרצועות הדקורטיביות האלה מקיפות את המפרקים שבין השוקיים לכפות הרגליים."
    ]),
    extra("leg-warmers", "leg warmers", ["leg warmer", "leg warmers", "legwarmer", "legwarmers"], "מחממי רגליים", "intermediate", [
      "These warm tubes cover the lower legs.", "השרוולים המחממים האלה מכסים את החלק התחתון של הרגליים.",
      "These knitted covers sit above the shoes but do not cover the feet.", "הכיסויים הסרוגים האלה נמצאים מעל הנעליים ולא מכסים את כפות הרגליים.",
      "Name the tubular knitted garments worn around the lower legs for warmth.", "איך נקראים שרוולי הבד הסרוגים שלובשים סביב החלק התחתון של הרגליים כדי להתחמם?"
    ]),
    extra("medal", "medal", ["medal", "medals", "courier medal"], "מדליה", "intermediate", [
      "This award hangs from a ribbon.", "הפרס הזה תלוי על סרט.",
      "Look for a round award hanging from a ribbon on the chest.", "חפשו פרס עגול שתלוי מסרט על החזה.",
      "This small metal award is worn to mark an achievement or service.", "את פרס המתכת הקטן הזה עונדים לציון הישג או שירות."
    ]),
    extra("whistle", "whistle", ["whistle", "whistles", "whistle necklace"], "משרוקית", "intermediate", [
      "You blow into this small object to make a sharp sound.", "נושפים בחפץ הקטן הזה כדי להשמיע צליל חד.",
      "This small sound-making tool hangs from a cord around the neck.", "הכלי הקטן שמשמיע צליל תלוי מחוט סביב הצוואר.",
      "A coach may blow into this tool to give a loud signal.", "מאמן עשוי לנשוף בכלי הזה כדי לתת אות חזק."
    ]),
    extra("boot-wings", "boot wings", ["boot wings", "boot wing", "wing charms", "wing charm"], "כנפיים לקישוט מגפיים", "advanced", [
      "These little wings decorate the boots.", "הכנפיים הקטנות האלה מקשטות את המגפיים.",
      "Look for wing-shaped decorations attached near the ankles of the boots.", "חפשו קישוטים בצורת כנפיים ליד הקרסוליים של המגפיים.",
      "These wing-shaped costume ornaments decorate footwear; they are not body parts.", "קישוטי התחפושת האלה בצורת כנפיים מקשטים את הנעליים; הם אינם חלקי גוף."
    ]),
    extra("boot-chain", "boot chain", ["boot chain", "boot chains"], "שרשרת למגף", "advanced", [
      "This chain decorates a boot.", "השרשרת הזאת מקשטת מגף.",
      "A row of linked pieces hangs across the front of the boot.", "שורה של חוליות מחוברות תלויה בקדמת המגף.",
      "Name the linked metal decoration attached to footwear rather than the neck.", "איך נקרא קישוט חוליות המתכת שמחובר לנעל ולא לצוואר?"
    ]),
    extra("boot-bow", "boot bow", ["boot bow", "boot bows", "bow", "bows"], "פפיון למגף", "advanced", [
      "This little ribbon bow decorates a boot.", "פפיון הסרט הקטן הזה מקשט מגף.",
      "Look for two ribbon loops and two short tails on the boot.", "חפשו שתי לולאות סרט ושני קצוות קצרים על המגף.",
      "This tied ribbon ornament is worn on footwear, not at the collar.", "קישוט הסרט הקשור הזה נמצא על הנעל ולא בצווארון."
    ]),
    extra("waist-chain", "waist chain", ["waist chain", "waist chains"], "שרשרת מותן", "advanced", [
      "This chain hangs around the waist.", "השרשרת הזאת תלויה סביב המותניים.",
      "This decorative chain hangs below the belt.", "השרשרת הדקורטיבית הזאת תלויה מתחת לחגורה.",
      "Unlike a belt, this linked accessory decorates the waist without holding up trousers.", "בניגוד לחגורה, אביזר החוליות הזה מקשט את המותניים ואינו מחזיק את המכנסיים."
    ]),
    extra("shoulder-cord", "shoulder cord", ["shoulder cord", "shoulder cords"], "שרוך כתף", "advanced", [
      "This cord loops over a shoulder.", "השרוך הזה תלוי בלולאה על הכתף.",
      "Look for a decorative cord hanging in loops from the jacket's shoulder.", "חפשו שרוך דקורטיבי שתלוי בלולאות מכתף הז'קט.",
      "This uniform ornament is draped from the shoulder in curved loops.", "קישוט המדים הזה תלוי מהכתף בלולאות מעוגלות."
    ]),
    extra("shoe-charm", "shoe charm", ["shoe charm", "shoe charms", "charm", "charms"], "תליון לנעל", "advanced", [
      "This tiny decoration hangs from a shoe.", "הקישוט הזעיר הזה תלוי מהנעל.",
      "Look for a small decorative pendant attached near the shoelaces.", "חפשו תליון דקורטיבי קטן שמחובר ליד השרוכים.",
      "This small hanging ornament decorates a shoe rather than a necklace or bracelet.", "הקישוט הקטן והתלוי הזה מקשט נעל ולא שרשרת או צמיד."
    ])
  ];
  const illustratedClues = {
    shirt: {
      he: "חולצה",
      hints: {
        beginner: { en: "This top covers the chest and has sleeves.", he: "הבגד העליון הזה מכסה את החזה ויש לו שרוולים." },
        intermediate: { en: "Look for the collared top worn on the upper body.", he: "חפשו את החולצה בעלת הצווארון שעל החלק העליון של הגוף." },
        advanced: { en: "This upper-body garment has a collar; a jacket or strap may cover part of its front.", he: "לבגד העליון הזה יש צווארון; ז'קט או רצועה עשויים לכסות חלק מחזיתו." }
      }
    },
    scarf: {
      hints: {
        beginner: { en: "This piece of fabric goes around the neck.", he: "את פיסת הבד הזאת לובשים סביב הצוואר." },
        intermediate: { en: "Look for fabric wrapped or tied around the neck.", he: "חפשו בד כרוך או קשור סביב הצוואר." },
        advanced: { en: "This neck accessory can provide warmth or add decoration, depending on its fabric and shape.", he: "אביזר הצוואר הזה יכול לחמם או לקשט, בהתאם לבד ולצורה שלו." }
      }
    },
    gloves: {
      hints: {
        beginner: { en: "These covers are worn on the hands.", he: "את הכיסויים האלה לובשים על כפות הידיים." },
        intermediate: { en: "These protect the hands; this pair leaves the fingertips free.", he: "הם מגנים על כפות הידיים; הזוג הזה משאיר את קצות האצבעות חופשיים." },
        advanced: { en: "This handwear has separate finger openings rather than one shared pocket.", he: "ללבוש הידיים הזה פתחים נפרדים לאצבעות, ולא כיס משותף אחד." }
      }
    }
  };
  const vocabulary = [...window.BodyWearablesVocabulary, ...extras].map(word => {
    const adjusted = { ...word, ...illustratedClues[word.id] };
    return {
      ...adjusted, canonical: word.id === "trousers" ? "pants" : adjusted.canonical,
      hints: Object.fromEntries(Object.entries(adjusted.hints).map(([level, hint]) => [level, {
        ...hint, en: word.id === "hands" && level === "advanced" ?
          "These grasping parts extend beyond the wrists and have fingers." :
          hint.en.replace(/\btrousers\b/g, "pants")
      }]))
    };
  });
  const byId = new Map(vocabulary.map(item => [item.id, item]));
  if (byId.size !== vocabulary.length) throw new Error("Duplicate illustrated vocabulary ID.");
  const normalize = value => String(value).trim().replace(/\s+/g, " ").toLowerCase();
  const hatIds = {
    "anime-01": "cap", "anime-02": "beret", "manga-01": "beret", "manga-02": "beanie",
    "superhero-01": "cap", "superhero-02": "beret", "cartoon-01": "cap", "cartoon-02": "hat"
  };
  const accessoryIds = {
    earring: "earrings", "boot-charms": "boot-wings", "flower-pin": "brooch",
    "ribbon-badge": "badge", "explorer-badge": "badge", "rainbow-badge": "badge",
    "whistle-necklace": "whistle"
  };
  const contextualAliases = {
    cap: ["hat", "hats"], beanie: ["hat", "hats"], beret: ["hat", "hats"],
    "T-shirt": ["shirt", "shirts"], boots: ["shoe", "shoes"], trainers: ["shoe", "shoes"],
    scarf: ["neckerchief", "silk scarf"], gloves: ["fingerless gloves"],
    ring: ["flower ring"], whistle: ["necklace", "necklaces"]
  };
  const excludedConceptIds = new Set([
    "anklets", "beanie", "blouse", "beret", "boot-bow", "boot-chain", "boot-wings",
    "bow-tie", "brooch", "knee-pads", "leg-warmers", "leggings", "mittens", "palms",
    "shoe-charm", "shoulder-cord", "waist-chain"
  ]);
  function playableTargets(targets) {
    return targets.filter(target => !excludedConceptIds.has(target.id));
  }
  function accessoryConceptId(character, accessory) {
    return accessory.conceptId ?? (accessory.id === "hat" ? hatIds[character.id] || "hat" :
      accessoryIds[accessory.id] || accessory.id);
  }
  function availableAccessories(character, accessories) {
    return accessories.filter(accessory => !excludedConceptIds.has(accessoryConceptId(character, accessory)));
  }
  const basicBodyIds = Object.freeze([
    "arms", "cheeks", "chest", "chin", "ears", "elbows", "eyes", "feet", "fingers",
    "hair", "hands", "head", "legs", "lips", "mouth", "neck", "nose", "shoulders"
  ]);
  const basicItems = Object.freeze([
    "bag", "belt", "boots", "coat", "dress", "glasses", "gloves", "hat",
    "jeans", "ring", "shirt", "shoes", "skirt", "watch", "pants"
  ]);
  const basicMeanings = { bag: "תיק", hat: "כובע", shirt: "חולצה", shoes: "נעליים", pants: "מכנסיים" };
  if (new Set(basicBodyIds).size !== 18 ||
    !basicBodyIds.every(id => byId.get(id)?.category === "body") ||
    new Set(basicItems).size !== 15 || !basicItems.every(form => vocabulary.some(word =>
      word.category !== "body" && word.acceptedForms.some(alias => normalize(alias) === form)))) {
    throw new Error("Invalid basic vocabulary lists.");
  }
  function targetsForLevel(targets, level) {
    if (!["beginner", "intermediate", "advanced"].includes(level)) throw new Error(`Unsupported level: ${level}`);
    targets = playableTargets(targets);
    if (level !== "intermediate") return targets;
    return targets.flatMap(target => {
      if (target.category === "body") return basicBodyIds.includes(target.id) ? [target] : [];
      const canonical = basicItems.includes(normalize(target.canonical)) ? target.canonical :
        basicItems.find(form => target.acceptedForms.some(alias => normalize(alias) === form));
      if (!canonical) return [];
      // Keep the artwork/credit identity and every authored alias, but teach the familiar spelling.
      return [{ ...target, canonical,
        he: canonical === target.canonical ? target.he : basicMeanings[canonical] || target.he }];
    });
  }
  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function spellingOptions(target, roundTargets = []) {
    const word = target.canonical;
    const excluded = new Set([
      ...vocabulary.flatMap(item => [item.canonical, ...item.acceptedForms]),
      ...Object.values(contextualAliases).flat(),
      ...roundTargets.flatMap(item => [item.canonical, ...item.acceptedForms]),
      word, ...target.acceptedForms
    ].map(normalize));
    const candidates = new Set();
    const add = candidate => {
      if (!excluded.has(normalize(candidate))) candidates.add(candidate);
    };
    // Retain every original letter: swap neighbours or repeat one letter.
    // Keeping the first letter intact makes the options close visual matches.
    for (let i = 0; i < word.length; i++) {
      if (!/[a-z]/i.test(word[i])) continue;
      if (i > 0 && /[a-z]/i.test(word[i + 1] || "") && word[i] !== word[i + 1]) {
        add(word.slice(0, i) + word[i + 1] + word[i] + word.slice(i + 2));
      }
      add(word.slice(0, i) + word[i] + word.slice(i));
    }
    if (candidates.size < 3) throw new Error(`Not enough spelling distractors: ${word}`);
    return shuffle([word, ...shuffle([...candidates]).slice(0, 3)]);
  }
  function buildTargets(character, accessories) {
    const targets = new Map();
    function add(id, regions = [], accessoryId) {
      const word = byId.get(id);
      if (!word) throw new Error(`Missing illustrated vocabulary: ${character.id}/${id}`);
      if (!targets.has(id)) targets.set(id, {
        ...word, acceptedForms: [...new Set([...word.acceptedForms, ...(contextualAliases[id] || []),
          ...(character.id === "anime-02" && id === "shirt" ? ["tunic", "tunics"] : [])])],
        regions: [], accessoryIds: []
      });
      const target = targets.get(id);
      target.regions.push(...regions);
      if (accessoryId) target.accessoryIds.push(accessoryId);
    }
    for (const word of vocabulary.filter(word => word.category === "body")) {
      const regions = character.bodyRegions[word.id];
      if (!regions?.length) throw new Error(`Missing body location: ${character.id}/${word.id}`);
      add(word.id, regions);
    }
    for (const item of character.outfit) add(item.id, item.regions);
    for (const accessory of accessories) {
      add(accessoryConceptId(character, accessory), [], accessory.id);
    }
    return [...targets.values()];
  }
  for (const word of vocabulary) {
    Object.values(word.hints).forEach(Object.freeze);
    Object.freeze(word.hints);
    Object.freeze(word.acceptedForms);
    Object.freeze(word);
  }
  window.IllustratedContent = Object.freeze({
    vocabulary: Object.freeze(vocabulary), normalize, buildTargets, playableTargets, availableAccessories,
    targetsForLevel, spellingOptions, shuffle
  });
})();

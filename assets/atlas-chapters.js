(() => {
  "use strict";

  const choiceVariants = rows => rows.map(([passage, question, choices, answer, hint, explanation]) => ({
    passage, question, choices, answer, hint, explanation: explanation || `${answer} is the correct answer.`
  }));
  const mathVariants = rows => rows.map(([question, expression, choices, answer, hint, explanation]) => {
    const normalized = value => String(value).replaceAll(",", "").trim();
    return { question, expression, choices, answer: choices.find(choice => normalized(choice) === normalized(answer)) || String(answer), hint, explanation };
  });
  const scramble = (words, offset) => [...words.slice(offset % words.length), ...words.slice(0, offset % words.length)].reverse();
  const orderVariants = sentences => sentences.map((sentence, index) => {
    const answer = sentence.split(" ");
    return {
      question: "Build the complete instruction.",
      tokens: scramble(answer, index + 1),
      answer,
      hint: `Begin with “${answer[0]}” and finish with “${answer.at(-1)}”.`,
      explanation: `The complete instruction is: ${sentence}`
    };
  });
  const sequenceVariants = rows => rows.map(([expression, answer, hint]) => ({
    question: "Enter the symbols in the correct order.",
    expression, bank: [...new Set(answer)], answer, hint,
    explanation: `The correct sequence is ${answer.join(" → ")}.`
  }));
  const routeVariants = rows => rows.map(answer => ({
    question: "Build the safe route.",
    expression: answer.join(" → "),
    bank: ["north", "east", "south", "west"],
    answer,
    hint: `Begin ${answer[0]} and finish ${answer.at(-1)}.`,
    explanation: `The safe route is ${answer.join(", ")}.`
  }));
  const balanceVariants = (rows, moves, unit) => rows.map(([start, target, hint]) => ({
    question: `Move the level from ${start} to ${target} ${unit}.`,
    expression: `Start: ${start} · Target: ${target}`,
    start, target, moves, unit, hint,
    explanation: `The controls moved the level exactly to ${target} ${unit}.`
  }));
  const challenge = (id, title, subject, type, story, objective, spark, variants) => ({
    id, title, subject, type, story, objective, spark, variants
  });
  const finish = chapter => {
    chapter.challenges.forEach((item, index) => item.label = `Challenge ${index + 1} of ${chapter.challenges.length}`);
    return chapter;
  };

  const emberArchive = finish({
    title: "Ember Archive",
    subtitle: "The library beneath the sleeping volcano",
    fragment: "🔥",
    intro: "The Gale Garden current ends at a volcanic island where an ancient library has lost its memories.",
    opening: "The airship lands beside a brass archive built into warm black stone. Mira's footprints lead through ash-covered books toward a silent memory furnace.",
    startMessage: "Restore the ten archive seals, then use the new Rune Circuit to recover Mira's message.",
    completionMessage: "The Ember Archive remembers Mira's route, and a tide-shaped symbol glows on the next Atlas fragment.",
    ending: "The memory furnace projects Mira repairing a damaged storm ship before sailing toward the Tidal Observatory.",
    next: "../island-four/index.html",
    nextTitle: "Tidal Observatory",
    spots: [
      { label: "Ash inscription", icon: "📜", x: 10, y: 70, labelX: 11, labelY: 82 },
      { label: "Ember counter", icon: "🧮", x: 23, y: 64, labelX: 23, labelY: 77 },
      { label: "Rune circuit", icon: "🔶", x: 35, y: 55, labelX: 34, labelY: 68 },
      { label: "Gear shelves", icon: "⚙️", x: 48, y: 66, labelX: 48, labelY: 79 },
      { label: "Mira's journal", icon: "📖", x: 61, y: 57, labelX: 61, labelY: 70 },
      { label: "Archive mosaic", icon: "🧩", x: 74, y: 66, labelX: 74, labelY: 79 },
      { label: "Grammar seal", icon: "✒️", x: 87, y: 56, labelX: 86, labelY: 69 },
      { label: "Furnace floor", icon: "📐", x: 76, y: 39, labelX: 76, labelY: 51 },
      { label: "Master circuit", icon: "💠", x: 53, y: 34, labelX: 54, labelY: 46 },
      { label: "Memory furnace", icon: "🔥", x: 29, y: 36, labelX: 28, labelY: 48 }
    ],
    challenges: [
      challenge("ember-context", "Read the ash inscription", "English · context clues", "choice",
        "Heat reveals words hidden beneath the ash.", "Use context clues to decode the inscription.",
        "The first seal is open. The Ember Counter needs a precise total.",
        choiceVariants([
          ["The archive remained dormant until the furnace received a new crystal.", "What does dormant mean?", ["Inactive or asleep", "Extremely noisy", "Recently built", "Full of visitors"], "Inactive or asleep", "The archive changed only after receiving power."],
          ["Mira preserved the oldest map by placing it inside a fireproof case.", "What does preserved mean?", ["Kept safe", "Copied badly", "Burned completely", "Carried outside"], "Kept safe", "The fireproof case protected the map."],
          ["The damaged page was fragile, so Spark lifted it gently.", "What does fragile mean?", ["Easy to break", "Very valuable", "Difficult to read", "Covered in ash"], "Easy to break", "Spark handled the page gently."],
          ["The furnace gave a faint glow before becoming bright.", "What does faint mean?", ["Weak or dim", "Red and orange", "Sudden and dangerous", "Perfectly round"], "Weak or dim", "The glow later became brighter."],
          ["Mira wrote a concise warning using only six words.", "What does concise mean?", ["Short and clear", "Secret and coded", "Large and colourful", "Old and damaged"], "Short and clear", "Only six words were needed."],
          ["The brass cabinet remained intact after hot ash fell around it.", "What does intact mean?", ["Whole and undamaged", "Hidden underground", "Warm to the touch", "Difficult to open"], "Whole and undamaged", "The ash did not damage the cabinet."],
          ["Spark inspected every gear before starting the archive shelves.", "What does inspected mean?", ["Examined carefully", "Moved quickly", "Covered completely", "Counted aloud"], "Examined carefully", "Spark checked every gear before using the shelves."]
        ])),
      challenge("ember-total", "Count the ember crystals", "Mathematics · multi-step operations", "choice",
        "The archive combines crystal trays before powering the shelves.", "Calculate the available ember energy.",
        "The shelves are moving. The Rune Circuit has started flashing.",
        mathVariants([
          ["Three trays hold 425 crystals each, and 175 are already used. How many remain?", "3 × 425 − 175 = ?", ["1,100", "1,275", "950", "1,450"], 1100, "Multiply before subtracting.", "Three trays hold 1,275; subtracting 175 leaves 1,100."],
          ["Four drawers hold 360 sparks each, then Spark adds 85. What is the total?", "4 × 360 + 85 = ?", ["1,525", "1,440", "1,355", "1,625"], 1525, "Find four groups of 360 first.", "4 × 360 is 1,440; adding 85 gives 1,525."],
          ["The furnace stored 2,800 units and used 675 twice. How many remain?", "2,800 − 2 × 675 = ?", ["1,450", "2,125", "1,350", "750"], 1450, "Calculate the two equal uses first.", "Two uses total 1,350, leaving 1,450."],
          ["Five shelves need 248 units each. The reserve adds 160. What is the total?", "5 × 248 + 160 = ?", ["1,400", "1,240", "1,500", "1,320"], 1400, "Multiply 248 by five.", "Five shelves use 1,240; adding 160 gives 1,400."],
          ["Six lamps contain 195 units each. A test consumes 270. How many remain?", "6 × 195 − 270 = ?", ["900", "1,170", "870", "1,440"], 900, "Six groups of 195 make 1,170.", "1,170 minus 270 equals 900."],
          ["Seven archive trays hold 180 crystals each, and Spark adds 240. What is the total?", "7 × 180 + 240 = ?", ["1,500", "1,260", "1,440", "1,740"], 1500, "Multiply seven by 180 before adding.", "Seven trays hold 1,260 crystals; adding 240 gives 1,500."],
          ["The archive stores 3,200 energy units and uses 425 units on each of four shelves. How many remain?", "3,200 − 4 × 425 = ?", ["1,500", "1,700", "2,775", "1,075"], 1500, "Find the energy used by four shelves first.", "Four shelves use 1,700 units, leaving 1,500."]
        ])),
      challenge("rune-circuit", "Connect the Rune Circuit", "Logic · symbol sequencing", "sequence",
        "This island's new mechanic links glowing runes in an exact pattern.", "Copy the rune sequence without breaking the circuit.",
        "The circuit unlocked the mechanical shelves.",
        sequenceVariants([
          ["sun → flame → book → key", ["sun", "flame", "book", "key"], "Follow the symbols from heat to knowledge."],
          ["key → book → flame → sun", ["key", "book", "flame", "sun"], "This pattern reverses the first circuit."],
          ["flame → sun → key → book → flame", ["flame", "sun", "key", "book", "flame"], "The flame appears at both ends."],
          ["book → key → sun → flame", ["book", "key", "sun", "flame"], "Begin with knowledge and finish with heat."],
          ["sun → key → flame → book → key", ["sun", "key", "flame", "book", "key"], "The key appears twice."],
          ["key → sun → book → flame → key", ["key", "sun", "book", "flame", "key"], "The key begins and ends the circuit."],
          ["flame → book → sun → key → sun", ["flame", "book", "sun", "key", "sun"], "The sun appears twice."]
        ])),
      challenge("archive-factors", "Repair the gear shelves", "Mathematics · factors and multiples", "choice",
        "Each shelf gear accepts only a matching factor or multiple.", "Choose the number that fits the gear rule.",
        "The shelves reveal Mira's journal.",
        mathVariants([
          ["Which number is a factor of 48?", "48 ÷ ? has no remainder", ["6", "7", "10", "14"], 6, "Test the multiplication facts for 48.", "6 × 8 equals 48."],
          ["Which number is a multiple of 9?", "9 × ? = the answer", ["54", "52", "46", "62"], 54, "Use the nine-times table.", "54 is 9 × 6."],
          ["Which number is a common factor of 24 and 36?", "Factor of both numbers", ["6", "8", "9", "12"], 6, "Find a number that divides both exactly.", "Both 24 and 36 divide evenly by 6."],
          ["Which number is the first common multiple of 4 and 6 after zero?", "LCM(4, 6)", ["12", "10", "18", "24"], 12, "List multiples of four and six.", "12 is the smallest positive common multiple."],
          ["Which number is prime?", "Exactly two factors", ["29", "27", "21", "33"], 29, "A prime has only 1 and itself as factors.", "29 has exactly two factors."],
          ["Which number is a factor of 72?", "72 ÷ ? has no remainder", ["8", "5", "14", "16"], 8, "Use multiplication facts for 72.", "Eight is a factor because 8 × 9 equals 72."],
          ["Which number is a multiple of 12?", "12 × ? = the answer", ["84", "70", "92", "102"], 84, "Use the twelve-times table.", "84 is 12 × 7."]
        ])),
      challenge("mira-archive-note", "Read Mira's archive journal", "English · reading inference", "choice",
        "A protected journal explains why Mira entered the archive.", "Infer what Mira planned to do next.",
        "The journal points to a fraction mosaic.",
        choiceVariants([
          ["Mira repaired the storm ship's compass, but the tide chart remained blank. She copied an ocean symbol from the archive wall before leaving.", "Where was Mira probably travelling?", ["An ocean observatory", "Cloud Harbor", "A desert island", "The archive roof"], "An ocean observatory", "The tide chart and ocean symbol are clues."],
          ["The memory furnace showed a route covered by water twice each day. Mira waited until the blue line dropped before launching.", "Why did Mira wait?", ["The route was safer at low tide", "The ship needed more fuel", "The archive doors were locked", "Spark was asleep"], "The route was safer at low tide", "The blue water line dropped before launch."],
          ["Mira packed glass tubes, waterproof maps, and a brass diving bell key.", "What environment was she preparing for?", ["A wet ocean environment", "A hot volcanic tunnel", "A snowy mountain", "A dry library"], "A wet ocean environment", "All three objects are useful near water."],
          ["The final page says, “If I am delayed, follow the moon tide, not the noon tide.”", "Which tide should the explorer follow?", ["The moon tide", "The noon tide", "Either tide", "Neither tide"], "The moon tide", "The instruction directly names the moon tide."],
          ["Mira drew three waves beside the words “observatory lens.”", "What object will probably matter next?", ["A lens at an observatory", "A bridge power cell", "A seed basket", "A library shelf"], "A lens at an observatory", "The drawing connects waves and an observatory lens."],
          ["Mira wrapped the tide chart in oilcloth and placed it beside the storm ship's wheel.", "Why did she wrap the chart?", ["To keep it dry during the sea journey", "To make it easier to burn", "To hide it from Spark", "To repair the archive shelves"], "To keep it dry during the sea journey", "Oilcloth protects the chart from water."],
          ["The journal says, “The moon lens will show the safest channel when the water falls.”", "What should Mira use to find the safe channel?", ["The moon lens", "The memory furnace", "The gear shelves", "The ash inscription"], "The moon lens", "The journal directly names the tool that will show the channel."]
        ])),
      challenge("ember-fractions", "Complete the archive mosaic", "Mathematics · fraction operations", "choice",
        "The mosaic combines equal pieces of glowing glass.", "Add or subtract fractions with matching denominators.",
        "The mosaic opens the grammar seal.",
        mathVariants([
          ["What is 3/8 + 2/8?", "3/8 + 2/8 = ?", ["5/8", "5/16", "1/8", "6/8"], "5/8", "Keep the denominator and add the numerators.", "Three eighths plus two eighths equals five eighths."],
          ["What is 7/10 − 3/10?", "7/10 − 3/10 = ?", ["4/10", "4/20", "10/10", "3/10"], "4/10", "Subtract the numerators.", "Seven tenths minus three tenths equals four tenths."],
          ["What is 5/12 + 4/12?", "5/12 + 4/12 = ?", ["9/12", "9/24", "1/12", "10/12"], "9/12", "The pieces are all twelfths.", "Five twelfths plus four twelfths equals nine twelfths."],
          ["What is 11/15 − 6/15?", "11/15 − 6/15 = ?", ["5/15", "5/30", "17/15", "6/15"], "5/15", "Keep fifteen as the denominator.", "Eleven fifteenths minus six fifteenths equals five fifteenths."],
          ["What is 2/6 + 3/6?", "2/6 + 3/6 = ?", ["5/6", "5/12", "1/6", "6/6"], "5/6", "Add two and three.", "Two sixths plus three sixths equals five sixths."],
          ["What is 4/9 + 3/9?", "4/9 + 3/9 = ?", ["7/9", "7/18", "1/9", "8/9"], "7/9", "Keep ninths as the equal-sized pieces.", "Four ninths plus three ninths equals seven ninths."],
          ["What is 13/16 − 5/16?", "13/16 − 5/16 = ?", ["8/16", "8/32", "18/16", "5/16"], "8/16", "Subtract the numerators and keep the denominator.", "Thirteen sixteenths minus five sixteenths equals eight sixteenths."]
        ])),
      challenge("grammar-seal", "Restore the grammar seal", "English · verb tense", "choice",
        "The seal opens only for a sentence with the correct verb tense.", "Choose the correct verb form.",
        "The seal reveals measurements carved into the furnace floor.",
        choiceVariants([
          ["Yesterday Mira ___ the furnace crystal.", "Choose the correct verb.", ["replaced", "replace", "replacing", "will replace"], "replaced", "Yesterday signals past tense."],
          ["Spark usually ___ the archive temperature.", "Choose the correct verb.", ["checks", "checked yesterday", "checking", "will checked"], "checks", "Usually describes a repeated present action."],
          ["Tomorrow the shelves ___ the recovered maps.", "Choose the correct verb.", ["will display", "displayed", "displays yesterday", "displaying"], "will display", "Tomorrow signals future tense."],
          ["The explorers are ___ the final seal now.", "Choose the correct verb.", ["opening", "opened yesterday", "opens", "will opened"], "opening", "Are needs the -ing form."],
          ["Mira had ___ the warning before she left.", "Choose the correct verb.", ["written", "wrote", "write", "writing now"], "written", "Had is followed by the past participle."],
          ["Last night Spark ___ every archive gear.", "Choose the correct verb.", ["checked", "checks", "checking", "will check"], "checked", "Last night signals past tense."],
          ["At this moment, Mira is ___ the moon lens.", "Choose the correct verb.", ["calibrating", "calibrated", "calibrates", "will calibrated"], "calibrating", "Is is followed by the -ing form for an action happening now."]
        ])),
      challenge("furnace-area", "Measure the furnace floor", "Mathematics · area and perimeter", "choice",
        "The memory furnace needs a safe brass border.", "Calculate area or perimeter.",
        "The floor measurements power the Master Circuit.",
        mathVariants([
          ["A rectangle is 9 m long and 6 m wide. What is its area?", "9 × 6 = ?", ["54 m²", "30 m²", "15 m²", "45 m²"], "54 m²", "Area is length times width.", "Nine times six equals 54 square metres."],
          ["A rectangle is 12 m by 5 m. What is its perimeter?", "2 × (12 + 5) = ?", ["34 m", "60 m", "17 m", "24 m"], "34 m", "Add the length and width, then double.", "Twice 17 equals 34 metres."],
          ["A square has sides of 8 m. What is its area?", "8 × 8 = ?", ["64 m²", "32 m²", "16 m²", "56 m²"], "64 m²", "A square's area is side times side.", "Eight times eight equals 64 square metres."],
          ["A floor is 14 m long and 4 m wide. What is its perimeter?", "2 × (14 + 4) = ?", ["36 m", "56 m", "18 m", "32 m"], "36 m", "Double the sum of the two side lengths.", "Fourteen plus four is 18; doubled is 36."],
          ["A mosaic is 11 m by 7 m. What is its area?", "11 × 7 = ?", ["77 m²", "36 m²", "18 m²", "70 m²"], "77 m²", "Multiply length by width.", "Eleven times seven equals 77 square metres."],
          ["A brass floor panel is 13 m long and 6 m wide. What is its area?", "13 × 6 = ?", ["78 m²", "38 m²", "19 m²", "72 m²"], "78 m²", "Area is length times width.", "Thirteen times six equals 78 square metres."],
          ["A square furnace border has sides of 9 m. What is its perimeter?", "4 × 9 = ?", ["36 m", "81 m", "18 m", "27 m"], "36 m", "A square has four equal sides.", "Four sides of nine metres total 36 metres."]
        ])),
      challenge("master-runes", "Synchronize the Master Circuit", "Logic · advanced rune sequencing", "sequence",
        "Two rune loops must synchronize before the furnace can remember.", "Enter the longer rune sequence.",
        "The furnace is ready for the final memory calculation.",
        sequenceVariants([
          ["book → sun → key → flame → sun", ["book", "sun", "key", "flame", "sun"], "The sun appears twice."],
          ["key → flame → book → sun → key", ["key", "flame", "book", "sun", "key"], "The key begins and ends the loop."],
          ["sun → book → flame → key → book → sun", ["sun", "book", "flame", "key", "book", "sun"], "The sequence mirrors around the key."],
          ["flame → key → sun → book → flame", ["flame", "key", "sun", "book", "flame"], "The flame closes the circuit."],
          ["book → key → flame → sun → flame → key", ["book", "key", "flame", "sun", "flame", "key"], "Flame and key both repeat."],
          ["key → sun → flame → book → sun → key", ["key", "sun", "flame", "book", "sun", "key"], "The key closes the loop, and the sun repeats."],
          ["flame → book → key → sun → book → flame", ["flame", "book", "key", "sun", "book", "flame"], "The flame begins and ends, while the book appears twice."]
        ])),
      challenge("memory-furnace", "Recover the furnace memory", "Mathematics · multi-step reasoning", "choice",
        "The final calculation reconstructs Mira's recorded route.", "Solve the furnace's final multi-step problem.",
        "The complete memory points toward the Tidal Observatory.",
        mathVariants([
          ["The furnace has 8 rows of 125 memories, then restores 340 more. How many memories are active?", "8 × 125 + 340 = ?", ["1,340", "1,000", "1,240", "1,440"], 1340, "Multiply before adding.", "Eight rows contain 1,000 memories; adding 340 gives 1,340."],
          ["Six crystals hold 240 memories each. 390 damaged memories are removed. How many remain?", "6 × 240 − 390 = ?", ["1,050", "1,440", "950", "1,150"], 1050, "Find the total before subtracting.", "Six crystals hold 1,440; removing 390 leaves 1,050."],
          ["The archive restores 475 memories on each of 3 floors and 225 in the furnace. What is the total?", "3 × 475 + 225 = ?", ["1,650", "1,425", "1,750", "1,525"], 1650, "Three groups of 475 come first.", "1,425 plus 225 equals 1,650."],
          ["A memory route is 3,600 units. Two blocked sections measure 725 and 475. How much is usable?", "3,600 − 725 − 475 = ?", ["2,400", "2,875", "2,500", "1,200"], 2400, "Combine the blocked sections.", "The blocked total is 1,200, leaving 2,400."],
          ["Nine shelves reveal 184 symbols each, plus 144 furnace symbols. How many appear?", "9 × 184 + 144 = ?", ["1,800", "1,656", "1,900", "1,700"], 1800, "Nine groups of 184 make 1,656.", "1,656 plus 144 equals 1,800."],
          ["Seven crystal rows restore 215 memories each, and the furnace restores 195 more. How many are active?", "7 × 215 + 195 = ?", ["1,700", "1,505", "1,900", "1,620"], 1700, "Multiply before adding the furnace memories.", "Seven rows restore 1,505 memories; adding 195 gives 1,700."],
          ["The furnace holds 4,200 route symbols and removes three damaged groups of 650. How many remain?", "4,200 − 3 × 650 = ?", ["2,250", "1,950", "2,900", "2,150"], 2250, "Find the total number of damaged symbols first.", "Three groups contain 1,950 symbols, leaving 2,250."]
        ]))
    ]
  });

  const tidalObservatory = finish({
    title: "Tidal Observatory",
    subtitle: "The moon-powered laboratory above the endless sea",
    fragment: "🌊",
    intro: "The archive route reaches a floating ocean laboratory where moon tides have flooded the lower instruments.",
    opening: "Mira's waterproof map rests beside a silent telescope. A trapped tide lens holds the next part of her route.",
    startMessage: "Restore the observatory and learn to operate the Tide Lock, which raises and lowers water levels.",
    completionMessage: "The moon lens reveals Mira heading toward a mountain divided by ice and fire.",
    ending: "The restored telescope shows Mira's storm ship climbing toward Frostfire Summit while a shadow follows beneath the clouds.",
    next: "../island-five/index.html",
    nextTitle: "Frostfire Summit",
    spots: [
      { label: "Dock report", icon: "⚓", x: 9, y: 72, labelX: 10, labelY: 84 },
      { label: "Tide clock", icon: "🕰️", x: 20, y: 57, labelX: 19, labelY: 69 },
      { label: "Tide Lock", icon: "🌊", x: 33, y: 69, labelX: 33, labelY: 82 },
      { label: "Pearl arrays", icon: "🔵", x: 45, y: 55, labelX: 45, labelY: 67 },
      { label: "Diving log", icon: "🤿", x: 58, y: 68, labelX: 58, labelY: 81 },
      { label: "Moon fractions", icon: "🌙", x: 70, y: 55, labelX: 70, labelY: 67 },
      { label: "Signal grammar", icon: "📡", x: 88, y: 68, labelX: 87, labelY: 81 },
      { label: "Glass tanks", icon: "🐠", x: 81, y: 39, labelX: 82, labelY: 51 },
      { label: "Deep Tide Lock", icon: "🔱", x: 55, y: 34, labelX: 55, labelY: 46 },
      { label: "Moon telescope", icon: "🔭", x: 27, y: 34, labelX: 27, labelY: 46 }
    ],
    challenges: [
      challenge("dock-report", "Read the flooded dock report", "English · main idea", "choice",
        "The dock report explains why the observatory stopped working.", "Identify the report's main idea.",
        "The report names the Tide Clock as the first damaged instrument.",
        choiceVariants([
          ["A strong moon tide flooded the lower deck. The machines are dry now, but their clocks no longer agree.", "What is the main problem?", ["The tide clocks are out of sync", "The deck is still underwater", "The telescope is missing", "The ship has no anchor"], "The tide clocks are out of sync", "Focus on the problem that remains now."],
          ["The observatory can predict safe sea routes only when all four moon mirrors point together. Two mirrors turned during the storm.", "What must be repaired?", ["The moon mirror alignment", "The sea route itself", "The dock ropes", "The archive furnace"], "The moon mirror alignment", "Two mirrors changed position."],
          ["Mira drained the western tank, but the eastern tank refilled before she could unlock the lens.", "Why is the lens still locked?", ["The eastern tank refilled", "Mira lost the map", "The western tank is too empty", "The telescope points north"], "The eastern tank refilled", "The word but introduces the remaining problem."],
          ["Every tide bell rings, yet the final bell rings six minutes late. The delay makes the route calculation unsafe.", "What causes the unsafe calculation?", ["The final bell's delay", "The number of bells", "The route distance", "The moonlight"], "The final bell's delay", "The delayed bell changes the timing."],
          ["The observatory has enough power. Its problem is that salt crystals block the water gates.", "What should be cleared?", ["Salt crystals from the gates", "Power from the observatory", "Water from the ocean", "Clouds from the sky"], "Salt crystals from the gates", "The passage directly identifies the blockage."],
          ["The dock pumps still run, but cracked pipes send the water back into the lower laboratory.", "What is the main problem?", ["The pipes are leaking", "The pumps have no power", "The moon mirrors are missing", "The dock ropes are too short"], "The pipes are leaking", "The pumps work, but the cracked pipes let water return."],
          ["Three signal lamps shine correctly. The fourth flashes at the wrong time and confuses incoming ships.", "What needs to be fixed?", ["The fourth lamp's timing", "All three working lamps", "The incoming ships", "The ocean current"], "The fourth lamp's timing", "Only the fourth lamp flashes at the wrong time."]
        ])),
      challenge("tide-clock", "Synchronize the Tide Clock", "Mathematics · elapsed time", "choice",
        "The four clocks must show the same safe-tide time.", "Calculate elapsed time.",
        "The clocks agree. The Tide Lock controls are active.",
        mathVariants([
          ["A tide begins at 09:35 and lasts 2 hours 25 minutes. When does it end?", "09:35 + 2 h 25 min", ["12:00", "11:50", "12:10", "11:00"], "12:00", "Add two hours, then 25 minutes.", "09:35 plus 2:25 is 12:00."],
          ["The gate opens at 14:20 and closes 1 hour 45 minutes later. When does it close?", "14:20 + 1 h 45 min", ["16:05", "15:55", "16:15", "15:05"], "16:05", "Add one hour, then 45 minutes.", "14:20 plus 1:45 is 16:05."],
          ["Mira waited from 07:50 until 10:15. How long did she wait?", "10:15 − 07:50", ["2 h 25 min", "2 h 15 min", "3 h 25 min", "1 h 35 min"], "2 h 25 min", "Count to 08:00, then to 10:15.", "The elapsed time is 2 hours 25 minutes."],
          ["A test starts at 18:40 and lasts 55 minutes. When does it finish?", "18:40 + 55 min", ["19:35", "19:25", "18:95", "20:05"], "19:35", "Twenty minutes reaches 19:00; add 35 more.", "The test finishes at 19:35."],
          ["The safe tide lasts from 11:25 to 13:10. How long is it?", "13:10 − 11:25", ["1 h 45 min", "2 h 15 min", "1 h 35 min", "2 h 45 min"], "1 h 45 min", "Count from 11:25 to noon, then onward.", "The safe tide lasts 1 hour 45 minutes."],
          ["A moon-tide test begins at 06:45 and lasts 1 hour 35 minutes. When does it end?", "06:45 + 1 h 35 min", ["08:20", "08:10", "07:80", "09:20"], "08:20", "Add one hour, then 35 minutes.", "06:45 plus 1 hour 35 minutes is 08:20."],
          ["The diving gate stays open from 15:30 until 17:05. How long is it open?", "17:05 − 15:30", ["1 h 35 min", "2 h 35 min", "1 h 25 min", "35 min"], "1 h 35 min", "Count from 15:30 to 16:30, then to 17:05.", "The gate stays open for 1 hour 35 minutes."]
        ])),
      challenge("tide-lock", "Operate the Tide Lock", "Logic · water-level balancing", "balance",
        "Use Raise and Lower controls to reach the marked water level.", "Balance the Tide Lock exactly.",
        "The lower laboratory is dry enough to enter.",
        balanceVariants([[2, 7, "Raise the level by a total of five."], [8, 3, "Lower the level by five."], [1, 8, "Use more than one control."], [7, 2, "Move down carefully."], [4, 9, "The target is five levels higher."], [6, 1, "Lower the level by five."], [3, 10, "Raise the level by seven using more than one control."]], [
          { label: "Raise 1", amount: 1 }, { label: "Raise 2", amount: 2 }, { label: "Lower 1", amount: -1 }, { label: "Lower 2", amount: -2 }
        ], "levels")),
      challenge("pearl-arrays", "Sort the pearl arrays", "Mathematics · decimals", "choice",
        "Pearl sensors record depths using decimal numbers.", "Compare and calculate decimals.",
        "The arrays reveal Mira's diving log.",
        mathVariants([
          ["Which depth is greatest?", "Compare the decimals", ["4.75 m", "4.57 m", "4.705 m", "4.7 m"], "4.75 m", "Compare tenths, then hundredths.", "4.75 is greater than the other values."],
          ["What is 6.4 + 2.35?", "6.40 + 2.35 = ?", ["8.75", "8.39", "7.75", "8.65"], "8.75", "Align the decimal points.", "6.40 plus 2.35 equals 8.75."],
          ["What is 9.2 − 3.68?", "9.20 − 3.68 = ?", ["5.52", "6.48", "5.62", "6.52"], "5.52", "Write 9.2 as 9.20.", "9.20 minus 3.68 equals 5.52."],
          ["Which value is smallest?", "Compare the decimals", ["0.48", "0.408", "0.84", "0.44"], "0.408", "Compare tenths first.", "0.408 has zero tenths and is the smallest."],
          ["What is 3.75 + 1.8?", "3.75 + 1.80 = ?", ["5.55", "4.83", "5.45", "4.55"], "5.55", "Align decimal places.", "3.75 plus 1.80 equals 5.55."],
          ["What is 7.08 + 1.67?", "7.08 + 1.67 = ?", ["8.75", "8.65", "9.75", "7.75"], "8.75", "Align the hundredths before adding.", "7.08 plus 1.67 equals 8.75."],
          ["Which depth is greatest?", "Compare the decimals", ["5.09 m", "5.9 m", "5.099 m", "5.19 m"], "5.9 m", "Write 5.9 as 5.900 to compare.", "5.900 is greater than 5.190, 5.099, and 5.090."]
        ])),
      challenge("diving-log", "Read Mira's diving log", "English · cause and effect", "choice",
        "The diving log records what Mira discovered beneath the observatory.", "Identify causes and effects.",
        "The log unlocks the Moon Fraction dial.",
        choiceVariants([
          ["Mira closed the upper gate, so the lower chamber drained safely.", "What caused the chamber to drain?", ["Closing the upper gate", "Opening the telescope", "Raising the tide clock", "Moving the airship"], "Closing the upper gate", "The word so connects cause and effect."],
          ["Because the lens was covered in salt, the moon image looked blurred.", "Why was the image blurred?", ["Salt covered the lens", "The moon was too bright", "The tide was low", "Mira moved the clock"], "Salt covered the lens", "Because introduces the cause."],
          ["The warning bell rang after the eastern tank became too full.", "What happened first?", ["The eastern tank became too full", "The warning bell rang", "Mira left the island", "The moon disappeared"], "The eastern tank became too full", "After tells which event came second."],
          ["Mira repaired the diving bell; therefore, she could inspect the deep gate.", "What was the effect of the repair?", ["She could inspect the deep gate", "The tide clock stopped", "The dock flooded", "The map burned"], "She could inspect the deep gate", "Therefore introduces the result."],
          ["The route remained hidden until Spark aimed the moon mirror at the wall.", "What revealed the route?", ["Aiming the moon mirror", "Draining the western tank", "Reading the dock report", "Counting pearls"], "Aiming the moon mirror", "The route appeared after the mirror was aimed."],
          ["Because Mira sealed the cracked pipe, the lower deck stayed dry.", "What caused the deck to stay dry?", ["Sealing the cracked pipe", "Turning off the tide clock", "Opening the eastern tank", "Moving the telescope"], "Sealing the cracked pipe", "Because introduces the action that caused the result."],
          ["The moon mirror turned toward the lens, so a bright route appeared on the wall.", "What was the effect of turning the mirror?", ["A bright route appeared", "The dock flooded", "The lens cracked", "The tide bells stopped"], "A bright route appeared", "The word so introduces the effect."]
        ])),
      challenge("moon-fractions", "Align the moon fractions", "Mathematics · unlike fractions", "choice",
        "The moon dial combines fractions with different denominators.", "Find equivalent fractions before calculating.",
        "The dial sends a signal to the grammar antenna.",
        mathVariants([
          ["What is 1/2 + 1/4?", "2/4 + 1/4 = ?", ["3/4", "2/6", "1/6", "3/8"], "3/4", "Rename one half as two fourths.", "Two fourths plus one fourth equals three fourths."],
          ["What is 3/4 − 1/2?", "3/4 − 2/4 = ?", ["1/4", "2/2", "2/4", "1/2"], "1/4", "Rename one half as two fourths.", "Three fourths minus two fourths equals one fourth."],
          ["What is 2/3 + 1/6?", "4/6 + 1/6 = ?", ["5/6", "3/9", "3/6", "5/9"], "5/6", "Rename two thirds as four sixths.", "Four sixths plus one sixth equals five sixths."],
          ["What is 5/6 − 1/3?", "5/6 − 2/6 = ?", ["3/6", "4/3", "4/6", "3/3"], "3/6", "Rename one third as two sixths.", "Five sixths minus two sixths equals three sixths."],
          ["What is 1/5 + 3/10?", "2/10 + 3/10 = ?", ["5/10", "4/15", "3/15", "4/10"], "5/10", "Rename one fifth as two tenths.", "Two tenths plus three tenths equals five tenths."],
          ["What is 1/3 + 1/6?", "2/6 + 1/6 = ?", ["3/6", "2/9", "4/6", "3/9"], "3/6", "Rename one third as two sixths.", "Two sixths plus one sixth equals three sixths."],
          ["What is 7/8 − 1/4?", "7/8 − 2/8 = ?", ["5/8", "6/4", "5/4", "6/8"], "5/8", "Rename one fourth as two eighths.", "Seven eighths minus two eighths equals five eighths."]
        ])),
      challenge("signal-grammar", "Repair the signal grammar", "English · conjunctions", "choice",
        "The antenna needs a conjunction that correctly joins each idea.", "Choose the best connecting word.",
        "The signal opens the glass tank measurements.",
        choiceVariants([
          ["The tide was rising, ___ Mira closed the lower gate.", "Choose the best conjunction.", ["so", "but", "or", "because of"], "so", "The second action is a result."],
          ["The route was longer, ___ it was safer.", "Choose the best conjunction.", ["but", "so", "because", "until"], "but", "The ideas contrast."],
          ["Spark waited ___ the moon mirror finished turning.", "Choose the best conjunction.", ["until", "but", "so", "or"], "until", "The word should show time."],
          ["Mira packed a diving bell ___ a waterproof map.", "Choose the best conjunction.", ["and", "but", "because", "although"], "and", "The sentence adds a second item."],
          ["We can use the eastern gate ___ the western gate.", "Choose the best conjunction.", ["or", "so", "until", "because"], "or", "The sentence offers a choice."],
          ["Mira cleaned the lens ___ salt had blurred the image.", "Choose the best conjunction.", ["because", "but", "or", "until"], "because", "The second idea gives the reason for cleaning."],
          ["___ the tide was high, the upper deck remained safe.", "Choose the best conjunction.", ["Although", "So", "And", "Until"], "Although", "The sentence contrasts the high tide with the safe deck."]
        ])),
      challenge("tank-volume", "Measure the glass tanks", "Mathematics · volume", "choice",
        "The observatory stores tidewater in rectangular tanks.", "Calculate volume.",
        "The measurements power the Deep Tide Lock.",
        mathVariants([
          ["A tank is 6 m long, 4 m wide, and 3 m high. What is its volume?", "6 × 4 × 3 = ?", ["72 m³", "24 m³", "13 m³", "54 m³"], "72 m³", "Multiply all three dimensions.", "The volume is 72 cubic metres."],
          ["A tank measures 8 m × 5 m × 2 m. What is its volume?", "8 × 5 × 2 = ?", ["80 m³", "40 m³", "15 m³", "100 m³"], "80 m³", "Multiply length, width, and height.", "The volume is 80 cubic metres."],
          ["A cube has sides of 4 m. What is its volume?", "4 × 4 × 4 = ?", ["64 m³", "48 m³", "16 m³", "32 m³"], "64 m³", "A cube uses the same dimension three times.", "Four cubed equals 64."],
          ["A tank is 9 m × 3 m × 4 m. What is its volume?", "9 × 3 × 4 = ?", ["108 m³", "27 m³", "64 m³", "116 m³"], "108 m³", "Multiply 9 by 3, then by 4.", "The volume is 108 cubic metres."],
          ["A tank measures 7 m × 6 m × 2 m. What is its volume?", "7 × 6 × 2 = ?", ["84 m³", "42 m³", "90 m³", "15 m³"], "84 m³", "Find the base area, then multiply by height.", "The volume is 84 cubic metres."],
          ["A narrow tide tank is 10 m long, 3 m wide, and 2 m high. What is its volume?", "10 × 3 × 2 = ?", ["60 m³", "30 m³", "15 m³", "120 m³"], "60 m³", "Multiply all three dimensions.", "Ten times three times two equals 60 cubic metres."],
          ["A cube-shaped water chamber has sides of 5 m. What is its volume?", "5 × 5 × 5 = ?", ["125 m³", "75 m³", "25 m³", "100 m³"], "125 m³", "Multiply the side length three times.", "Five cubed equals 125 cubic metres."]
        ])),
      challenge("deep-tide-lock", "Balance the Deep Tide Lock", "Logic · advanced water balancing", "balance",
        "The deep lock uses larger water changes than the first mechanism.", "Reach the exact pressure level.",
        "The telescope chamber is open.",
        balanceVariants([[3, 11, "Combine large and small raises."], [12, 4, "Use lowering controls."], [5, 14, "Raise by nine in more than one step."], [13, 6, "Lower by seven."], [2, 12, "Reach ten levels above the start."], [4, 13, "Raise by nine using the larger control."], [15, 5, "Lower the pressure by ten levels."]], [
          { label: "Raise 1", amount: 1 }, { label: "Raise 3", amount: 3 }, { label: "Lower 1", amount: -1 }, { label: "Lower 3", amount: -3 }
        ], "levels")),
      challenge("moon-telescope", "Focus the moon telescope", "Mathematics · coordinate reasoning", "choice",
        "The final lens points to a coordinate on the storm map.", "Interpret coordinates and movement.",
        "The telescope finds Frostfire Summit.",
        mathVariants([
          ["Start at (2, 3). Move 4 right and 2 up. Where do you finish?", "(2 + 4, 3 + 2)", ["(6, 5)", "(4, 7)", "(6, 1)", "(2, 5)"], "(6, 5)", "Right changes x; up changes y.", "The final coordinate is (6, 5)."],
          ["Start at (7, 6). Move 3 left and 4 down.", "(7 − 3, 6 − 4)", ["(4, 2)", "(10, 10)", "(3, 4)", "(4, 10)"], "(4, 2)", "Subtract from both coordinates.", "The final coordinate is (4, 2)."],
          ["Which point is 5 right and 1 up from (1, 4)?", "(1 + 5, 4 + 1)", ["(6, 5)", "(5, 6)", "(4, 5)", "(6, 3)"], "(6, 5)", "Add five to x and one to y.", "The final point is (6, 5)."],
          ["Move from (8, 2) to (3, 7). Which description is correct?", "Compare coordinates", ["5 left and 5 up", "5 right and 5 down", "3 left and 7 up", "5 left and 9 up"], "5 left and 5 up", "Compare x values and y values separately.", "x decreases by five and y increases by five."],
          ["Start at (4, 8). Move 2 right, 6 down, then 1 left.", "(4 + 2 − 1, 8 − 6)", ["(5, 2)", "(7, 2)", "(5, 14)", "(3, 2)"], "(5, 2)", "Complete the horizontal and vertical changes.", "The final coordinate is (5, 2)."],
          ["Start at (3, 5). Move 6 right and 3 down. Where do you finish?", "(3 + 6, 5 − 3)", ["(9, 2)", "(9, 8)", "(6, 2)", "(3, 8)"], "(9, 2)", "Add to x for right and subtract from y for down.", "The final coordinate is (9, 2)."],
          ["Move from (9, 4) to (5, 10). Which description is correct?", "Compare coordinates", ["4 left and 6 up", "4 right and 6 down", "5 left and 10 up", "6 left and 4 up"], "4 left and 6 up", "Compare the change in each coordinate.", "x decreases by four and y increases by six."]
        ]))
    ]
  });

  const frostfireSummit = finish({
    title: "Frostfire Summit",
    subtitle: "The mountain where ice and lava share one sky",
    fragment: "❄️",
    intro: "The moon telescope reveals Mira's ship at a mountain weather station split between freezing wind and volcanic heat.",
    opening: "The summit engines are trapped between ice and fire. Mira left thermal readings showing that something followed her here.",
    startMessage: "Balance the summit with the Thermal Core and uncover the identity of Mira's pursuer.",
    completionMessage: "The balanced summit opens a hidden route to the Unwritten Isle.",
    ending: "A recovered recording shows that Mira was not fleeing an enemy—she was guiding a lost Atlas guardian toward the final island.",
    next: "../island-six/index.html",
    nextTitle: "The Unwritten Isle",
    spots: [
      { label: "Weather warning", icon: "🌨️", x: 9, y: 63, labelX: 10, labelY: 76 },
      { label: "Temperature grid", icon: "🌡️", x: 21, y: 72, labelX: 22, labelY: 84 },
      { label: "Thermal Core", icon: "🔥", x: 34, y: 57, labelX: 34, labelY: 69 },
      { label: "Supply ratios", icon: "⚖️", x: 47, y: 69, labelX: 47, labelY: 82 },
      { label: "Mira's recording", icon: "🎙️", x: 59, y: 56, labelX: 59, labelY: 68 },
      { label: "Ice equations", icon: "🧊", x: 71, y: 69, labelX: 71, labelY: 82 },
      { label: "Warning beacon", icon: "🚨", x: 88, y: 58, labelX: 87, labelY: 71 },
      { label: "Summit map", icon: "🗺️", x: 78, y: 39, labelX: 79, labelY: 51 },
      { label: "Twin Thermal Core", icon: "♨️", x: 54, y: 34, labelX: 54, labelY: 46 },
      { label: "Guardian gate", icon: "🗿", x: 27, y: 36, labelX: 27, labelY: 48 }
    ],
    challenges: [
      challenge("weather-warning", "Interpret the weather warning", "English · summarizing", "choice",
        "The station warning combines several pieces of information.", "Choose the best summary.",
        "The warning gives the starting temperature for the grid.",
        choiceVariants([
          ["Ice blocks the northern path. Lava blocks the southern path. The central tunnel remains open but its temperature changes quickly.", "What is the best summary?", ["Use the central tunnel carefully", "Every path is closed", "The northern path is safest", "The lava has frozen"], "Use the central tunnel carefully", "The central path is open but unstable."],
          ["The wind turbines work, but frozen gears slow them. Heating every gear would melt the support ropes.", "What is the main challenge?", ["Warm the gears without overheating the ropes", "Replace every turbine", "Stop all wind", "Freeze the ropes"], "Warm the gears without overheating the ropes", "Both ice and excess heat matter."],
          ["Mira reached the summit safely. A large stone guardian followed her trail but repaired a broken bridge behind her.", "What is the best summary?", ["The guardian may be helping Mira", "The guardian destroyed the bridge", "Mira never reached the summit", "The trail disappeared"], "The guardian may be helping Mira", "Repairing the bridge is helpful."],
          ["The station needs equal heat on both sides. The western core is hot while the eastern core is nearly frozen.", "What must the explorers do?", ["Balance the two cores", "Heat only the western core", "Turn off both cores", "Leave the station"], "Balance the two cores", "The station needs equal heat."],
          ["The final gate opens only during calm weather. The next calm period begins after the thermal core is balanced.", "What should happen first?", ["Balance the thermal core", "Open the final gate", "Climb the guardian statue", "Freeze the weather station"], "Balance the thermal core", "The calm period starts afterward."],
          ["Snow covers the solar panels, and ash blocks the backup vents. The station will regain power only after both are cleared.", "What is the best summary?", ["Clear snow and ash to restore power", "Replace the entire station", "Wait for the lava to freeze", "Close every vent"], "Clear snow and ash to restore power", "Both blockages must be cleared before power returns."],
          ["The western bridge is warm enough to cross, but strong wind makes its loose ropes unsafe.", "What is the main danger?", ["The loose ropes in the wind", "Ice on the eastern path", "Heat from the western bridge", "A missing weather report"], "The loose ropes in the wind", "The bridge temperature is safe, but the wind moves the loose ropes."]
        ])),
      challenge("temperature-grid", "Calculate the temperature change", "Mathematics · integers", "choice",
        "Summit temperatures rise above and fall below zero.", "Calculate changes with positive and negative numbers.",
        "The grid activates the Thermal Core.",
        mathVariants([
          ["The temperature rises from −6°C to 4°C. What is the change?", "4 − (−6) = ?", ["10°C", "2°C", "−10°C", "6°C"], "10°C", "Count from −6 to zero, then to 4.", "The temperature rises 10 degrees."],
          ["The temperature is 7°C and falls 12 degrees. What is the new temperature?", "7 − 12 = ?", ["−5°C", "5°C", "−19°C", "19°C"], "−5°C", "The drop is larger than the starting temperature.", "Seven minus twelve equals negative five."],
          ["The core is −9°C and warms by 14 degrees.", "−9 + 14 = ?", ["5°C", "−5°C", "23°C", "−23°C"], "5°C", "Nine degrees reaches zero; five remain.", "The new temperature is 5°C."],
          ["The summit changes from 3°C to −8°C. How many degrees did it fall?", "3 − (−8)", ["11°C", "5°C", "−11°C", "8°C"], "11°C", "Count three to zero and eight more.", "The temperature fell 11 degrees."],
          ["A sensor reads −4°C, warms 9 degrees, then cools 3.", "−4 + 9 − 3 = ?", ["2°C", "8°C", "−2°C", "−16°C"], "2°C", "Warm first, then cool.", "Negative four plus nine is five; five minus three is two."],
          ["The air is −11°C and warms by 16 degrees. What is the new temperature?", "−11 + 16 = ?", ["5°C", "−5°C", "27°C", "−27°C"], "5°C", "Eleven degrees reaches zero; five degrees remain.", "Negative eleven plus sixteen equals five."],
          ["The lava ledge is 6°C and cools by 15 degrees. What is the new temperature?", "6 − 15 = ?", ["−9°C", "9°C", "−21°C", "21°C"], "−9°C", "The cooling is greater than the starting temperature.", "Six minus fifteen equals negative nine."]
        ])),
      challenge("thermal-core", "Balance the Thermal Core", "Logic · temperature balancing", "balance",
        "Use Heat and Cool controls to reach the safe temperature.", "Set the Thermal Core exactly.",
        "The safe temperature releases the supply lift.",
        balanceVariants([[-4, 3, "Warm by seven degrees."], [8, -2, "Cool by ten degrees."], [-7, 1, "Cross zero carefully."], [5, -4, "Cool by nine degrees."], [-2, 6, "Warm by eight degrees."], [-6, 5, "Warm by eleven degrees."], [9, -5, "Cool by fourteen degrees."]], [
          { label: "Heat 1°", amount: 1 }, { label: "Heat 3°", amount: 3 }, { label: "Cool 1°", amount: -1 }, { label: "Cool 3°", amount: -3 }
        ], "°C")),
      challenge("supply-ratios", "Balance the summit supplies", "Mathematics · ratios", "choice",
        "Rescue packs must follow the station's ratios.", "Use equivalent ratios.",
        "The supply lift carries Mira's recording.",
        mathVariants([
          ["A pack uses 2 heat cells for every 3 ice shields. How many shields pair with 8 cells?", "2:3 = 8:?", ["12", "9", "6", "16"], 12, "Eight is four times two.", "Multiply three by four to get 12."],
          ["Three ropes support 5 panels. How many ropes support 20 panels?", "3:5 = ?:20", ["12", "15", "8", "18"], 12, "Twenty is four times five.", "Multiply three by four to get 12."],
          ["Four crystals power 6 heaters. How many heaters can 10 crystals power?", "4:6 = 10:?", ["15", "12", "16", "20"], 15, "Simplify the ratio to 2:3.", "Ten crystals pair with 15 heaters."],
          ["Five blankets serve 2 crews. How many blankets serve 8 crews?", "5:2 = ?:8", ["20", "16", "13", "40"], 20, "Eight is four times two.", "Multiply five by four to get 20."],
          ["Six flags mark 9 safe steps. How many flags mark 27 steps?", "6:9 = ?:27", ["18", "21", "12", "24"], 18, "Twenty-seven is three times nine.", "Multiply six by three to get 18."],
          ["Two warming stones protect 7 supply crates. How many stones protect 28 crates?", "2:7 = ?:28", ["8", "14", "6", "10"], 8, "Twenty-eight is four times seven.", "Multiply two by four to get eight."],
          ["Seven ice hooks secure 4 ropes. How many hooks secure 12 ropes?", "7:4 = ?:12", ["21", "19", "28", "16"], 21, "Twelve is three times four.", "Multiply seven by three to get 21."]
        ])),
      challenge("mira-recording", "Listen to Mira's recording", "English · evidence and inference", "choice",
        "Mira describes the stone guardian following her.", "Use evidence to infer its purpose.",
        "The recording provides the key to the frozen equations.",
        choiceVariants([
          ["The guardian lifted fallen stones from Mira's path and never approached while she slept.", "What does this suggest?", ["It wanted to help without frightening her", "It planned to steal the ship", "It caused the storm", "It was unable to move"], "It wanted to help without frightening her", "Its actions were helpful and cautious."],
          ["Mira left a broken compass beside the trail. The next morning it was repaired.", "What is the strongest inference?", ["The guardian repaired the compass", "The compass repaired itself", "Spark returned to the archive", "The storm disappeared"], "The guardian repaired the compass", "The guardian was following the same trail."],
          ["The guardian pointed toward a blank place on the Atlas, then drew six fragments in the snow.", "What was it communicating?", ["The fragments lead to an unmapped island", "The summit has six peaks", "Mira should return home", "The snow is dangerous"], "The fragments lead to an unmapped island", "The blank map and six fragments belong together."],
          ["Mira wrote, “I no longer think it is chasing me. It is trying to reach the same destination.”", "How did Mira's opinion change?", ["She began to trust the guardian", "She became more afraid", "She forgot the guardian", "She decided to destroy it"], "She began to trust the guardian", "She no longer believed it was chasing her."],
          ["The guardian placed its hand over a cracked Atlas symbol, and the crack briefly glowed.", "What ability might it have?", ["It can restore Atlas magic", "It can freeze lava", "It can control Mira's ship", "It can erase memories"], "It can restore Atlas magic", "The damaged symbol reacted to its touch."],
          ["When an ice shelf broke, the guardian held it in place until Mira crossed safely.", "What does this action suggest?", ["The guardian was protecting Mira", "The guardian wanted the shelf to fall", "Mira ordered it to leave", "The guardian feared the ice"], "The guardian was protecting Mira", "Holding the shelf kept Mira safe while she crossed."],
          ["Mira marked the hidden gate on her map. The guardian nodded and pointed to the same blank island symbol.", "What can Mira infer?", ["They are seeking the same island", "The guardian wants a different route", "The map is upside down", "The summit is their final destination"], "They are seeking the same island", "Both point to the same destination."]
        ])),
      challenge("ice-equations", "Crack the ice equations", "Mathematics · order of operations", "choice",
        "Frozen panels display multi-operation expressions.", "Follow the correct order of operations.",
        "The equations restore the warning beacon.",
        mathVariants([
          ["What is 6 + 4 × 5?", "6 + 4 × 5 = ?", ["26", "50", "30", "20"], 26, "Multiply before adding.", "Four times five is 20; plus six equals 26."],
          ["What is (8 + 4) × 3?", "(8 + 4) × 3 = ?", ["36", "20", "32", "15"], 36, "Complete the parentheses first.", "Twelve times three equals 36."],
          ["What is 48 ÷ 6 + 7?", "48 ÷ 6 + 7 = ?", ["15", "8", "55", "14"], 15, "Divide before adding.", "Forty-eight divided by six is eight; plus seven is 15."],
          ["What is 30 − 3 × 8?", "30 − 3 × 8 = ?", ["6", "216", "27", "24"], 6, "Multiply three and eight first.", "Thirty minus 24 equals six."],
          ["What is 5 × (9 − 4) + 2?", "5 × (9 − 4) + 2 = ?", ["27", "23", "35", "17"], 27, "Parentheses, multiplication, then addition.", "Nine minus four is five; 5 × 5 + 2 = 27."],
          ["What is 7 + 6 × 4?", "7 + 6 × 4 = ?", ["31", "52", "28", "35"], 31, "Multiply before adding.", "Six times four is 24; plus seven equals 31."],
          ["What is (15 − 7) × 5 − 6?", "(15 − 7) × 5 − 6 = ?", ["34", "40", "24", "14"], 34, "Complete the parentheses, then multiply, then subtract.", "Fifteen minus seven is eight; 8 × 5 − 6 = 34."]
        ])),
      challenge("warning-beacon", "Rewrite the warning beacon", "English · active and passive voice", "choice",
        "The beacon needs a clear sentence naming who performs each action.", "Choose the clearest active sentence.",
        "The beacon projects a map of the summit.",
        choiceVariants([
          ["Choose the active sentence.", "Which sentence is clearest?", ["Mira repaired the eastern heater.", "The eastern heater was repaired by Mira.", "The heater was being repaired.", "A repair had happened."], "Mira repaired the eastern heater.", "Active voice names the doer first."],
          ["Choose the active sentence.", "Which sentence is clearest?", ["Spark measured the ice bridge.", "The ice bridge was measured by Spark.", "A measurement was made.", "The bridge had been measured."], "Spark measured the ice bridge.", "Spark should be the subject."],
          ["Choose the active sentence.", "Which sentence is clearest?", ["The guardian opened the stone gate.", "The stone gate was opened by the guardian.", "The gate was opened.", "There was an opening."], "The guardian opened the stone gate.", "Name the guardian before the action."],
          ["Choose the active sentence.", "Which sentence is clearest?", ["The explorers balanced the core.", "The core was balanced by the explorers.", "The balancing was completed.", "It was balanced."], "The explorers balanced the core.", "The explorers perform the action."],
          ["Choose the active sentence.", "Which sentence is clearest?", ["Mira recorded the final coordinates.", "The coordinates were recorded by Mira.", "A recording of coordinates occurred.", "They were recorded."], "Mira recorded the final coordinates.", "Mira is the clear subject."],
          ["Choose the active sentence.", "Which sentence is clearest?", ["Spark cleared the snowy sensor.", "The snowy sensor was cleared by Spark.", "The sensor was being cleared.", "A clearing took place."], "Spark cleared the snowy sensor.", "Spark is the subject performing the action."],
          ["Choose the active sentence.", "Which sentence is clearest?", ["The crew secured the summit ropes.", "The summit ropes were secured by the crew.", "The ropes had been secured.", "There was a securing of ropes."], "The crew secured the summit ropes.", "The crew is named before the action."]
        ])),
      challenge("summit-scale", "Read the summit map scale", "Mathematics · scale and distance", "choice",
        "The map uses scale measurements for mountain routes.", "Convert map distance to real distance.",
        "The scale reveals the Twin Thermal Core.",
        mathVariants([
          ["The scale is 1 cm = 4 km. A route is 6 cm. How long is it?", "6 × 4 = ?", ["24 km", "10 km", "18 km", "30 km"], "24 km", "Multiply map centimetres by four.", "Six times four equals 24 kilometres."],
          ["The scale is 1 cm = 5 km. A trail is 7 cm.", "7 × 5 = ?", ["35 km", "12 km", "30 km", "42 km"], "35 km", "Use seven groups of five.", "The trail is 35 kilometres."],
          ["A 27 km route appears as 3 cm. What is the scale?", "27 ÷ 3 = ?", ["1 cm = 9 km", "1 cm = 24 km", "1 cm = 30 km", "1 cm = 6 km"], "1 cm = 9 km", "Divide real distance by map distance.", "Each centimetre represents nine kilometres."],
          ["The scale is 2 cm = 14 km. How far does 5 cm represent?", "1 cm = 7 km", ["35 km", "70 km", "21 km", "28 km"], "35 km", "First find the value of one centimetre.", "Five times seven equals 35 kilometres."],
          ["A route is 48 km. The scale is 1 cm = 8 km. How long is it on the map?", "48 ÷ 8 = ?", ["6 cm", "8 cm", "40 cm", "7 cm"], "6 cm", "Divide the real distance by eight.", "The route is six centimetres on the map."],
          ["The scale is 1 cm = 7 km. A ridge path is 8 cm. How long is it?", "8 × 7 = ?", ["56 km", "15 km", "49 km", "64 km"], "56 km", "Multiply the map length by seven.", "Eight times seven equals 56 kilometres."],
          ["A 45 km trail appears as 5 cm on the map. What is the scale?", "45 ÷ 5 = ?", ["1 cm = 9 km", "1 cm = 8 km", "1 cm = 40 km", "1 cm = 10 km"], "1 cm = 9 km", "Divide real distance by map distance.", "Each centimetre represents nine kilometres."]
        ])),
      challenge("twin-thermal-core", "Balance the Twin Thermal Core", "Logic · advanced temperature balancing", "balance",
        "The twin core responds to larger heat changes.", "Reach the final safe temperature.",
        "The Guardian Gate has started to open.",
        balanceVariants([[-8, 7, "Warm by fifteen degrees."], [11, -4, "Cool by fifteen degrees."], [-5, 9, "Cross zero and reach nine."], [8, -7, "Cool by fifteen degrees."], [-10, 5, "Warm by fifteen degrees."], [-9, 6, "Warm by fifteen degrees to cross zero."], [13, -2, "Cool by fifteen degrees."]], [
          { label: "Heat 2°", amount: 2 }, { label: "Heat 5°", amount: 5 }, { label: "Cool 2°", amount: -2 }, { label: "Cool 5°", amount: -5 }
        ], "°C")),
      challenge("guardian-gate", "Open the Guardian Gate", "Mathematics · final mixed reasoning", "choice",
        "The gate combines ratios, temperature, and route distance.", "Solve the final summit calculation.",
        "The guardian route to the Unwritten Isle is open.",
        mathVariants([
          ["Three heaters use 240 units each. Cooling removes 185 units. What remains?", "3 × 240 − 185 = ?", ["535", "720", "555", "425"], 535, "Multiply before subtracting.", "Three heaters use 720 units; 720 minus 185 is 535."],
          ["A 42 km route is split in the ratio 4:3. How long is the larger part?", "42 ÷ 7 × 4 = ?", ["24 km", "18 km", "28 km", "30 km"], "24 km", "There are seven equal ratio parts.", "Each part is six kilometres; four parts are 24."],
          ["The core warms from −12°C to 6°C, then cools 5°C. What is the final temperature?", "−12 + 18 − 5 = ?", ["1°C", "11°C", "−1°C", "23°C"], "1°C", "Find the temperature after warming first.", "The core reaches 6°C, then cools to 1°C."],
          ["A map scale is 1 cm = 6 km. Two paths measure 4 cm and 3 cm. What is their total distance?", "(4 + 3) × 6 = ?", ["42 km", "24 km", "18 km", "36 km"], "42 km", "Add map lengths before converting.", "Seven centimetres represent 42 kilometres."],
          ["Five supply packs hold 18 items each. The guardian adds 35. What is the total?", "5 × 18 + 35 = ?", ["125", "90", "115", "135"], 125, "Multiply before adding.", "Five packs hold 90 items; plus 35 equals 125."],
          ["Four summit heaters use 175 units each, and the beacon uses 90 more. What is the total?", "4 × 175 + 90 = ?", ["790", "700", "610", "890"], 790, "Multiply before adding the beacon energy.", "Four heaters use 700 units; adding 90 gives 790."],
          ["A 63 km route is split in the ratio 5:4. How long is the larger part?", "63 ÷ 9 × 5 = ?", ["35 km", "28 km", "40 km", "45 km"], "35 km", "There are nine equal ratio parts.", "Each part is seven kilometres; five parts are 35."]
        ]))
    ]
  });

  const unwrittenIsle = finish({
    title: "The Unwritten Isle",
    subtitle: "The lost heart of the Atlas",
    fragment: "✦",
    intro: "Six fragments reveal an island that appears only when someone chooses to complete its unfinished story.",
    opening: "Mira waits beside the stone guardian at a shifting island made from pieces of every place visited before.",
    startMessage: "Combine every learned mechanic, restore the Atlas Heart, and finish Mira's story.",
    completionMessage: "The Atlas is whole. Every island now remembers its place, and new blank routes wait for future adventures.",
    ending: "Mira explains that the guardian protected unfinished islands from being erased. Together, the explorers restore the Atlas Heart and return every lost route to the sky.",
    next: null,
    nextTitle: null,
    spots: [
      { label: "Mira's message", icon: "🧭", x: 9, y: 70, labelX: 10, labelY: 83 },
      { label: "Fragment sum", icon: "🔢", x: 21, y: 56, labelX: 21, labelY: 68 },
      { label: "Combined route", icon: "🛤️", x: 34, y: 69, labelX: 34, labelY: 82 },
      { label: "Atlas ratio", icon: "⚖️", x: 47, y: 55, labelX: 47, labelY: 67 },
      { label: "Guardian memory", icon: "🗿", x: 60, y: 69, labelX: 60, labelY: 82 },
      { label: "Map fractions", icon: "🗺️", x: 72, y: 55, labelX: 72, labelY: 67 },
      { label: "Final sentence", icon: "✍️", x: 88, y: 67, labelX: 87, labelY: 80 },
      { label: "Heart chamber", icon: "💛", x: 79, y: 38, labelX: 79, labelY: 50 },
      { label: "Atlas convergence", icon: "🌐", x: 54, y: 33, labelX: 54, labelY: 45 },
      { label: "Atlas Heart", icon: "💎", x: 28, y: 36, labelX: 28, labelY: 48 }
    ],
    challenges: [
      challenge("mira-message", "Understand Mira's final message", "English · theme and inference", "choice",
        "Mira explains why the islands vanished from ordinary maps.", "Identify the central theme.",
        "Mira gives Spark the numbers engraved on all six fragments.",
        choiceVariants([
          ["An island disappears when nobody remembers its story. It returns when explorers learn from it and share what they discovered.", "What is the central theme?", ["Learning and memory keep stories alive", "Maps should remain secret", "Only machines can save islands", "Exploration is too dangerous"], "Learning and memory keep stories alive", "Both learning and sharing restore the island."],
          ["The guardian was built to protect unfinished places, but it could not write their endings alone.", "Why did it follow Mira?", ["It needed help completing the Atlas", "It wanted her storm ship", "It caused the silver storm", "It was guarding Frostfire Summit"], "It needed help completing the Atlas", "The guardian could protect but not finish the story."],
          ["Mira repaired machines on every island because each machine held part of the route to the Atlas Heart.", "Why were the repairs important?", ["They revealed the complete route", "They made the islands larger", "They stopped all weather", "They created the guardian"], "They revealed the complete route", "Each machine held one part of the route."],
          ["Spark says, “A map is not only a picture of places. It is a record of choices.”", "What does Spark mean?", ["Journeys are shaped by decisions", "Maps should contain more colours", "Every route has the same ending", "Pictures are more important than words"], "Journeys are shaped by decisions", "Choices determine the journey recorded by the map."],
          ["Mira leaves one page blank after the Atlas is restored.", "Why might she leave it blank?", ["For a future adventure", "Because the ink is missing", "To erase the guardian", "Because the story failed"], "For a future adventure", "A blank page can hold a new story."],
          ["The guardian saved each unfinished route until an explorer was ready to learn from it and complete it.", "What idea does this support?", ["Patience and learning can restore what is unfinished", "Every route should stay hidden", "Only guardians can explore", "Unfinished work has no value"], "Patience and learning can restore what is unfinished", "The routes return when explorers are ready to learn and finish them."],
          ["Mira could not restore the Atlas alone, and the guardian could not complete its stories alone. Together, they succeeded.", "What is the central theme?", ["Cooperation helps solve difficult problems", "Machines should work alone", "Maps are more useful than friends", "Every problem has one hero"], "Cooperation helps solve difficult problems", "Mira and the guardian succeed by combining their strengths."]
        ])),
      challenge("fragment-sum", "Combine the six fragments", "Mathematics · mixed operations", "choice",
        "Each fragment contributes a different amount of Atlas energy.", "Calculate the combined energy.",
        "The fragments reveal a route crossing all four previous environments.",
        mathVariants([
          ["Four fragments hold 275 units each, and two hold 450 each. What is the total?", "4 × 275 + 2 × 450 = ?", ["2,000", "1,550", "2,100", "1,900"], 2000, "Calculate each group, then add.", "1,100 plus 900 equals 2,000."],
          ["Six fragments hold 380 units each. Restoring the map uses 475. What remains?", "6 × 380 − 475 = ?", ["1,805", "2,280", "1,705", "2,755"], 1805, "Multiply before subtracting.", "Six fragments hold 2,280; subtracting 475 leaves 1,805."],
          ["Three fragments hold 625 units and three hold 240. What is the total?", "3 × 625 + 3 × 240 = ?", ["2,595", "1,875", "2,495", "2,715"], 2595, "Find both groups separately.", "1,875 plus 720 equals 2,595."],
          ["The Atlas needs 3,600 units. It has 1,275, 985, and 740. How many more are needed?", "3,600 − 1,275 − 985 − 740 = ?", ["600", "1,340", "700", "500"], 600, "Add the collected energy first.", "The collected total is 3,000, leaving 600."],
          ["Five fragments hold 315 units each. The sixth holds 525. What is the total?", "5 × 315 + 525 = ?", ["2,100", "1,575", "2,000", "2,625"], 2100, "Five groups of 315 come first.", "1,575 plus 525 equals 2,100."],
          ["Two fragments hold 680 units each, and four hold 245 each. What is the total?", "2 × 680 + 4 × 245 = ?", ["2,340", "1,360", "2,240", "2,440"], 2340, "Calculate both groups before adding.", "Two fragments hold 1,360 units and four hold 980; together they hold 2,340."],
          ["The Atlas stores 4,500 units and uses 850 units on each of three routes. How many remain?", "4,500 − 3 × 850 = ?", ["1,950", "2,550", "1,850", "2,050"], 1950, "Find the energy used by three routes first.", "Three routes use 2,550 units, leaving 1,950."]
        ])),
      challenge("combined-route", "Cross the combined route", "Logic · route sequencing", "route",
        "The path changes between cloud, garden, fire, water, and ice terrain.", "Build the complete safe route.",
        "The route reaches the Atlas ratio gate.",
        routeVariants([
          ["east", "north", "east", "south", "west", "north"],
          ["north", "east", "south", "south", "west", "north"],
          ["west", "north", "east", "east", "south", "west"],
          ["south", "east", "north", "west", "north", "east"],
          ["north", "west", "south", "east", "east", "north"],
          ["east", "south", "west", "north", "north", "east"],
          ["west", "south", "east", "north", "west", "north"]
        ])),
      challenge("atlas-ratio", "Set the Atlas ratio", "Mathematics · proportions", "choice",
        "The gate scales energy from the six fragments.", "Solve the proportion.",
        "The ratio gate opens the Guardian Memory.",
        mathVariants([
          ["Three fragments power 12 map lines. How many lines can 8 fragments power at the same rate?", "3:12 = 8:?", ["32", "24", "20", "36"], 32, "Each fragment powers four lines.", "Eight times four equals 32."],
          ["Five crystals restore 15 symbols. How many symbols do 12 crystals restore?", "5:15 = 12:?", ["36", "32", "27", "40"], 36, "Each crystal restores three symbols.", "Twelve times three equals 36."],
          ["Four pages need 10 energy cells. How many cells do 14 pages need?", "4:10 = 14:?", ["35", "28", "24", "40"], 35, "The unit rate is 2.5 cells per page.", "Fourteen times 2.5 equals 35."],
          ["Six routes use 18 markers. How many markers do 15 routes use?", "6:18 = 15:?", ["45", "33", "36", "54"], 45, "Each route uses three markers.", "Fifteen times three equals 45."],
          ["Eight gears turn 20 rings. How many rings do 18 gears turn?", "8:20 = 18:?", ["45", "40", "38", "50"], 45, "Simplify the ratio to 2:5.", "Eighteen gears correspond to 45 rings."],
          ["Seven fragments illuminate 21 route marks. How many marks do 15 fragments illuminate?", "7:21 = 15:?", ["45", "35", "42", "50"], 45, "Each fragment illuminates three marks.", "Fifteen times three equals 45."],
          ["Nine Atlas pages need 24 ink crystals. How many crystals do 15 pages need?", "9:24 = 15:?", ["40", "36", "45", "30"], 40, "Simplify the ratio to 3:8.", "Fifteen pages are five groups of three, so they need five groups of eight crystals, or 40."]
        ])),
      challenge("guardian-memory", "Read the Guardian Memory", "English · comparing perspectives", "choice",
        "The same journey is recorded from Mira's and the guardian's perspectives.", "Compare what each character understood.",
        "The memory reveals how the map fractions fit together.",
        choiceVariants([
          ["Mira thought the guardian was chasing her. The guardian's memory shows it repairing routes so she could continue.", "How did their perspectives differ?", ["Mira felt threatened; the guardian intended to help", "Both wanted to stop the journey", "The guardian feared Mira", "Mira knew its plan immediately"], "Mira felt threatened; the guardian intended to help", "Their interpretations of the same actions were different."],
          ["Mira saw a blank island. The guardian saw a protected unfinished island.", "What caused the difference?", ["They understood the Atlas differently", "They stood on different mountains", "One of them could not see", "The island changed colour"], "They understood the Atlas differently", "Their knowledge changed what the island meant."],
          ["Spark called the fragments keys. Mira called them memories.", "What do both descriptions suggest?", ["The fragments unlock and preserve the Atlas", "The fragments are ordinary metal", "The fragments should be hidden forever", "The fragments control the weather"], "The fragments unlock and preserve the Atlas", "Keys unlock; memories preserve."],
          ["The guardian protected blank pages. Mira wanted to write on them.", "How can both goals work together?", ["Protect pages until their stories are ready", "Destroy every blank page", "Never allow new stories", "Write without exploring"], "Protect pages until their stories are ready", "Protection and completion can be parts of one purpose."],
          ["Mira believed finishing the Atlas meant filling every page. Spark believed one page should remain open.", "What compromise fits both views?", ["Complete the lost islands and keep space for new ones", "Erase all completed pages", "Close the Atlas permanently", "Leave every page blank"], "Complete the lost islands and keep space for new ones", "This preserves completion and future possibility."],
          ["Mira called the last route a destination. The guardian called it a beginning.", "How can both perspectives be true?", ["Finishing one journey can start another", "The route leads nowhere", "Only Mira understands the map", "The guardian wants to erase the route"], "Finishing one journey can start another", "The same place can end this journey and begin a new one."],
          ["Spark remembered the machines they repaired. Mira remembered the clues each machine revealed.", "What do their perspectives share?", ["Both value what the journey taught them", "Both want to forget the islands", "Both noticed only the weather", "Both think the repairs were useless"], "Both value what the journey taught them", "Machines and clues are different parts of the learning journey."]
        ])),
      challenge("map-fractions", "Assemble the map fractions", "Mathematics · fraction multiplication", "choice",
        "The six map pieces scale to fit the Atlas Heart.", "Multiply fractions by whole numbers.",
        "The assembled map reveals the final sentence seal.",
        mathVariants([
          ["What is 3 × 2/5?", "3 × 2/5 = ?", ["6/5", "6/15", "5/6", "3/5"], "6/5", "Multiply the numerator by three.", "Three groups of two fifths equal six fifths."],
          ["What is 4 × 3/8?", "4 × 3/8 = ?", ["12/8", "12/32", "7/8", "3/2"], "12/8", "Multiply three eighths four times.", "Four groups of three eighths equal twelve eighths."],
          ["What is 5 × 1/6?", "5 × 1/6 = ?", ["5/6", "5/30", "6/5", "1/30"], "5/6", "Five groups of one sixth.", "The result is five sixths."],
          ["What is 2 × 5/7?", "2 × 5/7 = ?", ["10/7", "10/14", "7/10", "5/9"], "10/7", "Double the numerator.", "Two groups of five sevenths equal ten sevenths."],
          ["What is 6 × 3/10?", "6 × 3/10 = ?", ["18/10", "18/60", "9/10", "3/16"], "18/10", "Multiply three by six.", "Six groups of three tenths equal eighteen tenths."],
          ["What is 7 × 2/9?", "7 × 2/9 = ?", ["14/9", "14/63", "9/14", "7/9"], "14/9", "Multiply the numerator by seven.", "Seven groups of two ninths equal fourteen ninths."],
          ["What is 3 × 4/11?", "3 × 4/11 = ?", ["12/11", "12/33", "7/11", "4/14"], "12/11", "Multiply four by three.", "Three groups of four elevenths equal twelve elevenths."]
        ])),
      challenge("final-sentence", "Complete the Atlas promise", "English · sentence construction", "order",
        "Mira, Spark, and the guardian each contribute words to one final promise.", "Arrange the promise correctly.",
        "The promise opens the Heart Chamber.",
        orderVariants([
          "We remember every island by sharing its story.",
          "New journeys begin when explorers choose to learn.",
          "The Atlas protects stories and leaves room for more.",
          "Mira and the guardian restored the lost routes together.",
          "Every finished chapter can guide a future explorer.",
          "We complete old routes while leaving space for new journeys.",
          "Mira and Spark share the Atlas with every future explorer."
        ])),
      challenge("heart-balance", "Balance the Heart Chamber", "Logic · combined energy balancing", "balance",
        "The chamber combines tide pressure and thermal energy.", "Reach the exact Atlas Heart level.",
        "The island fragments begin to converge.",
        balanceVariants([[-6, 10, "Raise the level by sixteen."], [14, -2, "Lower the level by sixteen."], [-9, 7, "Cross zero to reach seven."], [12, -4, "Lower by sixteen."], [-3, 13, "Raise by sixteen."], [-8, 8, "Raise the level by sixteen to cross zero."], [15, -1, "Lower the level by sixteen."]], [
          { label: "Add 2", amount: 2 }, { label: "Add 6", amount: 6 }, { label: "Remove 2", amount: -2 }, { label: "Remove 6", amount: -6 }
        ], "energy")),
      challenge("atlas-convergence", "Synchronize the Atlas convergence", "Logic · combined rune sequencing", "sequence",
        "Runes from every island form one final circuit.", "Enter the six-symbol convergence.",
        "The Atlas Heart is exposed.",
        sequenceVariants([
          ["cloud → leaf → flame → wave → ice → star", ["cloud", "leaf", "flame", "wave", "ice", "star"], "Follow the islands in journey order."],
          ["star → ice → wave → flame → leaf → cloud", ["star", "ice", "wave", "flame", "leaf", "cloud"], "This sequence reverses the journey."],
          ["cloud → flame → leaf → ice → wave → star", ["cloud", "flame", "leaf", "ice", "wave", "star"], "Alternate the early island symbols."],
          ["leaf → cloud → wave → flame → star → ice", ["leaf", "cloud", "wave", "flame", "star", "ice"], "Begin with the garden and finish with ice."],
          ["flame → wave → ice → cloud → leaf → star", ["flame", "wave", "ice", "cloud", "leaf", "star"], "The star is always the final symbol."],
          ["ice → flame → cloud → wave → leaf → star", ["ice", "flame", "cloud", "wave", "leaf", "star"], "Begin with ice and finish with the Atlas star."],
          ["wave → leaf → cloud → ice → flame → star", ["wave", "leaf", "cloud", "ice", "flame", "star"], "The wave begins the sequence, and the star completes it."]
        ])),
      challenge("atlas-heart", "Restore the Atlas Heart", "Mathematics · final synthesis", "choice",
        "One final problem combines the energy of all six islands.", "Solve the Atlas Heart calculation.",
        "The Lost Islands are restored.",
        mathVariants([
          ["Six islands contribute 480 units each. The Heart uses 875 units to restore routes. How many remain?", "6 × 480 − 875 = ?", ["2,005", "2,880", "1,905", "3,755"], 2005, "Multiply before subtracting.", "Six islands give 2,880 units; 2,880 minus 875 equals 2,005."],
          ["Four routes hold 625 units and two hold 350. The Heart adds 300. What is the total?", "4 × 625 + 2 × 350 + 300 = ?", ["3,500", "3,200", "3,800", "2,900"], 3500, "Calculate both route groups first.", "2,500 plus 700 plus 300 equals 3,500."],
          ["The Heart needs 5,000 units. It receives 1,275, 1,450, 980, and 695. How many more are needed?", "5,000 − 1,275 − 1,450 − 980 − 695 = ?", ["600", "4,400", "700", "500"], 600, "Add all received energy.", "The received total is 4,400, leaving 600."],
          ["Eight rings hold 315 units each. Three fragments add 460 each. What is the total?", "8 × 315 + 3 × 460 = ?", ["3,900", "2,520", "4,000", "3,780"], 3900, "Find both products, then add.", "2,520 plus 1,380 equals 3,900."],
          ["The restored Atlas has 6 sections with 540 symbols each. It reserves 240 symbols for future islands. How many are already written?", "6 × 540 − 240 = ?", ["3,000", "3,240", "2,900", "3,480"], 3000, "Multiply before subtracting the reserved symbols.", "3,240 minus 240 equals 3,000."],
          ["Seven Atlas rings hold 425 units each, and the guardian adds 525. What is the total?", "7 × 425 + 525 = ?", ["3,500", "2,975", "3,400", "4,025"], 3500, "Multiply before adding the guardian's energy.", "Seven rings hold 2,975 units; adding 525 gives 3,500."],
          ["The Heart stores 6,200 units and spends 950 units on each of four restored routes. How many remain?", "6,200 − 4 × 950 = ?", ["2,400", "3,800", "2,300", "2,500"], 2400, "Find the energy spent on four routes first.", "Four routes use 3,800 units, leaving 2,400."]
        ]))
    ]
  });

  window.ATLAS_CHAPTERS = {
    3: emberArchive,
    4: tidalObservatory,
    5: frostfireSummit,
    6: unwrittenIsle
  };
})();

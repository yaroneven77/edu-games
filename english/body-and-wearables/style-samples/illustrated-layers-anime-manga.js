window.IllustratedLayers = window.IllustratedLayers || {};

(() => {
  const faceTransform = 'translate(44.25 34.05) scale(.85)';
  const path = (d, fill, stroke, width = 1.2) =>
    `<path d="${d}" fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="${width}"` : ''}/>`;
  const group = (svg, ink, transform = '') =>
    `<g stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${transform ? ` transform="${transform}"` : ''}>${svg}</g>`;
  const shape = (d, c) => path(d, c.skin, c.ink, 1.7);
  const line = (d, c) => path(d, 'none', c.detail, 1.1);
  const layer = (id, order, svg) => ({ id, order, svg });

  // Body silhouettes are independently drawn anatomy, not crops of dressed characters.
  // Clothing and hair retain source paths; mixed skin/garment groups are split below.
  function anatomy(c) {
    const p = c.pose;
    const body = (id, order, d, detail = '') =>
      layer(id, order, group(shape(d, c) + (detail ? line(detail, c) : ''), c.ink));
    const face = (id, order, svg) => layer(id, order, group(svg, c.ink, faceTransform));
    return [
      body('legs', 10, p.legs, p.legLines),
      body('thighs', 11, p.thighs),
      body('knees', 12, p.knees, p.kneeLines),
      body('ankles', 13, p.ankles),
      body('feet', 14, p.feet, p.footLines),
      body('heels', 15, p.heels),
      body('chest', 20, 'M260 259Q276 250 292 253Q310 249 329 262L338 295Q336 321 325 349Q291 360 259 348Q249 326 247 298Z',
        'M269 269Q280 273 288 269M299 269Q310 272 319 268'),
      body('waist', 21, 'M261 348Q291 356 324 348Q324 375 334 405L329 428Q293 438 251 426L249 404Q261 374 261 348Z',
        'M262 405Q293 414 322 404'),
      body('shoulders', 23, p.shoulders),
      body('arms', 22, p.arms, p.armLines),
      body('elbows', 24, p.elbows, p.elbowLines),
      body('wrists', 25, p.wrists),
      body('hands', 86, p.hands),
      layer('palms', 87, group(path(p.palms, c.skin, 'none') + line(p.palmLines, c), c.ink)),
      body('fingers', 88, p.fingers, p.fingerLines),
      body('neck', 26, p.neck, 'M282 237Q293 244 305 236'),
      face('head', 30, shape(c.head, c) + path(c.headShade, c.shade, 'none')),
      face('forehead', 31, path('M266 146Q291 133 321 144L323 168Q293 175 265 169Z', c.skin, 'none') +
        path('M274 145Q293 140 312 145', 'none', c.detail, .6)),
      face('cheeks', 32,
        path('M259 192Q267 186 278 194L284 204Q273 212 263 203ZM312 192Q320 185 329 189L330 200Q321 208 310 203Z', c.skin, 'none') +
        line('M265 200L267 203M270 199L272 202M319 197L320 200M324 196L325 199', c)),
      face('jaw', 33,
        path('M254 188Q258 205 275 216L285 224 280 224Q261 216 254 201ZM332 185Q332 200 317 215L306 225Q322 217 331 204L337 189Z', c.skin, 'none') +
        path('M257 202Q265 214 280 222M309 222Q324 212 331 200', 'none', c.detail, .7)),
      face('chin', 34,
        path('M284 218Q296 223 310 217L308 224Q298 231 287 225Z', c.skin, 'none') +
        path('M290 225Q299 228 306 223', 'none', c.detail, .7)),
      face('ears', 35, shape(c.ears, c) + line(c.earLines, c)),
      face('eyes', 40, c.eyes),
      face('nose', 41, line(c.nose, c)),
      face('mouth', 42, path(c.mouth, c.mouthFill, c.detail, 1)),
      face('lips', 43, path(c.lips, 'none', c.lipColor, 1.7)),
      face('hair', 90, c.hair)
    ];
  }

  const kite = {
    ink: '#233b43', skin: '#f6d2ae', shade: '#e9b38e', detail: '#bc866e',
    mouthFill: '#a45c59', lipColor: '#975a5e',
    head: 'M252 145Q244 108 272 98Q312 83 333 116L336 191Q329 213 299 227Q287 231 270 217Q252 204 251 187Z',
    headShade: 'M252 157L263 170 261 197 278 218Q255 204 252 187ZM328 156L334 165 336 191Q329 212 299 227L309 213 323 201Z',
    ears: 'M254 169Q241 156 237 169Q233 184 252 192ZM333 171Q347 156 349 168Q354 182 335 192Z',
    earLines: 'M246 172L252 183M340 175L335 184',
    nose: 'M295 183L292 197 296 198',
    mouth: 'M282 207Q294 215 306 204Q297 219 282 207Z',
    lips: 'M282 207Q294 215 306 204M290 216L298 215',
    eyes: `<path d="m264 171 12-4 10 3m19-1 10-5 12 2" fill="none" stroke="#28616b" stroke-width="2.2"/>
      <path d="M263 181q10-12 23 0l-2 11q-9 6-18-1ZM306 178q11-12 22-1l-1 12q-9 7-18 1Z" fill="#fff9ec"/>
      <path d="M271 177q10-2 10 8t-9 9q-6-4-1-17ZM313 174q10-1 10 9t-9 9q-6-5-1-18Z" fill="url(#iris)" stroke-width="1.2"/>
      <path d="M275 180v8m42-10v8" fill="none" stroke="#153747" stroke-width="3"/>
      <path d="m263 181-3-3m3 3q11-12 23 0m20-3q11-12 22-1l3-4" fill="none" stroke="#273c47" stroke-width="3"/>
      <path d="m266 195 15 1m29-2 14-2" fill="none" stroke="#b38173" stroke-width="1"/>
      <ellipse cx="274" cy="180" rx="2.8" ry="3.7" fill="#fff" stroke="none"/><ellipse cx="316" cy="177" rx="2.8" ry="3.7" fill="#fff" stroke="none"/>
      <path d="m278 190 1-1m42-2 1-1" stroke="#fff" stroke-width="2.4"/>`,
    hair: `<path d="M245 165q-14-8-13-25l-10 6 14-26-12-2q17-4 24-18l-4-13 26 5q19-23 44-17l-8 9q25-8 43 5l-6 8 19 10-9 5q18 18 13 37l-10-6 1 23-13 17-8-23-8-20-11 27-13-21-7 27-17-23-8 26-11-12-2 28-10-17Z" fill="url(#hair)"/>
      <path d="m270 92 28-10-12 16-28 20-18 18q3-30 30-44Z" fill="#79d7c2" stroke="none"/>
      <path d="M296 99q25-15 45 3l-15-1 18 22-27-12-12 24Z" fill="#5fc6b5" stroke="none"/>
      <path d="m262 122 11-12-3 29-9 22-2-18-10 27 2-32Z" fill="#164b5a" stroke="none"/>
      <path d="m286 112 5 17 6 23-13-9-4 20-6-13Z" fill="#1b6371" stroke="none"/>
      <path d="m316 116 2 20 12 20-2-18 12 19 4 20 10-14-10-36Z" fill="#194858" stroke="none"/>
      <path d="M249 126q8-20 27-26m-22 27 18-21m-31 33 8-9m36-30 17-10m-20 17-5 17m20-19 6 15m5-22q21 0 34 18m-26-10 17 15m-22 2-6 22m34-20 9 17m-9-4 4 15" fill="none" stroke="#a1eed6" stroke-width="1.5"/>
      <path d="m250 151 9-22m14 17 5-22m17 10-4-21m20 38 7-21m25 19-10-22m-88 17-4 10" fill="none" stroke="#173f51" stroke-width="1.3"/>
      <path d="M265 90q1-16 17-19m2 16q15-21 28-12" fill="none" stroke="#287c81" stroke-width="2"/>`,
    pose: {
      neck: 'M274 211L271 235 288 255 316 238 309 209Z',
      shoulders: 'M247 239Q227 233 213 251Q207 263 219 271L240 265 258 253ZM321 241Q339 232 354 246Q368 258 360 271L341 268 322 256Z',
      arms: 'M214 259Q225 252 232 267L211 307Q193 339 176 343Q159 344 151 323L138 288 163 277 177 315 190 286Z M351 254Q367 250 375 267L391 320Q397 340 387 361L363 408 340 400 367 347 357 317 344 277Z',
      armLines: 'M199 296L191 316M155 301L165 322M377 299L382 322M371 365L354 397',
      elbows: 'M165 320Q176 313 189 323L192 332Q176 346 167 335ZM371 325Q385 320 390 334L387 348Q376 356 369 344Z',
      elbowLines: 'M171 327Q179 331 184 326M376 335L383 338',
      wrists: 'M139 274L161 264 170 283 146 294ZM343 401L363 411 356 429 336 419Z',
      hands: 'M142 248Q155 241 173 249L179 260 167 282 143 275 137 262ZM338 416L357 425 360 438 353 448 333 442 330 431Z',
      palms: 'M146 253Q157 246 169 253L172 263 164 275 149 272 143 263ZM340 425L352 430 355 439 347 445 336 438Z',
      palmLines: 'M149 259L157 255 165 258M152 267L159 263M339 431L347 435',
      fingers: 'M138 254L124 247Q119 237 125 234Q130 232 135 243L143 254Z M142 251L135 221Q134 213 140 212Q146 211 147 220L152 248Z M153 248L154 209Q155 201 161 202Q167 203 166 212L165 248Z M165 250L172 219Q174 212 180 215Q186 218 183 225L176 255Z M176 256L184 242Q189 236 193 240Q197 244 191 252L180 267Z M334 431L329 445Q327 451 323 447L324 439 330 425Z M332 439L332 455Q333 461 338 459L341 441Z M342 442L340 462Q343 467 347 462L350 442Z M351 441L349 459Q353 463 356 457L360 435Z',
      fingerLines: 'M127 240L130 246M140 219L141 226M159 209V216M177 222L175 228M336 448L336 454M345 451L344 457',
      legs: 'M241 423Q261 414 279 430L283 477 255 548Q249 574 246 606L240 674 214 675 216 609 222 552 227 494Q224 451 241 423Z M298 424Q322 412 342 431L350 484Q344 516 337 542L341 599 342 680 316 681 306 609 303 551 292 483Z',
      legLines: 'M242 476Q239 516 234 536M231 571L226 636M326 477L319 527M320 565L327 641',
      thighs: 'M241 424Q263 413 280 431L283 479 265 518Q248 531 230 516L227 482Q227 444 241 424Z M299 424Q324 414 341 431L348 478 339 515Q323 527 307 514L295 479Z',
      knees: 'M222 535Q236 526 250 538L252 553Q242 568 225 559L218 548ZM309 531Q324 522 339 533L340 549Q329 562 313 553L306 542Z',
      kneeLines: 'M227 543Q236 539 244 545M315 538Q324 534 333 540',
      ankles: 'M216 659Q228 653 240 661L240 688 214 690ZM316 664Q329 659 341 667L345 692 316 694Z',
      feet: 'M216 681Q228 676 239 684L243 706Q234 719 211 720L179 720Q170 716 176 707L199 696Z M317 685Q329 679 341 685L356 700 386 708Q398 715 392 722L370 729 321 720 313 708Z',
      footLines: 'M181 710L185 716M188 707L192 713M197 704L201 710M382 712L380 719M373 709L371 716',
      heels: 'M228 697Q240 693 243 705L240 717 226 718Q221 707 228 697Z M316 699Q326 695 331 706L329 720 317 720Q309 709 316 699Z'
    }
  };

  const ember = {
    ink: '#49373f', skin: '#f6d0ac', shade: '#e9b391', detail: '#bc816b',
    mouthFill: '#b87870', lipColor: '#975a5e',
    head: 'M258 145Q249 105 280 97Q315 89 332 118L338 182Q335 208 307 225Q297 233 282 224Q257 211 253 188Z',
    headShade: 'M258 155L267 162 261 190 274 214Q255 201 253 188ZM330 151L338 182Q335 208 307 225L298 229 314 210 325 185Z',
    ears: 'M261 174Q248 162 244 175Q240 188 259 196ZM330 171Q344 156 349 168Q354 180 337 191Z',
    earLines: 'M251 178L257 188M340 173L334 183',
    nose: 'M296 183L293 197 298 199',
    mouth: 'M286 210Q298 217 309 207Q301 219 290 214Z',
    lips: 'M286 210Q298 217 309 207M293 216L300 215',
    eyes: `<path d="m266 172 11-5 10 2m18-1 10-4 11 2" fill="none" stroke="#934b3c" stroke-width="2.1"/>
      <path d="m264 182q10-13 23-2l-2 11q-10 8-19-1Zm43-3q10-13 22-2l-2 12q-10 7-18-1Z" fill="#fffaf0"/>
      <path d="M272 177q11-3 10 8t-9 9q-6-6-1-17ZM314 174q11-2 10 9t-9 9q-6-6-1-18Z" fill="url(#eyes)" stroke-width="1.1"/>
      <path d="m277 181-1 7m43-10-1 7" stroke="#51343a" stroke-width="3"/>
      <path d="m262 179 2 3q10-13 23-2m19-1q11-13 23-2l3-5m-5 3 2-5" fill="none" stroke="#43313c" stroke-width="2.7"/>
      <ellipse cx="275" cy="180" rx="2.8" ry="3.8" fill="#fff" stroke="none"/><ellipse cx="317" cy="177" rx="2.8" ry="3.8" fill="#fff" stroke="none"/>
      <path d="m279 190 1-1m41-2 1-1" stroke="#fff5cf" stroke-width="2"/>`,
    hair: `<path d="M345 185Q361 204 352 229L348 241 340 235Q346 215 338 207Z" fill="url(#copper)"/>
      <path d="M351 198Q358 214 348 236L344 233Q350 213 345 205Z" fill="#783946" stroke="none"/>
      <path d="M349 201Q354 214 347 229M349 226L345 235" fill="none" stroke="#edaa74" stroke-width="1.5"/>
      <path d="M248 173q-16-22-6-47l-11 3q10-17 25-24l-3-12 21 4q14-24 37-12l21-8-5 15q26 8 32 28l-10-4q12 26 1 48l-10 18-9-25-4-24q-9 21-24 31l-2-21-15 24-8-24-15 20-1-23-7 31Z" fill="url(#copper)"/>
      <path d="m273 105 26-14-8 18-21 24-14 17q1-30 17-45Z" fill="#efac70" stroke="none"/>
      <path d="m307 98 17 6 19 29-21-13-12 24 1-22-15 23Z" fill="#de8855" stroke="none"/>
      <path d="m255 126-4 32 4 13 8-31-1 23 15-20-8-19-7 10 1-16Z" fill="#8b443d" stroke="none"/>
      <path d="m290 119-3 22-1 27-8-24 4-14Z" fill="#a14e3e" stroke="none"/>
      <path d="m326 128 1 5 4 24 9 25 10-18-11-16-1-15Z" fill="#793b3f" stroke="none"/>
      <path d="M255 126q8-14 23-23m-17 29 9-13m20-14 10-10m-16 25 9-12m14-6 12 7m-16 6-6 18m22-24 17 17m-21-12 6 10m20 10 4 18" fill="none" stroke="#ffcf92" stroke-width="1.5"/>
      <path d="m265 137 2-12m14 18 6-16m19 21 4-15m24 21-6-16m-84 16 1-17" fill="none" stroke="#6a343c" stroke-width="1.1"/>
      <path d="M285 93q-3-20 12-25m1 23q6-15 20-17" fill="none" stroke="#a7553f" stroke-width="2"/>
      <path d="M252 161q-8 22 2 42m93-43q7 24-7 40" fill="none" stroke="#a55341" stroke-width="2"/>`,
    pose: {
      neck: 'M280 211L277 236 293 260 320 234 312 207Z',
      shoulders: 'M250 247Q230 246 225 259L222 270Q233 278 244 268L260 254ZM325 247Q344 245 354 254L360 267Q352 277 343 269L322 256Z',
      arms: 'M225 259Q237 252 246 269L230 315 205 379 185 370 204 303Z M342 254Q353 247 362 263L377 306 417 322 411 344 361 328Q351 318 344 301L330 272Z',
      armLines: 'M224 287L215 311M212 341L199 368M354 275L366 303M381 325L405 334',
      elbows: 'M206 309Q217 305 229 317L224 331Q213 336 202 325ZM358 304Q370 300 378 313L377 326Q365 334 356 319Z',
      elbowLines: 'M210 318L222 324M362 313L371 319',
      wrists: 'M184 370L205 379 201 401 178 391ZM410 319L428 324 423 342 404 338Z',
      hands: 'M180 389L200 397 202 410 193 423 181 426 175 416 175 403Z M423 323L438 316 459 321 470 330 463 345 445 344 420 338Z',
      palms: 'M182 398L195 401 198 408 188 419 180 414Z M432 325Q445 319 457 325L463 333 456 341 439 338 427 334Z',
      palmLines: 'M185 401L183 411 188 414M442 325L450 329 458 329M436 335L445 332',
      fingers: 'M177 410L174 419 179 429Q183 434 187 430L181 419 183 412Z M185 413L184 424Q187 432 192 426L195 418 192 409Z M193 407L190 417Q192 423 197 418L202 408Z M176 407L181 409 184 425Q183 430 179 427L175 417Z M437 321L446 303Q450 297 454 301Q458 305 452 314L447 323Z M456 319L469 315 482 307Q488 304 490 309Q492 314 486 317L471 326Z M466 328L491 320Q498 319 498 324Q498 329 490 331L470 336Z M463 339L487 335Q493 336 492 340Q491 344 484 345L463 346Z',
      fingerLines: 'M179 417L181 421M188 418L188 423M450 305L448 309M483 311L485 310M491 325L494 324M484 341L487 340',
      legs: 'M248 428Q270 419 291 435L293 478 279 551 274 599 272 680 247 685 246 599 249 548 239 480Z M302 430Q324 419 345 436L354 488 344 546 348 595 350 679 325 683 319 600 310 550 297 484Z',
      legLines: 'M261 472L263 516M260 568L259 647M327 475L332 517M329 568L337 644',
      thighs: 'M249 432Q270 419 290 437L291 483 282 519Q264 530 247 516L240 480Z M303 433Q325 420 345 437L352 483 344 519Q326 528 313 515L299 483Z',
      knees: 'M249 535Q263 528 277 538L277 555Q264 567 252 557L246 547ZM319 528Q334 522 346 533L346 550Q333 562 322 550L316 540Z',
      kneeLines: 'M254 543Q263 539 271 545M324 537Q333 532 340 539',
      ankles: 'M248 663Q260 657 272 665L272 693 247 696ZM325 660Q337 655 349 663L353 691 326 693Z',
      feet: 'M248 681Q261 676 272 686L275 708Q267 721 246 723L213 725Q204 722 208 713L231 700Z M326 681Q338 676 349 684L360 703 377 711Q387 718 380 725L363 728 333 719 323 705Z',
      footLines: 'M215 715L219 722M224 710L228 717M232 706L236 713M373 713L370 721M365 709L363 717',
      heels: 'M262 698Q273 695 276 707L273 720 260 721Q255 711 262 698Z M326 697Q337 694 342 705L340 720 327 719Q320 708 326 697Z'
    }
  };

  const sora = {
    ink: '#242424', skin: '#ffffff', shade: '#eeeeee', detail: '#888888',
    mouthFill: '#777777', lipColor: '#444444',
    head: 'M255 144Q247 112 274 104Q311 92 329 120L337 184Q338 203 323 216Q311 228 297 228Q283 228 270 216Q252 201 253 184Z',
    headShade: 'M255 163L259 167 259 188Q260 207 276 218Q254 205 253 184ZM333 168L337 184Q338 201 322 216Q330 200 331 185Z',
    ears: 'M255 173Q244 163 240 173Q236 183 253 194ZM333 169Q347 159 349 170Q351 181 335 191Z',
    earLines: 'M246 176L252 184M341 174L336 184',
    nose: 'M296 195Q292 199 297 200',
    mouth: 'M285 211Q296 221 308 211Q296 225 285 211Z',
    lips: 'M285 211Q296 221 308 211M284 209L282 211M309 209L311 211',
    eyes: `<path d="M268 172Q276 168 284 172M309 172Q317 168 325 172" fill="none" stroke="#777" stroke-width="1.4"/>
      <path d="M267 183Q276 172 285 183Q276 193 267 183ZM308 183Q317 172 326 183Q317 193 308 183Z" fill="#fff" stroke="#999" stroke-width=".8"/>
      <ellipse cx="276" cy="183" rx="4.5" ry="5.2" fill="#666" stroke="none"/><ellipse cx="317" cy="183" rx="4.5" ry="5.2" fill="#666" stroke="none"/>
      <ellipse cx="276" cy="183" rx="2" ry="3.5" fill="#303030" stroke="none"/><ellipse cx="317" cy="183" rx="2" ry="3.5" fill="#303030" stroke="none"/>
      <circle cx="274.5" cy="181" r="1.5" fill="#fff" stroke="none"/><circle cx="315.5" cy="181" r="1.5" fill="#fff" stroke="none"/>
      <path d="M267 183Q276 172 285 183M308 183Q317 172 326 183" fill="none" stroke="#444" stroke-width="1.4"/>`,
    hair: `<path d="M240 154Q244 173 247 190Q249 213 272 229Q246 239 232 215Q243 188 238 165Z M338 154L351 158 361 211Q359 234 331 237L311 222Q337 206 337 184Z" fill="#1c1c1c"/>
      <path d="M242 169q7 33-3 47l16 9-4-40ZM339 173l12 34q4 16-13 19l-12-9Z" fill="#5e5e5e" stroke="none"/>
      <path d="m244 185-2 23m5-14-2 20m7-22-2 28m91-30 7 22m-10-19 7 25m-11-13 4 14" fill="none" stroke="#c4c4c4" stroke-width=".8"/>
      <path d="M241 168Q228 129 254 106Q282 82 315 98Q345 106 350 136L343 177Q332 173 329 160L323 140Q319 156 309 161Q300 157 296 146Q294 160 286 163Q277 157 274 139Q270 152 262 159L258 149Q254 165 251 172Z" fill="#171717"/>
      <path d="M246 143q-1-24 21-33l-11 19-8 34Z" fill="#606060" stroke="none"/>
      <path d="M275 105q15-10 26-2l-13 9-8 21-2-13-7 18Z" fill="#777" stroke="none"/>
      <path d="m306 105 11 5 14 22-13-6-8-14 1 22-9-12Z" fill="#707070" stroke="none"/>
      <path d="m327 111 10 10 6 25-9-15Z" fill="#9e9e9e" stroke="none"/>
      <path d="M247 141q2-19 17-31m-14 32q2-13 10-22m8-9-9 27m14-30-8 26m13-29-7 22m13-23-6 19m9-18-4 16m8-17-3 14" fill="none" stroke="#f3f3f3" stroke-width=".9"/>
      <path d="m298 106 1 18m4-17 3 19m2-17 5 18m0-16 6 16m1-12 6 16m-37-6 4 23m-10-18 8 23m-17-12 4 9" fill="none" stroke="#a5a5a5" stroke-width=".75"/>
      <path d="m329 123 8 26m-4-21 7 29m-5-17 6 21m-28-26 4 10m-4-5 3 8m-57-6-6 18m9-15-4 11" fill="none" stroke="#d7d7d7" stroke-width=".7"/>
      <path d="m242 157 1 20m3-13 2 13m92-14 2 12" fill="none" stroke="#aaa" stroke-width="1"/>
      <path d="M279 99q5-13 17-12m-6 12q14-11 24-5" fill="none" stroke="#222" stroke-width="1.5"/>`,
    pose: {
      neck: 'M273 211L271 235 285 255 314 237 311 210Z',
      shoulders: 'M250 238Q228 234 214 250L211 263Q220 273 235 267L257 252ZM323 240Q341 237 356 253L361 269Q350 278 337 267L319 254Z',
      arms: 'M214 255Q226 252 230 270L209 312Q194 337 177 337Q163 336 157 317L151 283 175 273 183 306 197 277Z M349 254Q364 252 370 270L379 327 374 389 360 419 339 408 354 377 350 326 340 276Z',
      armLines: 'M206 287L198 307M166 294L172 314M366 288L369 320M366 352L363 381',
      elbows: 'M169 314Q181 309 192 318L197 327Q187 340 174 334L167 325ZM356 325Q369 321 377 333L375 348Q363 357 355 345Z',
      elbowLines: 'M174 322L185 326M361 335L370 338',
      wrists: 'M153 271L175 262 182 283 159 293ZM342 407L362 419 354 439 332 427Z',
      hands: 'M150 237Q160 230 177 237L188 247 190 256 176 275 156 272 149 253Z M333 425L354 434 355 448 349 455 330 448 325 438Z',
      palms: 'M156 246Q167 241 179 246L183 255 174 268 161 265 154 255Z M335 434L349 439 351 447 342 451 332 444Z',
      palmLines: 'M160 253L167 257 175 256M164 260L171 263M337 439L344 444',
      fingers: 'M148 241L140 207Q139 200 145 199Q151 198 153 206L160 235Z M164 237L170 200Q172 193 177 194Q183 195 182 202L177 239Z M176 238L183 232Q188 228 192 232L200 243Q204 248 199 252L190 253 184 244Z M159 242L165 237 175 238 183 246Q184 252 179 251L170 245 164 247Z M328 435L324 439 321 456Q321 462 326 460L330 447Z M330 445L328 471Q330 476 334 472L338 448Z M338 447L337 474Q340 480 344 474L346 450Z M347 449L347 470Q350 475 354 469L356 449Z',
      fingerLines: 'M145 205L147 211M176 201L175 207M150 222L153 232M173 219L171 230M337 456L335 466M350 457V463',
      legs: 'M245 427Q264 418 286 431L290 488 278 551 270 603 268 688 244 690 243 606 243 552 235 486Z M303 429Q324 416 343 432L351 489 342 548 341 600 349 687 325 692 315 608 307 551 296 487Z',
      legLines: 'M260 474L262 514M256 576L254 650M324 475L331 513M327 575L337 651',
      thighs: 'M245 428Q265 418 286 433L289 484 282 519Q264 530 244 518L236 485Z M304 430Q324 419 343 434L350 484 344 519Q328 528 309 517L298 482Z',
      knees: 'M244 536Q259 528 275 538L276 556Q264 568 248 558L241 548ZM318 537Q333 527 346 539L346 556Q332 566 320 556L316 546Z',
      kneeLines: 'M250 544Q260 540 269 546M323 544Q333 540 341 546',
      ankles: 'M244 671Q256 665 268 673L269 699 242 701ZM325 671Q337 665 348 672L352 698 326 700Z',
      feet: 'M244 687Q257 681 268 690L273 711Q265 724 244 727L213 727Q205 723 211 715L230 703Z M326 688Q339 681 349 689L360 705 379 715Q386 722 379 727L361 731 333 722 323 707Z',
      footLines: 'M216 717L219 722M224 712L228 719M232 708L237 715M374 717L371 724M366 712L363 720',
      heels: 'M260 703Q271 699 275 711L271 725 258 725Q253 714 260 703Z M326 702Q337 698 343 710L341 725 327 723Q321 713 326 702Z'
    }
  };

  const ren = {
    ink: '#202020', skin: '#ffffff', shade: '#eeeeee', detail: '#777777',
    mouthFill: '#777777', lipColor: '#333333',
    head: 'M259 145Q250 109 280 98Q314 88 332 118L338 186Q332 211 305 228Q293 233 281 224Q255 207 254 187Z',
    headShade: 'M260 156L265 170 262 192 277 218Q255 201 254 187ZM332 160L338 186Q332 211 305 228L323 201Z',
    ears: 'M259 175Q246 165 243 177Q240 189 258 197ZM333 171Q347 158 351 170Q355 182 336 194Z',
    earLines: 'M249 178L255 188M343 176L337 185',
    nose: 'M298 184L294 199 299 200',
    mouth: 'M285 211Q297 218 308 207Q300 219 289 215Z',
    lips: 'M285 211Q297 218 308 207M291 217L299 216',
    eyes: `<path d="m265 173 12-6 12 3m17-3 11-6 12 3" fill="none" stroke="#525252" stroke-width="1.8"/>
      <path d="m265 182q11-12 23-2l-2 11q-11 6-19-2Zm42-4q11-12 22-3l-1 12q-10 7-19-1Z" fill="#fff"/>
      <path d="M273 178q10-2 10 7t-9 9q-7-4-1-16Zm41-4q10-2 10 8t-9 10q-7-5-1-18Z" fill="#606060" stroke-width="1"/>
      <path d="m278 181-1 7m43-10-1 7" stroke="#111" stroke-width="3"/>
      <path d="m265 182-3-3m3 3q11-12 23-2m19-2q11-12 22-3l3-4" fill="none" stroke="#222" stroke-width="2.5"/>
      <path d="m270 195 13 1m29-4 12-1" fill="none" stroke="#777" stroke-width=".9"/>
      <ellipse cx="276" cy="180" rx="2.8" ry="3.4" fill="#fff" stroke="none"/><ellipse cx="317" cy="176" rx="2.8" ry="3.4" fill="#fff" stroke="none"/>
      <path d="m278 191 2-1m39-2 2-1" stroke="#eee" stroke-width="1.8"/>`,
    hair: `<path d="M250 179q-11-11-13-29l-12 5 16-22-12-3 26-16-6-10 22-5q8-22 33-21l-4 8 29-8-5 12q25-4 36 13l-11 1q15 15 35 12l-13 12q19 18 45 10-15 30-47 24 18 25 48 29-43 14-71-14l-6 27-10-22-7-38-13 28-11-21-9 26-13-24-12 31-6-19Z" fill="#f7f7f7"/>
      <path d="m267 104 23-16-13 22-21 20-14 19q0-26 25-45Z" fill="#d6d6d6" stroke="none"/>
      <path d="m290 119 6 19 13 21-11-21-9 26-13-24 6-16 1 21Z" fill="#a5a5a5" stroke="none"/>
      <path d="m319 116 15 17 13 31 24 15 30 10-31-19-17-23 16 15q32 6 47-24l-22 8-31-3-21-23Z" fill="url(#tone)" stroke="none"/>
      <path d="m330 143 7 39 10 21 6-27 21 14-20-27-18-38Z" fill="#b4b4b4" stroke="none"/>
      <path d="M248 137q9-17 28-26m-24 29 22-21m-16 24 14-20m8-20 15-13m-14 19 18-16m-12 15 24-14m-13 14 23-13" fill="none" stroke="#6d6d6d" stroke-width=".85"/>
      <path d="M305 109q18-7 35 5m-31-1q17-3 30 6m-18-1 21 18m-17-12 19 19m-15-11 16 20m-23-29 6 17" fill="none" stroke="#737373" stroke-width=".8"/>
      <path d="M349 134q25 19 50 12m-44-7q17 13 39 13m-34-7q15 11 29 10m-26 4q15 24 35 26m-39-21q12 20 30 25m-35-14 16 18" fill="none" stroke="#727272" stroke-width=".8"/>
      <path d="m276 132 6 16m0-22 7 20m6-24 8 17m6-20 1 20m7-13-6 17m-42-9-8 22m-11-12-4 16m90-2 7 23" fill="none" stroke="#555" stroke-width=".85"/>
      <path d="m266 124 8-9m31-14 8-3m27 25 8 4m-94 22-3 10m116-6 10 4" fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M274 94q4-16 18-24m10 19q21-25 40-14m0 44q34-10 53 2" fill="none" stroke="#444" stroke-width="1.3"/>
      <path d="M244 169q-2 26 14 40m89-20q11 26 34 28m-32-36q26 33 63 28" fill="none" stroke="#666" stroke-width="1.1"/>`,
    pose: {
      neck: 'M276 212L273 235 293 255 323 237 313 208Z',
      shoulders: 'M258 244Q237 239 221 256L218 271Q231 282 245 271L263 255ZM325 244Q345 239 358 254L365 271Q353 282 339 271L320 256Z',
      arms: 'M221 262Q235 256 239 277L226 323 207 398 182 391 195 318 207 283Z M351 261Q365 254 374 276L390 328Q395 345 382 351L326 333 332 312 367 323 347 284Z',
      armLines: 'M221 291L214 321M202 354L196 382M365 285L377 322M349 328L375 338',
      elbows: 'M199 321Q212 314 224 326L220 342Q207 351 198 338ZM371 327Q384 320 391 334L390 344Q382 355 371 343Z',
      elbowLines: 'M204 330L216 334M377 334L384 339',
      wrists: 'M183 389L207 396 201 421 177 412ZM330 309L324 334 307 329 314 304Z',
      hands: 'M176 407L200 416 202 435 193 445 177 441 166 432 170 422Z M298 293L317 305 317 333 305 329 289 323 286 307Z',
      palms: 'M178 417L194 422 198 432 190 439 178 435 173 427Z M300 302L311 308 312 325 301 323 292 314Z',
      palmLines: 'M178 428L185 433 194 432M180 425L184 420M300 309L304 315 300 320',
      fingers: 'M172 425L162 434 147 443Q141 448 145 451Q149 454 157 449L173 439Z M173 437L167 457Q166 463 171 463Q176 463 178 454L181 441Z M182 439L182 466Q183 472 188 471Q193 470 193 463L192 440Z M194 436L197 458Q199 464 203 461Q207 458 205 451L202 432Z M292 293L290 276Q288 269 293 266Q298 263 300 269L301 286 306 299Z M291 296L280 281Q275 278 272 282Q269 286 275 290L286 300Z M288 302L270 294Q263 294 264 299Q265 304 272 305L286 309Z M289 310L274 310Q268 311 269 315Q270 319 277 320L292 321Z M296 321L282 323Q276 325 279 329Q282 333 289 332L307 329Z',
      fingerLines: 'M149 447L153 445M171 457L172 453M187 464V459M199 445L201 451M295 274L296 284M277 298L282 300M280 314L286 315',
      legs: 'M253 430Q274 421 294 437L297 490 280 556 270 613 269 688 243 692 246 610 246 556 236 491Z M304 432Q326 420 344 436L355 489 345 546 363 605 380 681 355 691 334 616 315 555 298 491Z',
      legLines: 'M259 474L262 524M257 582L255 652M328 477L334 518M336 573L359 649',
      thighs: 'M253 431Q274 422 294 438L296 487 286 524Q269 535 246 522L238 488Z M305 432Q327 422 344 438L353 485 347 521Q329 533 311 520L300 486Z',
      knees: 'M245 544Q261 536 277 547L277 565Q263 577 248 566L241 554ZM319 535Q334 525 348 537L349 554Q336 567 321 554L316 545Z',
      kneeLines: 'M251 553Q261 548 270 556M324 543Q334 538 342 547',
      ankles: 'M244 671Q256 665 268 674L270 699 241 703ZM354 670Q365 662 376 672L383 696 357 704Z',
      feet: 'M244 690Q257 682 267 693L272 714Q265 727 244 731L213 731Q202 726 210 717L231 704Z M357 693Q369 684 379 692L393 706 410 716Q419 725 410 730L394 733 367 723 351 708Z',
      footLines: 'M215 720L219 727M224 714L229 722M233 709L238 717M406 719L403 726M397 713L393 722',
      heels: 'M259 705Q271 701 274 713L271 727 258 728Q252 716 259 705Z M353 703Q365 698 371 710L370 725 356 723Q348 713 353 703Z'
    }
  };

  const result = {};
  function register(id, character, defs, garments) {
    const prefix = `illustrated-${id}-`;
    const namespace = svg => svg.replace(/id="([^"]+)"/g, `id="${prefix}$1"`)
      .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`);
    result[id] = {
      defs: namespace(defs),
      layers: [...anatomy(character), ...garments.map(([name, order, svg, transform]) =>
        layer(name, order, group(svg, character.ink, transform)))].map(item =>
        ({ ...item, svg: namespace(item.svg) }))
    };
  }

  // Garment registrations follow. Each tuple contains only its named wearable.
  register('anime-01', kite,
    `<defs>
      <linearGradient id="hair" x2=".8" y2="1"><stop stop-color="#80dfcb"/><stop offset=".48" stop-color="#248f91"/><stop offset="1" stop-color="#173e56"/></linearGradient>
      <linearGradient id="iris" x2="0" y2="1"><stop stop-color="#143c59"/><stop offset=".55" stop-color="#287f9b"/><stop offset="1" stop-color="#87ebcc"/></linearGradient>
    </defs>`, [
      ['trousers', 60, `<path d="M241 392Q282 384 347 396L365 441Q366 480 349 533L363 620 346 661 305 661 290 608 292 538 283 477Q270 518 258 547L251 638 220 660 184 644 197 596 207 521 218 450Z" fill="#344854"/>
        <path d="m246 416-14 82-10 59-11 71-22 14 8-46 10-75 11-71 11-42Z" fill="#26323e" stroke="none"/>
        <path d="m320 419 16 28-19 79 9 63 20 54 15-22-12-88q17-63 14-82l-17-40Z" fill="#22323c" stroke="none"/>
        <path d="m286 461 6 77-2 70 15 53 14-5-15-55 3-62Z" fill="#1c2c36" stroke="none"/>
        <path d="m228 475 18 3-10 62-21 14 5-44Z" fill="#536371" stroke="none"/><path d="m331 555 4 39 14 24-17-12-10-40Z" fill="#62717a" stroke="none"/>
        <path d="m207 563 15-13 12 1m-29 27 25-11m-28 34 28-5-12 14m92-59 24-11-9 19m-18 46 19 16 19 1m-39 12 21 10" fill="none" stroke="#809099" stroke-width="1.4"/>
        <path d="m226 439 40 11-8 55-39-8Z" fill="#405b65"/><path d="m225 438 41 11-6 18-21 5-18-17Z" fill="#608087"/>
        <path d="m229 478 20 5m-25 5 21 5" fill="none" stroke="#91a4a5" stroke-width="1.2"/>
        <path d="m325 447 31-4-2 48-35 8Z" fill="#46616a"/><path d="m325 447 31-4-1 14-19 9-14-6Z" fill="#69838a"/>
        <path d="m334 476 12-2m-15 9 15-3" fill="none" stroke="#91a4a5" stroke-width="1.2"/>
        <path d="m221 425 4 21m105-24 5 23M279 419l-1 32 10 8" fill="none"/>
        <path d="m199 632 53-3-1 18-29 15-32-12Zm104 7 52-3-8 26-41 2Z" fill="#172d36"/>
        <path d="m201 638 43-2m-43 7 36-2m74 3 33-2m-30 9 27-2" fill="none" stroke="#607882" stroke-width="1.2"/>`],
      ['trainers', 62, `<path d="m211 655 34-7-3 30 5 18-58 7 9-30Zm95 2 38 1 6 26 24 22-60 8-9-28Z" fill="#a1c9bd"/>
        <path d="m204 677 23 1 11-10 8 15 3 16q-1 15-20 18l-54 2q-13-9-3-19Zm103 4 28-4 14 9 14 10 21 5q20 5 21 19l-11 10-79-6q-15-13-8-43Z" fill="#f2ebd6"/>
        <path d="m203 681 11 12-18 16-23 2 7-14Zm142 9 10 16 35 9-12-11-17-8Z" fill="#2b8f91"/>
        <path d="m240 685 6 17-21 9-16-3 17-16Zm70 0 13 1 5 21-15 4Z" fill="#286d75"/>
        <path d="m171 712 28 2 49-10-1 15-40 9-37-1q-5-8 1-15Zm138-2 47 8 47-3 1 14-23 7-62-5q-12-5-10-21Z" fill="#fffdf4"/>
        <path d="m176 721 25 1 41-9m76 11 42 5 34-5" fill="none" stroke="#a7b6b0" stroke-width="1.2"/>
        <path d="m212 680 20-1-3 20-24 7Zm113 3 18 7 10 19-24-3Z" fill="#536b72"/>
        <path d="m212 685 18 1m-21 5 19 1m-23 5 19 1m104-8 15 5m-13 0 16 5m-15 0 17 5" fill="none" stroke="#fffaf0" stroke-width="2.4"/>
        <path d="m218 677-10-8q-7-7-8 0t18 8l15-12q9-5 8 2t-23 10m116 10-8-15q-6-6-8 0t16 15l15-7q10-3 7 3t-22 4" fill="none" stroke="#fffaf0" stroke-width="1.8"/>
        <path d="m183 704 6-2m178 5 5 1" fill="none" stroke="#d1bc8f" stroke-width="2"/>`],
      ['shirt', 64, `<path d="m251 234 43 17 35-20 18 168-20 22-87-5 1-81Z" fill="#f9f3df"/>
        <path d="m265 269 12 95-12 41 20-5 2-110Z" fill="#d5d8c5" stroke="none"/>
        <path d="m311 275 15 116-13 19 26-4-7-90Z" fill="#d0d5c0" stroke="none"/>
        <path d="m267 313 15 4m17 30 22-7m-43 48 24-3m-49 19 20-5m19 8 27-4" fill="none" stroke="#a3b6a9" stroke-width="1.3"/>
        <path d="m243 403 95 2 3 14-101 3Z" fill="#e7dcc0"/>
        <path d="m247 411 28 1m11 0h43" fill="none" stroke="#a9a68d" stroke-width="1"/>
        <path d="m267 233 20 20-11 14-19-22m61-12-29 20 12 15 22-20" fill="#fff9e7"/>
        <path d="m287 253 2 32m-1-22 6 1" fill="none" stroke="#62827a" stroke-width="1.2"/>`],
      ['jacket', 70, `<path d="m221 249-25 21-15 36-16-36-29 15q9 52 30 63 19 8 35-12l32-44Z" fill="#f2efde"/>
        <path d="m219 277-25 53q-16 29-30 9l-20-39 15 3 16 24 13-25Z" fill="#bbcbbb" stroke="none"/>
        <path d="m203 269 6 31-10 22m-12-11-12 15m-17-17 11 19" fill="none" stroke="#7b9e96" stroke-width="1.4"/>
        <path d="m134 280 32-16 8 21-32 17Z" fill="#287b80"/>
        <path d="m143 283 21-10m-17 17 19-10" fill="none" stroke="#a1dbca" stroke-width="1.3"/>
        <path d="m251 230-34 12-16 30 13 53-7 63 27 19 13-80 20-56Zm77 1 24 8 23 23-15 63 13 69-35 14-7-80-16-63Z" fill="#f3eedc"/>
        <path d="m214 328-7 60 27 19 7-41-12 16Z" fill="#92b7a8" stroke="none"/>
        <path d="m344 285 14-17-9 61 9 60-20 19-7-80Z" fill="#b8cbbb" stroke="none"/>
        <path d="m217 242 31-10 13 34-18 6-11-14-13 9Zm113-10 22 7 17 24-28-4-20 12-5-7Z" fill="#298c8d"/>
        <path d="m219 249 22-8 9 22m78-23 11 14 20 1" fill="none" stroke="#9fd7c4" stroke-width="1.5"/>
        <path d="m232 282 14 6-10 39-14-6Z" fill="#2f7b7d"/><path d="m226 310 13 5m-11-12 13 5" fill="none" stroke="#bad3c5" stroke-width="1"/>
        <path d="m217 352 22 5-6 28-21-10Zm127-2 16-4 7 31-22 7Z" fill="#377a7b"/>
        <path d="m218 359 16 4m111-5 13-4" fill="none" stroke="#e5edce" stroke-width="1.3"/>
        <path d="m247 285-18 103m97-104 15 110" fill="none" stroke="#304f56" stroke-width="2"/>
        <path d="m245 295-14 82m97-81 12 87" fill="none" stroke="#fffaf0" stroke-width="1"/>
        <path d="m230 384 5 1-1 10-6-1Z" fill="#e7ba63"/>
        <path d="m205 387 30 10-2 14-31-12Zm134 9 33-11 4 14-36 12Z" fill="#1c676e"/>
        <path d="m211 395 17 6m118 1 23-8" fill="none" stroke="#82bdb0" stroke-width="1.2"/>
        <path d="m355 246 23 17 19 64-6 43-31 52-23-13 28-58-12-33-9-39Z" fill="#e8e9d6"/>
        <path d="m377 267 20 60-6 43-31 52-11-6 25-58 4-21-12-41Z" fill="#a6bdad" stroke="none"/>
        <path d="m363 288 22 2 9 31-23 9Z" fill="#2d8b8b"/><path d="m369 295 12 2 5 17-13 5Z" fill="#e1c778"/>
        <path d="m369 340 13-6m-15 23 17-5m-21 14 13 2m-24 17 14 1" fill="none" stroke="#638a85" stroke-width="1.4"/>
        <path d="m343 398 25 13-9 17-24-13Z" fill="#246f75"/><path d="m342 405 16 9" fill="none" stroke="#a1dbca" stroke-width="1.4"/>`],
      ['bag', 85, `<path d="m318 237 9 1-79 174-9-5Z" fill="#bf8858"/>
        <path d="m321 246-72 159" fill="none" stroke="#e9c28b" stroke-width="1.2"/>
        <path d="m241 387 17 7-10 19-16-7Z" fill="#dec68d"/><path d="m243 392 8 3-5 11-8-3Z" fill="#6d634e" stroke-width="1"/>
        <path d="m224 403 38 14-10 54-47-14 6-39Z" fill="#b77c53"/><path d="m211 416 47 13-3 16-27 2-21-17Z" fill="#e4b980"/>
        <path d="m214 439-4 14 37 11 4-18m-29-14 7 2" fill="none" stroke="#875c46" stroke-width="1.2"/>
        <path d="m228 435 6 2-2 10-6-2Z" fill="#f2d99b"/>`],
      ['hair-clip', 95, `<path d="m324 133 13-6 3 6-12 7Z" fill="#e7c572" stroke-width="1.4"/><path d="m328 134 8-4" stroke="#fff1be" stroke-width="1"/>`, faceTransform]
    ]);

  register('anime-02', ember,
    `<defs>
      <linearGradient id="copper" x2=".7" y2="1"><stop stop-color="#f5b171"/><stop offset=".5" stop-color="#b95839"/><stop offset="1" stop-color="#642e34"/></linearGradient>
      <linearGradient id="eyes" x2="0" y2="1"><stop stop-color="#5e3537"/><stop offset=".6" stop-color="#b97536"/><stop offset="1" stop-color="#f3cf73"/></linearGradient>
    </defs>`, [
      ['trousers', 60, `<path d="m248 435 62 9-8 94-18 88-40-3-2-78-7-61Z" fill="#e0d0b7"/>
        <path d="m302 441 52-7 11 79-8 96-39 9-12-67-17-66Z" fill="#e7d6bc"/>
        <path d="m258 466-6 64 10 49-4 40-14 4-2-78-7-61Z" fill="#afa596" stroke="none"/>
        <path d="m330 469 13 59-10 43 7 43 17-5 8-96-6-43Z" fill="#c2b29f" stroke="none"/>
        <path d="m248 520 16 16m-20 0 18 12m56-35 26-5-10 15m-79 48 24-8m-26 14 17-2m55-23 17 6-19 8" fill="none" stroke="#8f8079" stroke-width="1.3"/>
        <path d="m245 604 40-2m34-8 37-7" fill="none" stroke="#f9ecd5" stroke-width="2"/>`],
      ['boots', 62, `<path d="m239 583 49 6-3 30-6 59 3 29q-4 17-26 17l-48 1q-13-10-3-23l31-20 1-50Z" fill="#76535a"/>
        <path d="m314 577 42-8 4 59-4 45 18 28 12 12q3 15-14 18l-45-10-14-24 7-35Z" fill="#76535a"/>
        <path d="m267 611-5 64 8 33-17 7-12-19 10-66Z" fill="#a17571" stroke="none"/><path d="m338 602 5 45-4 30 18 29 16 7-20-40 7-45-4-42Z" fill="#4c3e4d" stroke="none"/>
        <path d="m238 580 51 5-2 25-52-6Zm73-3 47-12 3 24-47 13Z" fill="#493d50"/>
        <path d="m240 589 43 5m-43 6 41 4m-25-10-1 9m64-16 34-10m-32 18 34-10" fill="none" stroke="#d0ad79" stroke-width="1.4"/>
        <path d="m239 637 43 5-1 13-42-4Zm79-5 40-6-1 13-40 7Z" fill="#b88d67"/>
        <path d="m266 640 13 2-1 11-13-2Zm53-7 12-2 1 11-13 2Z" fill="#d9c18a" stroke-width="1.4"/>
        <path d="m237 666 43 5m-37 8 28 5m50-23 23-2m-26 14 26-3" fill="none" stroke="#402f40" stroke-width="1.6"/>
        <path d="M207 702q21-4 28 13m123-8q13-7 21 1" fill="none" stroke="#d3a18a" stroke-width="1.5"/>
        <path d="m203 716 44 2 32-10 1 15-27 11-44-3q-9-4-6-15Zm112-16 20 14 49 4-1 14-18 5-36-13-14-11Z" fill="#383343"/>
        <path d="m210 725 36 1 25-8m62 2 38 11" fill="none" stroke="#ad9a91" stroke-width="1.2"/>
        <path d="m243 615-2 15m38-13-1 18m42-22 1 12m30-22 1 15" fill="none" stroke="#d7ac8b" stroke-width="1"/>`],
      ['shirt', 64, `<path d="M250 234q41-13 78 0l31 40-15 80 23 87-21 25-40-17-30 24-53-22 17-79-10-91Z" fill="#f4ead5"/>
        <path d="m250 269 8 61-8 60-15 54 29 13 8-99-7-61Z" fill="#c9c7b4" stroke="none"/>
        <path d="m324 273-8 59 5 48 30 62 16-1-23-87 15-80Z" fill="#c0bbad" stroke="none"/>
        <path d="m282 344 4 54-10 75 30-24-10-54Z" fill="#ddd3bc" stroke="none"/>
        <path d="m246 293 13 8m58-12 13-9m-62 41 17 7m24-10 17-8m-69 51 17 8m34-12 20-10" fill="none" stroke="#a2a593" stroke-width="1.3"/>
        <path d="m249 402-10 39 26 10m50-47 14 36 18 8m-50-30 7 28" fill="none" stroke="#a2a593" stroke-width="1.4"/>
        <path d="m223 451 53 22 30-24 40 17 21-25-2-11-21 24-37-18-33 25-47-20Z" fill="#4d6074"/>
        <path d="m234 448 39 18 32-24 39 19 15-18" fill="none" stroke="#d5b57a" stroke-width="1.2"/>
        <path d="m239 241 26-11 23 33-16 55-25-49Zm79-11 26 16-25 68-20-48Z" fill="#647484"/>
        <path d="m248 244 15-6 16 26-7 28Zm71-6 16 11-17 45-11-29Z" fill="#9aa1a0" stroke-width="1.4"/>
        <path d="m276 283 12 15 16-18m-22 15 3 53m14-57 5 47" fill="none" stroke="#d2b57c" stroke-width="2"/>
        <path d="m283 344 4 5-4 7-3-6m20-17 5 4-1 8-5-4" fill="#d8b77a" stroke-width="1.2"/>
        <path d="m243 242-20 13-19 49-22 68 25 15 32-68 15-40Z" fill="#f1e4cc"/>
        <path d="m228 267-9 40-24 67 12 13 32-68 15-40Z" fill="#c5c2b0" stroke="none"/>
        <path d="m205 311 26 11-15 29-26-12Z" fill="#78818c"/>
        <path d="m204 319 20 8m-23 0 19 8" fill="none" stroke="#c9b98f" stroke-width="1.3"/>
        <path d="m182 369 29 12-7 18-29-12Z" fill="#5b586e"/><path d="m183 377 19 8" fill="none" stroke="#dbb87d" stroke-width="1.5"/>
        <path d="m337 241 25 16 18 47 39 17-7 29-55-17-30-49Z" fill="#f1e4cc"/>
        <path d="m342 270 24 48 51 20-5 12-55-17-30-49Z" fill="#b8b9ad" stroke="none"/>
        <path d="m347 274 20-5 10 22-22 10Z" fill="#78818c"/><path d="m354 277 11-4 6 13-11 5Z" fill="#d0ad77" stroke-width="1.2"/>
        <path d="m371 311-9 13m21-7-4 13m19-10-4 14" fill="none" stroke="#9a9d92" stroke-width="1.3"/>
        <path d="m407 314 19 6-9 34-18-7Z" fill="#5b586e"/><path d="m413 323-5 17" fill="none" stroke="#dbb87d" stroke-width="1.5"/>`],
      ['belt', 75, `<path d="m240 367 102-4 7 21-113 8Z" fill="#6d5c89"/>
        <path d="m241 372 98-2m-98 12 103-6" fill="none" stroke="#aa98b5" stroke-width="1.3"/>
        <path d="m238 382 109-4 4 16-114 7Z" fill="#8f604c"/><path d="m287 381 23-1 1 18-24 1Z" fill="#d6b170"/>
        <path d="m293 385 12-1 1 10-13 1Z" fill="#756778" stroke-width="1"/><path d="m299 390 9-1" stroke="#f6d795" stroke-width="1.3"/>`],
      ['scarf', 80, `<path d="M374 266Q399 258 415 282Q447 332 500 290Q475 351 422 317Q404 304 383 304Z" fill="#635b94"/>
        <path d="M382 278Q404 280 415 292Q436 323 483 304Q442 320 419 297Q402 282 385 292Z" fill="#a497c0" stroke="none"/>
        <path d="M358 414Q411 444 455 427Q430 475 370 458Q415 512 470 502Q430 546 357 515Q344 499 337 478L349 457 364 441Z" fill="#7463a0"/>
        <path d="M346 467Q371 489 418 493L457 507Q380 528 346 474Z" fill="#433e72" stroke="none"/>
        <path d="M373 445L427 444M372 486L425 508" fill="none" stroke="#d8c7d8" stroke-width="1.2"/>
        <path d="m457 506 5 12m-13-9 5 13m-13-10 4 13m-14-12 3 13" fill="none" stroke="#d3b376" stroke-width="2"/>
        <path d="m273 226 20 15 27-15 13 12-22 29-26 2-22-24Z" fill="#6c6397"/>
        <path d="m270 239 25 17 28-18m-43 21 26 2" fill="none" stroke="#b6a6c8" stroke-width="1.3"/>
        <path d="m317 244 14-9 12 14-14 20-18-3Z" fill="#9580b1"/>
        <path d="m326 247-8 14m15-15-5 14" fill="none" stroke="#514870" stroke-width="1.2"/>`],
      ['bag', 85, `<path d="m259 235 8-3 68 158-9 3Z" fill="#ae805b"/>
        <path d="m264 241 66 146" fill="none" stroke="#e6c28e" stroke-width="1.2"/>
        <path d="m320 383 37 2 9 49-43 7-9-43Z" fill="#95705b"/><path d="m317 389 41 1 2 21-18 10-24-12Z" fill="#c2a170"/>
        <path d="m324 415 4 18 30-5m-35-30 30 2" fill="none" stroke="#68584d" stroke-width="1.2"/>
        <path d="m336 410 9 1 1 12-9-1Z" fill="#ead295"/><path d="m342 414 1 4" stroke="#86714b" stroke-width="1.5"/>`],
      ['hair-clip', 95, `<path d="m333 151 14-2 1 8-14 2Z" fill="#d8b478" stroke-width="1.3"/><path d="m337 154 7-1" stroke="#fff1bc" stroke-width="1.1"/>`, faceTransform],
      ['earrings', 94, `<path d="m337 188 2 11 6-3-2-10Z" fill="#e6bf77" stroke-width="1.2"/>`, faceTransform]
    ]);

  register('manga-01', sora,
    `<defs>
      <pattern id="tone" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#f1f1f1"/><circle cx="1.5" cy="1.5" r=".75" fill="#777"/></pattern>
      <pattern id="darktone" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="4" fill="#717171"/><circle cx="1" cy="1" r=".85" fill="#303030"/></pattern>
      <pattern id="cross" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#fff"/><path d="m0 0 8 8m-4-4 8 8m0-8L0 8m8-4L4 8" fill="none" stroke="#737373" stroke-width=".55"/></pattern>
      <pattern id="plaid" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(8)"><rect width="22" height="22" fill="#e7e7e7"/><path d="M0 4h22M5 0v22" stroke="#a0a0a0" stroke-width="4"/><path d="M0 12h22M13 0v22" stroke="#606060" stroke-width=".8"/></pattern>
    </defs>`, [
      ['leggings', 60, `<path d="m246 469 49 8-1 59-16 69-6 69-35-1 1-81-2-66Zm56 8 47-8 10 60-13 66 11 73-35 8-16-83-12-64Z" fill="#313131"/>
        <path d="m245 496 12 12-4 63 4 40-6 59-14 3 1-81-2-66Zm85-4 11 12 7 28-16 52 8 45-7 31-13-70-10-47Z" fill="url(#darktone)" stroke="none"/>
        <path d="m271 500 10-7-3 43-14 58 4-45Zm66 36 7-17-2 30-9 26Z" fill="#737373" stroke="none"/>
        <path d="m240 592 17 7m-17-1 15 7m-15-1 13 7m71-30 14-5m-12 10 12-5m-11 10 9-5" fill="none" stroke="#a4a4a4" stroke-width=".8"/>
        <path d="m254 633 10-20m-9 31 8-17m74-5 7 20m-5-8 7 19" fill="none" stroke="#989898" stroke-width=".7"/>`],
      ['skirt', 63, `<path d="m246 392 86-1q12 24 19 55l24 41-26 13-22-6-24 10-28-9-26 5-30-15 12-41Z" fill="url(#plaid)"/>
        <path d="m250 414-4 39-13 34 16 13 12-48 5-44Z" fill="#2d2d2d"/>
        <path d="m283 406-10 52 2 37 15 5-4-42 7-49Z" fill="#404040"/>
        <path d="m315 407 10 43 2 44 16 5-7-51-10-35Z" fill="#2d2d2d"/>
        <path d="m339 424 12 22 24 41-13 6-17-39Z" fill="#505050"/>
        <path d="m241 440-7 28m37-43-8 46m39-52 4 60m30-28 8 31" fill="none" stroke="#fff" stroke-width="1.3"/>
        <path d="m224 480 23 13 27-5 29 9 23-9 23 5 20-10" fill="none" stroke="#fff" stroke-width="1.4"/>
        <path d="m247 397-7 19 91 1-1-25Z" fill="#262626"/><path d="m248 404 75 2" fill="none" stroke="#bfbfbf" stroke-width="1.2"/>`],
      ['boots', 62, `<path d="m232 640 43 4-1 43 8 26q-9 13-26 13l-45 1q-15-9-5-22l21-16Zm85 3 36-7 7 48 26 24q12 16-7 23l-48-4-15-19 6-26Z" fill="#f5f5f5"/>
        <path d="m232 650 11 4-4 37-15 17-16 7 5-13 14-13Z" fill="url(#tone)" stroke="none"/>
        <path d="m258 654 15-3 1 36 8 26-15 5-9-29Z" fill="#929292" stroke="none"/>
        <path d="m337 652 13-8 10 40 26 24-6 9-26-14-13-21Z" fill="url(#cross)" stroke="none"/>
        <path d="m230 641 46 2-1 13-46-3Zm86 0 39-7 3 14-39 8Z" fill="#202020"/>
        <path d="m234 646 37 2m51 0 30-6" fill="none" stroke="#efefef" stroke-width="1.2"/>
        <path d="m242 657 13 1 1 35-20 11-9-9 10-14Zm83 3 11-2 6 26 16 20-18 7-10-20Z" fill="#414141"/>
        <path d="m242 665 13 2m-14 5 14 2m-15 5 15 2m-18 5 17 1m-21 7 17 1m78-27 11-3m-10 10 12-4m-10 11 13-4m-11 11 15-5m-11 11 16-5" fill="none" stroke="#fafafa" stroke-width="1.8"/>
        <path d="m241 660-8-7q-6-4-7 1t15 6l11-9q6-4 7 1t-18 8m90 5-10-9q-7-3-6 3t16 6l10-12q6-4 8 1t-18 11" fill="none" stroke="#fff" stroke-width="1.5"/>
        <path d="M207 709q14-6 26 8m125-9q16-10 25 4" fill="none" stroke="#777" stroke-width="1.2"/>
        <path d="m204 718 29 3 48-10 1 14-33 12-39-4Zm113-11 22 14 47-3 1 14-20 7-36-5-15-15Z" fill="#252525"/>
        <path d="m211 727 22 3 41-12m58 10 32 5 14-5" fill="none" stroke="#ededed" stroke-width="1.1"/>
        <path d="m216 729 1 5m8-5 1 5m9-5 1 4m8-7 1 4m94-1-1 4m10-2-1 4m10-2-1 4m10-5-1 4" fill="none" stroke="#9e9e9e" stroke-width="1"/>`],
      ['shirt', 64, `<path d="m245 233 36 17 39-16 12 155-13 23-79-4 7-62Z" fill="#fff"/>
        <path d="m257 271 8 39-11 66 3 29-17 3 7-62Z" fill="#d5d5d5" stroke="none"/>
        <path d="m300 279 16 33-1 54 12 29 5-6-12-155Z" fill="#e2e2e2" stroke="none"/>
        <path d="m263 326 14 5m-17 20 21-6m16 16 17 2m-58 26 23-9m8 18 25-5" fill="none" stroke="#767676" stroke-width="1.1"/>
        <path d="m275 288 12-6 14 8-11 17Z" fill="#333" stroke-width="1.3"/><path d="m282 290 5-2 6 3-5 8Z" fill="#fff" stroke-width="1"/>
        <path d="m252 405 67 5 11-13-1 14-12 10-66-9Z" fill="#ccc" stroke-width="1.1"/>
        <path d="m267 236 17 20-11 17-19-26Zm47-2-29 22 12 15 27-25Z" fill="#fff"/>
        <path d="m283 257 2 16m3-4 1 10" fill="none" stroke="#777" stroke-width="1.1"/>`],
      ['jacket', 70, `<path d="m224 246-20 7-18 44-9-28-26 9q0 39 20 59 17 12 32-9l29-42Z" fill="#fff"/>
        <path d="m214 272-16 40q-19 28-29 6l-10-17 7 24 9 10q15 11 28-7l29-42Z" fill="url(#tone)" stroke="none"/>
        <path d="m207 282-5 18m-20 9 8 10m-15-7 8 9m-21-16 4 9" fill="none" stroke="#6b6b6b" stroke-width="1.1"/>
        <path d="m151 273 25-11 9 23-30 13Z" fill="#202020"/><path d="m155 280 22-10m-20 16 22-10" fill="none" stroke="#fff" stroke-width="1.4"/>
        <path d="m251 229-29 12-8 37 11 40-16 81 31 14 14-78 16-71Zm69 2 27 13 15 29-13 67 21 55-36 22-12-67-18-85Z" fill="url(#tone)"/>
        <path d="m225 318-16 81 31 14 4-24-18-13 12-36Z" fill="#444" stroke="none"/>
        <path d="m340 282-4 59 20 57 14-3-21-55 13-67Z" fill="#4e4e4e" stroke="none"/>
        <path d="m224 242 27-13 20 35-18 12-20-24-11 15Zm96-11 27 13 11 20-15-6-28 20-12-13Z" fill="#272727"/>
        <path d="m229 244 20-8 14 25m59-21 21 17-26 15" fill="none" stroke="#fff" stroke-width="1.4"/>
        <path d="m255 284-19 111m82-108 17 111" fill="none" stroke="#222" stroke-width="2"/>
        <path d="m251 284-20 109m92-101 17 108" fill="none" stroke="#fff" stroke-width="1.4"/>
        <path d="m220 348 23 8-6 23-23-9Zm124 5 14-6 8 22-18 10Z" fill="#fff" stroke-width="1.6"/>
        <path d="m220 354 20 6m106 0 12-6" fill="none" stroke="#454545" stroke-width="1.2"/>
        <path d="m208 394 33 12-2 17-37-15Zm128 12 33-20 7 16-36 21Z" fill="#222"/>
        <path d="m209 402 26 9m107 2 28-16" fill="none" stroke="#fff" stroke-width="1.6"/>
        <path d="m231 301 11 2m-12 3 11 2m-12 3 10 2m-11 3 10 2m91 17 8-4m-7 8 8-4m-7 8 8-4" fill="none" stroke="#555" stroke-width=".8"/>
        <path d="m239 323 4 1m-6 19 4 1m-7 18 4 1m-7 18 4 1m92-60 3-1m0 20 3-1m0 20 3-1" fill="none" stroke="#fff" stroke-width="3"/>
        <path d="m348 247 23 19 12 67-6 65-16 29-27-12 17-31-5-59-8-49Z" fill="#fff"/>
        <path d="m364 273 10 55-9 58-18 35 14 6 16-29 6-65-12-67Z" fill="url(#tone)" stroke="none"/>
        <path d="m350 283 22-2 4 24-25 3Z" fill="#222"/>
        <path d="m355 289 13-1m-12 6 13-1m-12 6 7-1" fill="none" stroke="#fff" stroke-width="1.1"/>
        <path d="m352 333 17-5m-17 12 14-4m-13 35 16 3m-21 6 12 4m-15 8 11 3" fill="none" stroke="#555" stroke-width="1.1"/>
        <path d="m341 404 25 15-10 18-26-15Z" fill="#242424"/><path d="m339 412 20 12" fill="none" stroke="#fff" stroke-width="1.5"/>`],
      ['hair-clip', 95, `<path d="m327 151 16-5 2 4-17 5Zm3 7 16-5 1 4-16 5Z" fill="#fff" stroke-width="1.1"/>`, faceTransform]
    ]);

  register('manga-02', ren,
    `<defs>
      <pattern id="tone" width="5" height="5" patternUnits="userSpaceOnUse"><rect width="5" height="5" fill="#eee"/><circle cx="1.5" cy="1.5" r=".8" fill="#888"/></pattern>
      <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="#bbb"/><path d="m-2 2 4-4M0 7 7 0m-2 9 4-4M0 0l7 7" fill="none" stroke="#444" stroke-width=".65"/></pattern>
      <pattern id="rib" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)"><rect width="6" height="6" fill="#eee"/><path d="M2 0v6" stroke="#9d9d9d" stroke-width="1"/></pattern>
    </defs>`, [
      ['trousers', 60, `<path d="m254 411 51 6 7 60-23 87-9 91-44 1 7-92-10-72Z" fill="#d5d5d5"/>
        <path d="m301 418 48-8 13 72-5 66 27 86-42 20-29-86-18-64Z" fill="#e9e9e9"/>
        <path d="m255 442 4 57-4 69-9 77-10 11 7-92-10-72Z" fill="url(#hatch)" stroke="none"/>
        <path d="m281 464 11 31-20 67-7 69 15 24 9-91 23-87Z" fill="#777" stroke="none"/>
        <path d="m334 437 17 52-10 49 24 91 19 5-27-86 5-66-13-72Z" fill="url(#tone)" stroke="none"/>
        <path d="m301 479 21 47 7 36 23 63-10 29-29-86-18-64Z" fill="#959595" stroke="none"/>
        <path d="m258 515 17 8-16 7m-13 26 26-6-12 17m-13 12 17-7m62-69 22-6m-21 13 19-6m-26 29 23 13-12 2m-6 22 18 12-12 1" fill="none" stroke="#515151" stroke-width="1.3"/>
        <path d="m250 589 12-5m-13 11 10-5m-12 10 10-5m80-7 11-5m-9 11 11-5m-9 11 11-5" fill="none" stroke="#555" stroke-width=".8"/>
        <path d="m240 638 41 2-2 22-45 1Zm97-7 43-17 8 20-46 22Z" fill="#4a4a4a"/>
        <path d="m241 647 31 2m75-4 29-14" fill="none" stroke="#ddd" stroke-width="1.4"/>`],
      ['boots', 62, `<path d="m235 656 42 2-3 38 3 22-19 12-56-1q-8-14 4-24l25-13Zm110-6 34-13 9 38 22 24 13 12q4 18-17 20l-43-9-20-21 8-22Z" fill="#292929"/>
        <path d="m244 665 13 1-7 34-30 17-13-2 25-20Z" fill="#777" stroke="none"/>
        <path d="m360 652 9 1 6 27 23 27-23-7-15-20Z" fill="#737373" stroke="none"/>
        <path d="m257 666 12 1-2 28-9 12-9-6Zm92-4 10-4 8 25 20 22-14 3-16-23Z" fill="#eee" stroke-width="1.3"/>
        <path d="m256 672 12 3m-13 3 12 3m-14 3 13 3m-15 3 13 3m-17 2 14 4m92-30 10-3m-8 9 10-3m-8 9 11-3m-8 10 11-4m-7 10 12-5" fill="none" stroke="#333" stroke-width="1.4"/>
        <path d="m230 695 8 10m-13-7 8 10m-13-7 8 10m154-13 9-6m-5 11 9-6m-4 11 9-6" fill="none" stroke="#bdbdbd" stroke-width=".8"/>
        <path d="M206 711q14-3 23 9m163-9q15-8 23 3" fill="none" stroke="#c2c2c2" stroke-width="1.2"/>
        <path d="m201 719 30 4 45-12 2 15-24 13-50-4Zm143-15 22 17 56-4 1 14-17 7-45-10-18-14Z" fill="#111"/>
        <path d="m209 729 25 2 34-10m100 3 35 8 13-5" fill="none" stroke="#aaa" stroke-width="1.2"/>
        <path d="m213 731v4m9-3v4m10-3v4m9-6 1 4m9-7 1 4m120-3-1 4m10-1-1 4m11-1-1 3" fill="none" stroke="#666" stroke-width="1"/>`],
      ['sweater', 64, `<path d="m264 241 60-6 27 125-9 63-42 12-53-16 3-80Z" fill="url(#rib)"/>
        <path d="m269 277 13 22-12 63 7 50-30 7 3-80Z" fill="url(#tone)" stroke="none"/>
        <path d="m318 281 14 39-4 52 14 32 9-44-27-125Z" fill="#888" stroke="none"/>
        <path d="m276 328 21 6m-28 31 23-9m16 12 22 4m-53 29 23-8m5 22 23-9" fill="none" stroke="#777" stroke-width="1.2"/>
        <path d="m248 410 52 12 44-13-2 14-42 13-53-15Z" fill="#dadada"/>
        <path d="m255 415 1 8m5-7 1 8m5-7 1 8m6-6 1 7m6-6 1 7m8-5v6m18-8 1 7m6-9 1 7m6-9 1 7m6-9 1 7" fill="none" stroke="#888" stroke-width=".8"/>`],
      ['coat', 70, `<path d="M228 356Q213 410 189 441Q156 505 111 546Q171 552 222 528L248 486 253 421Z M351 351L400 438Q418 519 480 557Q438 586 394 567L346 526 326 450Z" fill="#191919"/>
        <path d="M235 381Q224 451 193 494L132 538Q202 515 231 468L248 417Z" fill="url(#hatch)" stroke="none"/>
        <path d="m345 365 39 82q32 78 74 105-50-8-79-43l-46-111Z" fill="#646464" stroke="none"/>
        <path d="M144 526q38-20 65-59m-47 62q38-21 59-60M372 445q29 71 64 94" fill="none" stroke="#b1b1b1" stroke-width="1.1"/>
        <path d="m177 504 16-13m-12 20 16-14m-11 21 17-16m192 13 15 15m-11-8 17 15m-8-3 13 10" fill="none" stroke="#ececec" stroke-width=".7"/>
        <path d="m260 237-29 14-17 51 14 61-17 81-38 78q37-5 68-34l20-67 7-81 15-65Z" fill="#1c1c1c"/>
        <path d="m320 235 33 17 19 40-21 62 17 82 52 91q-39 0-75-41l-21-73-5-75-18-64Z" fill="#202020"/>
        <path d="m237 265-7 35 10 68-16 83-25 56 23-13 22-64 12-89Z" fill="#474747" stroke="none"/>
        <path d="m344 279 14 18-18 60 12 74 45 80 18 13-47-88-17-82 21-62Z" fill="#555" stroke="none"/>
        <path d="m259 231-28 20 4 41 19-8 11 24 19-40Z" fill="#e1e1e1"/>
        <path d="m322 229 32 24-2 35-17-7-13 28-22-39Z" fill="#ededed"/>
        <path d="m236 255 7 26 11-7 12 21 13-27Zm88-19 21 21-1 20-12-6-9 23-17-24Z" fill="url(#hatch)" stroke-width="1.2"/>
        <path d="m239 261 10-14m-8 20 13-19m-10 25 15-22m65-6 15 22m-17-16 14 21m-16-13 11 17" fill="none" stroke="#fff" stroke-width=".75"/>
        <path d="m269 311-13 106-20 66m86-169 8 99 21 71" fill="none" stroke="#e0e0e0" stroke-width="1.3"/>
        <path d="m249 342-8 38-20 5 5-19Zm97-4 10 26 2 15-17-5Z" fill="#888" stroke-width="1.4"/>
        <path d="m227 370 17-7m100-8 9 10" fill="none" stroke="#fff" stroke-width="1"/>
        <path d="m230 399 18 5-9 35-20-5Zm116 3 18-6 9 31-17 8Z" fill="#303030"/>
        <path d="m228 407 15 4m107-1 12-4" fill="none" stroke="#dedede" stroke-width="1.5"/>
        <path d="m250 440-3 7m-2 9-3 7m-2 10-3 7m104-31 3 7m2 8 3 7m3 8 3 7" fill="none" stroke="#f5f5f5" stroke-width="2.6"/>
        <path d="m197 496 17-5m-21 11 18-5m-21 11 18-5m167-8 13 9m-10-3 13 9m-10-3 13 9" fill="none" stroke="#bbb" stroke-width=".8"/>
        <path d="m232 252-25 18-16 49-12 77 29 6 23-70 12-48Z" fill="#252525"/>
        <path d="m212 280-8 46-15 69 19 7 23-70 12-48Z" fill="#525252" stroke="none"/>
        <path d="m203 330 18-6m-19 12 18-6m-21 37 14-1m-16 8 12-1" fill="none" stroke="#b6b6b6" stroke-width="1.2"/>
        <path d="m180 386 32 10-5 19-34-11Z" fill="#ededed"/><path d="m179 393 25 8m-27-2 24 8" fill="none" stroke="#777" stroke-width=".9"/>
        <path d="m354 253 24 26 18 62q3 17-14 18l-61-22 6-30 35 12-20-38Z" fill="#242424"/>
        <path d="m370 276 17 62q2 12-9 11l-53-21-4 9 61 22q17-1 14-18l-18-62Z" fill="#5d5d5d" stroke="none"/>
        <path d="m361 291 16-6m-12 14 15-6m-16 28 18 5m-24 3 19 5" fill="none" stroke="#ccc" stroke-width="1.2"/>
        <path d="m323 300 15 7-12 35-17-7Z" fill="#efefef"/><path d="m327 308-8 23m13-21-8 23" fill="none" stroke="#777" stroke-width="1"/>`],
      ['scarf', 80, `<path d="M332 233Q378 213 405 247Q434 281 496 247Q490 271 458 283Q419 300 396 271Q374 244 352 252Z" fill="#eee"/>
        <path d="M355 249Q377 241 397 260Q417 283 466 277Q420 301 396 271Q378 251 359 259Z" fill="url(#tone)" stroke="none"/>
        <path d="M360 246q23-5 40 17t58 15m-51-26q29 21 65 4" fill="none" stroke="#747474" stroke-width="1"/>
        <path d="m482 254 4 10m-10-7 4 11m-10-8 4 11m-10-8 4 11" fill="none" stroke="#555" stroke-width="1.1"/>
        <path d="M222 378L229 389Q214 398 199 389Q209 413 230 414L241 405 228 404 235 394Z" fill="#f4f4f4"/>
        <path d="M208 399Q218 406 230 407" fill="none" stroke="#777" stroke-width="1"/>
        <path d="m267 224 26 16 30-19 14 13-14 39-23 11-28-8-19-34Z" fill="#f6f6f6"/>
        <path d="m258 240 18 27 24 5 25-13-2 14-23 11-28-8Z" fill="url(#tone)" stroke="none"/>
        <path d="m268 235 26 17 30-18m-54 11 23 16 27-12m-39 18 18 4 14-8" fill="none" stroke="#777" stroke-width="1.2"/>
        <path d="m258 247 12-4m-9 8 12-4m-9 8 12-4m-9 8 11-4" fill="none" stroke="#888" stroke-width=".7"/>`],
      ['earrings', 94, `<path d="m333 197 3 4 5-6" fill="none" stroke="#555" stroke-width="1.7"/>`, faceTransform]
    ]);

  Object.assign(window.IllustratedLayers, result);
})();

/* Original Pulse vector artwork, independently drawn for earned picture parts. */
(() => {
  'use strict';
  const ellipse = (cx, cy, rx, ry, angle) => ({
    cx, cy, rx, ry, ...(angle === undefined ? {} : { angle })
  });
  const layers = [];
  const add = (id, order, svg) => layers.push({
    id, order,
    svg: `<g data-art-part="${id}" stroke-linecap="round" stroke-linejoin="round">${svg}</g>`
  });
  const skin = 'fill="url(#pulse-skin)" stroke="#81472f" stroke-width="4"';
  const base = 'fill="url(#pulse-base)" stroke="#4d626e" stroke-width="4"';
  const silver = 'fill="url(#pulse-silver)" stroke="#5e646d" stroke-width="3"';
  const plum = 'fill="url(#pulse-plum)" stroke="#412b42" stroke-width="5"';
  const coral = 'fill="url(#pulse-coral)" stroke="#ab4146" stroke-width="3"';

  const defs = `<defs>
    <linearGradient id="pulse-skin" x1="0" y1="0" x2="1" y2=".7">
      <stop stop-color="#f6c499"/><stop offset=".5" stop-color="#e9aa78"/>
      <stop offset="1" stop-color="#cb8156"/>
    </linearGradient>
    <linearGradient id="pulse-base" x1="0" y1="0" x2="1" y2=".4">
      <stop stop-color="#b7cad0"/><stop offset=".55" stop-color="#93adb9"/>
      <stop offset="1" stop-color="#758e9d"/>
    </linearGradient>
    <linearGradient id="pulse-plum" x1="0" y1="0" x2="1" y2=".65">
      <stop stop-color="#824369"/><stop offset=".5" stop-color="#633451"/>
      <stop offset="1" stop-color="#3e263e"/>
    </linearGradient>
    <linearGradient id="pulse-silver" x1="0" y1="0" x2="1" y2=".1">
      <stop stop-color="#979da5"/><stop offset=".29" stop-color="#d9dcde"/>
      <stop offset=".48" stop-color="#f4f4ef"/><stop offset=".7" stop-color="#c3c6c9"/>
      <stop offset="1" stop-color="#9398a1"/>
    </linearGradient>
    <linearGradient id="pulse-ivory" x1="0" y1="0" x2=".6" y2="1">
      <stop stop-color="#fffdf4"/><stop offset=".65" stop-color="#ede8df"/>
      <stop offset="1" stop-color="#d8d3ce"/>
    </linearGradient>
    <linearGradient id="pulse-coral" x1="0" y1="0" x2="1" y2=".6">
      <stop stop-color="#ff8b7a"/><stop offset=".5" stop-color="#ef625e"/>
      <stop offset="1" stop-color="#ca414d"/>
    </linearGradient>
    <linearGradient id="pulse-hair" x1="0" y1="0" x2="1" y2=".6">
      <stop stop-color="#a75c31"/><stop offset=".4" stop-color="#7e4028"/>
      <stop offset="1" stop-color="#482923"/>
    </linearGradient>
    <radialGradient id="pulse-blush">
      <stop stop-color="#ed8d79" stop-opacity=".7"/>
      <stop offset="1" stop-color="#ed8d79" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

  // One hair layer includes the ponytail, cap and side locks; the face is in front.
  add('hair', 1, `
    <path d="M499 67 Q474 32 508 16 Q527 5 551 17
      Q587 5 618 28 Q650 51 646 98 Q642 119 648 148
      Q650 183 673 198 Q691 207 697 184
      Q710 216 680 230 Q701 243 700 266 Q699 292 674 304
      Q682 285 668 277 Q671 314 642 328
      Q627 335 615 326 Q640 310 620 286 Q594 274 577 257
      Q552 230 554 198 L546 137 Z"
      fill="url(#pulse-hair)" stroke="#4b2b23" stroke-width="4"/>
    <path d="M539 34 Q584 19 615 55 Q632 78 625 121
      Q617 177 649 210 Q662 224 679 223
      Q651 235 626 211 Q598 183 606 126
      Q615 64 564 54 Z" fill="#bf7140"/>
    <path d="M575 57 Q605 82 592 125 Q578 190 614 229
      Q628 245 651 250 Q674 259 663 282
      Q659 265 640 268 Q604 257 586 228
      Q558 186 574 123 Q587 85 561 63 Z" fill="#5d3125"/>
    <path d="M511 27 Q539 16 555 30 M563 32 Q599 33 617 65
      M632 86 Q622 161 656 195 M609 224 Q624 240 648 247
      M655 291 Q650 313 638 318"
      fill="none" stroke="#df9860" stroke-width="5" opacity=".75"/>
    <path d="M492 62 Q516 40 539 53 Q554 62 552 82
      L536 96 L505 83 Z" ${coral}/>
    <path d="M510 56 Q529 58 538 75" fill="none" stroke="#ffb19a" stroke-width="5"/>
    <path d="M397 252 Q378 248 374 223 Q353 207 359 180
      Q343 162 354 143 Q358 115 378 101 Q386 65 425 57
      Q454 31 480 51 Q504 38 526 60 Q553 69 561 100
      Q576 129 559 175 L548 226 Q553 247 537 261
      Q541 239 531 230 L504 165 L462 120
      Q424 151 411 194 L408 222 Q404 250 396 263
      Q390 279 404 286 Q385 282 385 269 Z"
      fill="url(#pulse-hair)" stroke="#4b2b23" stroke-width="4"/>
    <path d="M365 187 Q367 143 397 120 Q427 93 467 91
      Q430 122 412 152 Q391 182 388 219
      Q375 210 365 187 Z" fill="#a65a32"/>
    <path d="M379 142 Q408 99 460 83 Q474 79 478 91
      Q433 100 408 128 L382 168 Z" fill="#c07943"/>
    <path d="M394 103 Q418 74 449 70 Q472 68 482 91
      M428 60 Q457 52 472 65 M494 62 Q522 65 534 96
      M369 180 Q385 130 427 110 M393 223 Q397 185 418 155
      M541 129 Q551 162 538 185"
      fill="none" stroke="#e19a5b" stroke-width="4" opacity=".65"/>
    <path d="M461 120 Q470 99 478 94 Q498 102 508 129
      M377 207 Q374 177 391 156 M528 102 Q548 130 534 158"
      fill="none" stroke="#4e2b23" stroke-width="5"/>
  `);

  // A neutral covered foundation keeps partial progress modest and connected.
  add('legs', 10, `
    <path d="M385 1020 L465 1031 Q460 1080 447 1127
      L435 1326 L380 1326 L358 1211 Q346 1149 366 1096 Z" ${base}/>
    <path d="M576 1030 L652 1017 L680 1090 Q711 1154 709 1208
      L724 1326 L684 1338 L640 1220 Q596 1132 576 1030 Z" ${base}/>
    <path d="M389 1082 Q376 1131 378 1179 M637 1079 Q671 1132 680 1179"
      fill="none" stroke="#d2dfe1" stroke-width="11" opacity=".55"/>
  `);
  add('thighs', 11, `
    <path d="M415 666 Q463 670 499 714 Q493 805 477 882
      L463 1003 L383 1009 Q375 938 360 851 Q342 766 379 708 Z" ${base}/>
    <path d="M499 714 Q536 669 589 665 Q633 707 644 779
      L656 1005 L577 1010 Q546 933 522 848 Z" ${base}/>
    <path d="M387 758 Q365 814 400 949 M600 757 Q623 834 623 948"
      fill="none" stroke="#d2dfe1" stroke-width="12" opacity=".55"/>
  `);
  add('knees', 12, `
    <path d="M383 971 Q428 958 462 987 L454 1046
      Q429 1072 380 1046 Z" ${base}/>
    <path d="M575 988 Q610 958 648 971 L662 1047
      Q622 1070 590 1045 Z" ${base}/>
    <path d="M396 991 Q426 980 453 997 L445 1029
      Q421 1043 392 1026 Z M585 997 Q610 980 641 991
      L654 1026 Q626 1043 604 1029 Z" fill="#a8bec7"/>
  `);
  add('ankles', 13, `
    <path d="M383 1307 L431 1307 L426 1360 L384 1360 Z" ${base}/>
    <path d="M681 1316 L719 1307 L725 1357 L685 1363 Z" ${base}/>
    <path d="M392 1320 L390 1344 M710 1322 L715 1345"
      fill="none" stroke="#cddce0" stroke-width="7"/>
  `);
  add('feet', 14, `
    <path d="M384 1334 L425 1337 L437 1431 Q436 1472 393 1480
      Q351 1485 345 1460 Q346 1438 360 1415 Z" ${base}/>
    <path d="M683 1345 L723 1331 L741 1407 Q774 1440 779 1460
      Q778 1483 735 1480 Q694 1478 688 1451 Z" ${base}/>
    <path d="M371 1447 Q387 1436 404 1443 M724 1443 Q744 1438 757 1452"
      fill="none" stroke="#bcd0d6" stroke-width="7"/>
  `);
  add('heels', 15, `
    <path d="M426 1407 L443 1417 L443 1447 L423 1455
      L417 1431 Z" ${base}/>
    <path d="M678 1415 L694 1407 L703 1436 L696 1455
      L678 1447 Z" ${base}/>
  `);
  add('waist', 16, `
    <path d="M409 463 Q492 484 577 458 L566 529
      L589 600 Q613 649 607 692 Q563 708 499 739
      Q439 711 388 692 Q382 650 405 600 L425 530 Z" ${base}/>
    <path d="M432 540 Q497 553 562 536" fill="none" stroke="#7c96a4" stroke-width="4"/>
  `);
  add('chest', 17, `
    <path d="M425 316 Q459 301 489 312 Q526 299 565 313
      L606 369 L579 481 Q496 501 410 482 L386 373 Z" ${base}/>
    <path d="M428 354 Q456 338 477 351 M518 350 Q541 339 567 353"
      fill="none" stroke="#d6e2e3" stroke-width="9" opacity=".7"/>
  `);
  add('shoulders', 18, `
    <path d="M424 315 Q366 301 342 333 Q320 357 316 390
      L352 428 Q396 411 413 370 Z" ${base}/>
    <path d="M562 311 Q613 308 633 344 Q645 364 649 400
      L611 424 Q573 396 568 359 Z" ${base}/>
    <path d="M346 351 Q363 327 392 333 M592 332 Q620 340 624 367"
      fill="none" stroke="#d3e1e4" stroke-width="9"/>
  `);
  add('arms', 19, `
    <path d="M325 374 Q354 365 377 396 Q357 452 319 492
      L287 523 L255 495 Q292 447 306 410 Z" ${base}/>
    <path d="M235 421 L279 423 Q282 465 296 492 L288 516
      L255 536 Q231 511 230 475 Z" ${base}/>
    <path d="M610 387 Q636 372 650 400 Q667 449 679 502
      L646 540 L615 504 Q595 451 598 415 Z" ${base}/>
    <path d="M650 550 L684 534 Q705 576 725 653
      L689 674 Q659 627 644 580 Z" ${base}/>
    <path d="M234 385 L268 385 L279 432
      Q257 455 232 436 Z" ${skin}/>
    <path d="M689 661 Q705 650 724 654 L743 703
      L714 718 L701 704 Z" ${skin}/>
    <path d="M329 420 L302 467 M248 439 L247 482
      M630 424 L647 482 M671 577 L702 641"
      fill="none" stroke="#c4d7dd" stroke-width="9"/>
    <path d="M241 407 L241 428 M704 671 L716 696"
      fill="none" stroke="#ffd6a8" stroke-width="6"/>
  `);
  add('elbows', 20, `
    <path d="M256 493 Q272 508 294 494 L310 510
      Q297 539 265 546 Q247 534 243 517 Z" ${base}/>
    <path d="M644 504 Q661 516 680 501 L696 543
      Q680 563 652 560 L638 534 Z" ${base}/>
    <path d="M258 523 Q276 530 290 519 M654 535 Q673 543 687 532"
      fill="none" stroke="#708995" stroke-width="4"/>
  `);
  add('wrists', 21, `
    <path d="M234 354 L268 354 L270 396
      Q250 402 233 395 Z" ${skin}/>
    <path d="M711 704 L740 692 L751 728 L721 742 Z" ${skin}/>
    <path d="M241 391 L263 391 M723 710 L736 705"
      fill="none" stroke="#b97852" stroke-width="3"/>
  `);
  add('hands', 22, `
    <path d="M232 359 Q221 349 212 332 L207 307
      Q218 292 239 289 Q259 281 274 296 L279 320
      Q274 343 263 354 L265 370 Q249 380 233 370 Z" ${skin}/>
    <path d="M716 729 Q733 717 749 726 L759 756 L774 791
      L767 817 L734 818 L725 800 Q714 805 710 793
      L710 762 Z" ${skin}/>
    <path d="M222 321 Q240 304 257 305 M236 343 Q237 325 254 316
      M724 754 Q720 774 725 788 M742 780 L749 795"
      fill="none" stroke="#c1855e" stroke-width="3"/>
    <path d="M216 314 L225 337 M720 746 L718 766"
      fill="none" stroke="#ffcf9e" stroke-width="5"/>
  `);
  add('fingers', 23, `
    <path d="M211 323 L178 282 Q170 273 176 268
      Q183 264 190 273 L216 300 L222 309 Z" ${skin}/>
    <path d="M221 307 L194 253 Q187 238 195 236
      Q202 234 208 247 L235 292 L237 303 Z" ${skin}/>
    <path d="M236 299 L215 237 Q211 225 217 222
      Q225 219 230 231 L252 287 L251 298 Z" ${skin}/>
    <path d="M252 297 L246 235 Q245 223 252 223
      Q259 223 262 235 L273 294 L270 307 Z" ${skin}/>
    <path d="M271 311 Q278 288 294 277 Q305 270 310 276
      Q310 281 303 286 L290 312 Q284 335 270 339
      L263 330 Z" ${skin}/>
    <path d="M738 799 Q743 804 738 820 L729 835
      Q723 843 728 847 Q733 850 740 842 L750 828
      L740 849 Q735 858 741 861 Q747 863 752 854
      L759 841 L754 858 Q752 866 758 866 Q764 863 767 853
      L774 831 L773 804 L762 797 Z" ${skin}/>
    <path d="M718 786 L720 814 Q720 826 726 827
      Q733 826 733 816 L733 799 Z" ${skin}/>
    <path d="M216 297 L224 307 M235 288 L239 301
      M254 286 L256 299 M752 808 L750 828 M763 810 L759 841"
      fill="none" stroke="#bf7f57" stroke-width="2.5"/>
    <path d="M721 812 Q725 810 729 813 L729 818 L723 819 Z"
      fill="#f8cba8" stroke="#bc7e57" stroke-width="1.5"/>
  `);
  add('neck', 24, `
    <path d="M457 251 L520 237 L523 285 Q532 300 552 306
      L533 334 L475 350 L438 317 Q461 304 461 286 Z" ${skin}/>
    <path d="M458 265 Q490 289 520 260 L521 281
      Q490 310 464 295 Z" fill="#bf7750" opacity=".6"/>
    <path d="M471 294 L474 311" fill="none" stroke="#ffd09f" stroke-width="5"/>
  `);
  add('head', 25, `
    <path d="M460 112 Q489 91 518 118 Q543 141 546 186
      L537 235 Q529 262 503 275 Q477 290 452 277
      Q426 265 410 239 L393 198 Q408 157 439 131 Z" ${skin}/>
    <path d="M404 195 Q411 231 429 251 Q442 269 463 277
      Q427 270 414 246 L396 204 Z" fill="#ffd09d"/>
    <path d="M531 169 L538 186 L531 228 Q521 255 500 269
      Q525 263 534 242 L541 211 Z" fill="#bd774f" opacity=".55"/>
  `);
  add('jaw', 26, `
    <path d="M413 236 Q426 257 452 272 Q479 290 502 272
      Q521 261 531 242 L527 256 Q517 274 499 282
      Q478 295 453 282 Q428 271 420 256 Z"
      fill="#df9e6c" stroke="#95573a" stroke-width="2.8"/>
    <path d="M428 256 L449 272" fill="none" stroke="#f9c795" stroke-width="4"/>
  `);
  add('chin', 27, `
    <path d="M455 263 Q475 258 496 261 L497 274
      Q478 290 459 275 Z" fill="#efb584"/>
    <path d="M465 269 Q477 272 487 267" fill="none" stroke="#ce885d" stroke-width="3"/>
    <path d="M468 280 Q479 284 487 278" fill="none" stroke="#ffd4a5" stroke-width="3"/>
  `);
  add('forehead', 28, `
    <path d="M421 160 Q438 131 462 117 Q486 101 507 126
      L518 147 Q491 136 470 146 Q444 145 421 160 Z"
      fill="#efb180"/>
    <path d="M462 129 Q479 117 492 126" fill="none" stroke="#ffd09c" stroke-width="5"/>
  `);
  add('ears', 29, `
    <path d="M399 194 Q387 187 385 199 Q384 216 397 228
      L410 226 Z" ${skin}/>
    <path d="M537 165 Q552 150 560 167 Q565 181 554 199
      Q547 212 536 209 L531 191 Z" ${skin}/>
    <path d="M393 204 L399 215 M547 172 Q557 162 553 178
      L543 190 L548 194" fill="none" stroke="#b5744e" stroke-width="3.5"/>
    <path d="M540 187 L539 201" fill="none" stroke="#ffd4a1" stroke-width="3"/>
  `);
  add('cheeks', 30, `
    <ellipse cx="425" cy="222" rx="23" ry="15" transform="rotate(-15 425 222)" fill="url(#pulse-blush)"/>
    <ellipse cx="513" cy="212" rx="23" ry="17" fill="url(#pulse-blush)"/>
    <path d="M412 218 Q422 212 429 215 M506 207 Q516 202 523 205"
      fill="none" stroke="#ffd4a1" stroke-width="4"/>
  `);
  add('eyes', 31, `
    <path d="M404 169 Q418 154 440 155 L443 162 Q421 161 408 175 Z
      M468 149 Q488 135 508 141 L513 148 Q487 143 470 156 Z" fill="#583021"/>
    <path d="M405 191 Q419 169 441 183 Q441 201 424 205
      Q413 207 405 191 Z M474 176 Q490 156 514 169
      Q512 189 495 192 Q481 194 474 176 Z"
      fill="#fffdf1" stroke="#71442f" stroke-width="3"/>
    <ellipse cx="425" cy="189" rx="12" ry="15" transform="rotate(-10 425 189)"
      fill="#269398" stroke="#244950" stroke-width="2"/>
    <ellipse cx="495" cy="176" rx="12" ry="15" transform="rotate(-10 495 176)"
      fill="#269398" stroke="#244950" stroke-width="2"/>
    <ellipse cx="426" cy="189" rx="6" ry="10" fill="#1c333a"/>
    <ellipse cx="496" cy="176" rx="6" ry="10" fill="#1c333a"/>
    <circle cx="430" cy="182" r="4.5" fill="#fff"/>
    <circle cx="500" cy="169" r="4.5" fill="#fff"/>
    <circle cx="421" cy="196" r="2" fill="#adf1dd"/>
    <circle cx="491" cy="183" r="2" fill="#adf1dd"/>
    <path d="M403 188 Q419 172 441 183 M473 175 Q490 159 515 168
      M405 187 L400 182 M410 181 L406 176 M511 167 L516 160 M515 170 L520 165"
      fill="none" stroke="#442c28" stroke-width="3.5"/>
  `);
  add('nose', 32, `
    <path d="M456 183 Q457 197 450 208 Q446 216 456 218
      Q466 220 473 212 Q474 208 466 207"
      fill="#e7a573" stroke="#b77850" stroke-width="2.8"/>
    <path d="M458 194 L456 206 Q461 209 465 206"
      fill="none" stroke="#ffdab0" stroke-width="4"/>
    <path d="M450 213 Q455 210 458 213 M466 213 L470 212"
      fill="none" stroke="#985a3b" stroke-width="2.5"/>
  `);
  add('mouth', 33, `
    <path d="M438 236 Q469 241 500 218 Q497 242 477 252
      Q456 264 438 236 Z" fill="#743b36" stroke="#864237" stroke-width="3"/>
    <path d="M442 237 Q471 240 495 223 L492 234
      Q474 247 451 245 Z" fill="#fffdf1"/>
    <path d="M460 250 Q472 242 486 244 Q473 258 460 250 Z" fill="#ef9b8c"/>
    <path d="M434 235 L439 233 M499 217 L503 219" fill="none" stroke="#a76947" stroke-width="2.5"/>
  `);
  add('lips', 34, `
    <path d="M439 234 Q452 235 460 230 L469 232 L477 226
      Q490 224 500 218" fill="none" stroke="#d15157" stroke-width="4"/>
    <path d="M452 252 Q472 266 490 244" fill="none" stroke="#cc5058" stroke-width="5"/>
    <path d="M458 254 Q470 259 478 253" fill="none" stroke="#ffb39e" stroke-width="3"/>
  `);

  add('costume', 40, `
    <path d="M415 317 L455 311 L486 337 L535 311 L572 317
      Q606 353 596 401 L581 466 L562 540 L575 578
      L597 620 Q625 661 624 718 Q653 797 653 895
      L657 993 L665 1052 Q704 1122 708 1189 L626 1205
      Q596 1144 590 1084 L575 1028 Q551 959 531 879
      L506 752 L496 752 L480 877 L464 1015 L453 1069
      Q463 1130 441 1211 L357 1207 Q343 1141 363 1090
      L383 1038 L380 985 Q363 904 352 824 Q335 740 371 665
      L407 594 L426 539 L411 475 L385 399 Q378 349 415 317 Z"
      ${plum}/>
    <path d="M428 320 L484 340 L534 319 L560 337 L589 388
      L576 447 L556 475 L551 537 L563 571
      Q500 591 441 574 L445 540 L435 478 L414 437 L400 379 Z"
      fill="url(#pulse-ivory)" stroke="#aaa3a0" stroke-width="3"/>
    <path d="M416 432 Q490 459 577 428 L569 454
      Q508 441 440 469 Z" fill="#d3cec9" opacity=".6"/>
    <path d="M453 492 Q501 479 551 489 L545 520
      Q501 503 447 521 Z" fill="#fffaf0" opacity=".8"/>
    <path d="M428 325 L401 357 L411 417 L438 482 L451 539 L444 573
      M548 324 L578 354 L589 390 L578 441 L558 481 L552 539 L561 571"
      fill="none" stroke="#f47470" stroke-width="7"/>
    <path d="M416 317 Q375 297 349 321 Q327 341 319 380
      L301 424 L280 462 L253 495 L266 531 Q290 535 315 505
      Q354 465 382 402 L403 364 Z" ${plum}/>
    <path d="M421 319 Q382 304 357 325 Q335 347 328 381
      L312 409 L345 424 L365 384 Q387 363 409 359 Z" ${silver}/>
    <path d="M403 316 L414 318 Q414 372 384 414"
      fill="none" stroke="#747c86" stroke-width="12"/>
    <path d="M403 316 L414 318 Q414 371 384 412"
      fill="none" stroke="#e4e6e4" stroke-width="7"/>
    <path d="M360 332 Q343 350 337 375 M335 391 L325 407"
      fill="none" stroke="#fffdf4" stroke-width="5"/>
    <path d="M239 434 Q257 448 279 431 Q280 465 296 492
      L291 520 Q279 540 264 545 Q236 532 231 484 Z" ${plum}/>
    <path d="M245 441 Q263 449 278 436 L286 479
      Q297 503 287 517 L269 534 Q253 515 250 489 Z" ${silver}/>
    <path d="M243 445 L246 486 Q250 519 264 543"
      fill="none" stroke="#f17470" stroke-width="6"/>
    <path d="M567 317 Q611 315 629 346 Q644 371 649 412
      L668 479 L679 516 L668 548 L645 541
      Q617 496 607 454 L592 398 L575 365 Z" ${plum}/>
    <path d="M568 321 Q606 320 623 350 Q637 376 641 411
      L651 443 L620 454 L607 408 Q596 371 580 363 Z" ${silver}/>
    <path d="M597 338 Q620 352 627 386 L630 410"
      fill="none" stroke="#fffdf4" stroke-width="5"/>
    <path d="M644 504 Q661 516 680 501 L696 543
      Q680 563 652 560 L638 534 Z" ${plum}/>
    <path d="M647 537 Q671 547 684 532 L701 567
      L723 650 L689 677 Q657 633 646 582 Z" ${plum}/>
    <path d="M673 577 Q689 575 699 566 L725 653 L689 677
      Q670 647 664 620 Z" ${silver}/>
    <path d="M681 590 L707 650" fill="none" stroke="#fffdf4" stroke-width="6"/>
    <path d="M650 550 Q666 555 681 546 M654 560 Q670 565 686 554"
      fill="none" stroke="#8f4a70" stroke-width="5"/>
    <path d="M410 611 L435 625 Q385 699 376 756
      Q361 814 384 920 L405 995 L397 1037
      Q370 1096 371 1147 L379 1199 L359 1200
      Q344 1140 365 1087 L383 1038 L380 985
      Q363 904 352 824 Q335 741 371 665 Z" ${silver}/>
    <path d="M574 615 L598 617 Q634 674 643 752 L653 895
      L657 993 L665 1052 Q704 1122 708 1189 L687 1195
      Q688 1130 652 1060 L636 1018 L635 934
      Q632 823 616 755 Q605 679 574 615 Z" ${silver}/>
    <path d="M434 625 Q386 699 377 758 Q363 816 386 920
      L405 995 L397 1037 Q370 1097 372 1148 L379 1199
      M574 619 Q607 682 620 756 Q636 841 635 935 L636 1018
      L652 1060 Q687 1130 687 1194"
      fill="none" stroke="#f97c75" stroke-width="7"/>
    <path d="M407 718 Q391 750 392 790 Q393 865 419 930
      L430 878 Q406 793 432 748 Z
      M563 735 Q586 785 590 844 L615 937
      Q611 831 595 782 Z" fill="#8a456a" opacity=".55"/>
    <path d="M400 1005 Q423 997 444 1007 M406 1030 Q423 1035 440 1029
      M590 1008 Q612 999 638 1009 M605 1032 Q624 1037 644 1031"
      fill="none" stroke="#522f48" stroke-width="3" opacity=".6"/>
    <path d="M383 1092 Q373 1136 389 1177 M646 1090 Q666 1129 671 1170"
      fill="none" stroke="#84466a" stroke-width="10" opacity=".65"/>
    <path d="M425 674 Q458 695 489 727 M580 673 Q540 693 515 727"
      fill="none" stroke="#4b2942" stroke-width="3"/>
    <path d="M452 393 L480 393 L490 402 L500 368 L512 421
      L521 387 L529 397 L550 397"
      fill="none" stroke="#c64950" stroke-width="8"/>
    <path d="M452 392 L480 392 L490 401 L500 367 L512 420
      L521 386 L529 396 L550 396"
      fill="none" stroke="#ff8077" stroke-width="4"/>
  `);

  add('boots', 41, `
    <path d="M354 1183 Q392 1209 447 1185 L451 1212
      L437 1314 L442 1344 L434 1370 L447 1420 L443 1467
      Q418 1496 374 1495 Q341 1492 340 1471
      Q341 1447 359 1422 L381 1369 L377 1342 L382 1313
      L359 1233 Z" ${plum}/>
    <path d="M620 1183 Q658 1207 711 1181 L725 1220
      L724 1305 L737 1341 L729 1367 L752 1425
      Q781 1443 785 1471 Q785 1496 742 1495
      Q703 1496 688 1475 L680 1424 L681 1370 L671 1342
      L676 1314 L640 1237 Z" ${plum}/>
    <path d="M374 1198 Q406 1208 435 1199 L425 1307 L432 1340
      L422 1366 L432 1429 L428 1467 Q399 1485 351 1471
      L368 1433 L389 1368 L386 1342 L392 1314 Z" ${silver}/>
    <path d="M642 1198 Q673 1207 701 1196 L710 1306 L724 1340
      L715 1367 L737 1430 L774 1469 Q732 1487 702 1468
      L692 1423 L694 1367 L684 1343 L690 1314 Z" ${silver}/>
    <path d="M372 1218 L391 1314 L385 1342 L390 1368
      L369 1433 M436 1216 L425 1306 L432 1340 L422 1366 L433 1430
      M643 1217 L690 1314 L684 1343 L694 1367 L692 1423
      M703 1215 L710 1306 L724 1340 L715 1367 L737 1430"
      fill="none" stroke="#f06d6b" stroke-width="6"/>
    <path d="M398 1211 L407 1307 L401 1338 L407 1368 L391 1421
      M670 1211 L704 1310 L700 1338 L709 1367 L720 1419"
      fill="none" stroke="#fffdf6" stroke-width="7" opacity=".8"/>
    <path d="M350 1180 Q395 1205 450 1180 L447 1204
      Q399 1229 353 1205 Z M618 1180 Q664 1202 714 1177
      L720 1204 Q672 1227 626 1207 Z" ${silver}/>
    <path d="M356 1185 Q396 1208 446 1186 M624 1185 Q666 1208 712 1183"
      fill="none" stroke="#f8faf6" stroke-width="4"/>
    <path d="M383 1340 Q407 1324 434 1341 L418 1352
      L428 1359 Q406 1353 389 1366
      M682 1343 Q706 1328 729 1343 L713 1353 L726 1360"
      fill="none" stroke="#8e959d" stroke-width="4"/>
    <path d="M355 1450 Q388 1436 427 1448 L437 1468
      Q419 1490 375 1487 Q345 1484 344 1470 Z
      M700 1450 Q737 1435 770 1451 L782 1470
      Q778 1488 741 1487 Q707 1489 697 1471 Z" ${coral}/>
    <path d="M360 1450 Q390 1444 419 1452 M709 1451 Q735 1444 762 1453"
      fill="none" stroke="#ffb0a0" stroke-width="4"/>
    <path d="M344 1478 Q386 1499 436 1475 L435 1490
      Q390 1514 343 1493 Z M697 1478 Q739 1499 783 1478
      L783 1493 Q741 1513 698 1494 Z"
      fill="#5e5c64" stroke="#36323d" stroke-width="3"/>
    <path d="M347 1483 Q388 1501 432 1481 M701 1483 Q741 1501 779 1483"
      fill="none" stroke="#b6b5b7" stroke-width="4"/>
    <path d="M441 1416 L453 1411 L453 1442 L443 1450
      M679 1416 L669 1411 L669 1442 L683 1450"
      fill="#727079" stroke="#36323d" stroke-width="3"/>
  `);
  add('belt', 42, `
    <path d="M413 564 Q493 591 577 564 L593 598
      Q498 636 400 598 Z" ${coral}/>
    <path d="M413 571 Q494 599 579 571 M406 593 Q498 627 588 594"
      fill="none" stroke="#ffa08d" stroke-width="4"/>
    <path d="M453 580 L446 611 L458 615 L463 584 Z
      M548 585 L553 615 L565 611 L559 580 Z" ${coral}/>
    <path d="M483 579 L523 579 Q533 579 533 589 L533 615
      Q533 622 524 622 L482 622 Q475 622 475 615 L475 588
      Q475 579 483 579 Z" ${silver}/>
    <path d="M484 587 L524 587 L524 614 L484 614 Z"
      fill="#adb1b7" stroke="#757a83" stroke-width="2"/>
    <path d="M490 590 L490 610" stroke="#f5f4ef" stroke-width="5"/>
  `);
  add('scarf', 43, `
    <path d="M438 287 Q442 272 465 278 Q499 291 526 271
      Q547 269 550 287 L544 308 Q562 311 569 300
      Q591 304 596 333 Q602 361 618 378
      Q582 371 559 350 L548 326 Q519 347 476 336
      Q447 330 433 311 Z" ${coral}/>
    <path d="M444 284 Q474 307 528 283 Q538 279 543 285
      Q532 311 496 313 Q463 314 443 298 Z" fill="#c6434e"/>
    <path d="M442 302 Q486 334 543 304 L541 315
      Q493 347 447 316 Z" fill="#ff8174"/>
    <path d="M554 304 Q572 315 580 342 L605 369
      Q580 360 565 341 Z" fill="#ff9883"/>
    <path d="M559 316 Q561 333 572 348" fill="none" stroke="#b9404b" stroke-width="4"/>
    <path d="M450 308 Q478 326 501 324" fill="none" stroke="#ffae94" stroke-width="4"/>
  `);
  add('earrings', 44, `
    <ellipse cx="399" cy="224" rx="6" ry="8" ${silver}/>
    <ellipse cx="399" cy="224" rx="3.5" ry="5.5" fill="#35abb2"/>
    <ellipse cx="544" cy="202" rx="8" ry="10" transform="rotate(13 544 202)" ${silver}/>
    <ellipse cx="544" cy="202" rx="5" ry="7" fill="#258f9c"/>
    <circle cx="542.5" cy="199" r="2" fill="#c8fff0"/>
  `);
  add('glasses', 45, `
    <path d="M390 190 L399 187 M518 169 L540 161"
      fill="none" stroke="#68365e" stroke-width="5"/>
    <path d="M397 181 Q415 169 441 175 Q449 178 448 187
      L445 207 Q427 219 408 213 Q400 211 398 202 Z
      M467 169 Q487 154 512 157 Q522 159 521 170
      L517 190 Q500 203 480 198 Q471 197 469 188 Z"
      fill="#d0eff0" fill-opacity=".07" stroke="#68365e" stroke-width="5"/>
    <path d="M397 181 Q415 169 441 175 Q449 178 448 187
      L445 207 Q427 219 408 213 Q400 211 398 202 Z
      M467 169 Q487 154 512 157 Q522 159 521 170
      L517 190 Q500 203 480 198 Q471 197 469 188 Z"
      fill="none" stroke="#ad6a9e" stroke-width="2"/>
    <path d="M448 184 Q456 175 468 180" fill="none" stroke="#71365f" stroke-width="5"/>
    <path d="M449 182 Q457 176 467 178" fill="none" stroke="#bb7aac" stroke-width="2"/>
    <path d="M403 184 L413 178 M474 172 L484 164"
      fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="3"/>
  `);
  add('armband', 46, `
    <path d="M608 455 Q636 455 657 440 L667 477
      Q642 494 617 494 Z" ${silver}/>
    <path d="M612 463 Q636 463 658 449 L664 473
      Q642 487 619 486 Z" ${coral}/>
    <path d="M621 466 L625 480" stroke="#ffaf99" stroke-width="4"/>
  `);
  add('badge', 47, `
    <path d="M544 359 Q560 354 574 361 L576 380
      Q572 394 561 401 Q546 394 542 382 Z" ${silver}/>
    <path d="M548 364 Q560 360 570 365 L571 379
      Q569 389 561 394 Q550 388 547 380 Z"
      fill="#32969f" stroke="#426c79" stroke-width="2"/>
    <path d="M559 362 L562 393 M547 376 L572 376"
      stroke="#e8f8ee" stroke-width="3"/>
    <path d="M550 366 L555 365" stroke="#9fe9df" stroke-width="3"/>
  `);
  add('hair-clip', 48, `
    <path d="M540 99 L551 106 L539 135 Q533 143 526 135
      L522 129 Z" ${silver}/>
    <path d="M540 104 L546 108 L535 132 L528 129 Z"
      fill="#f57770" stroke="#b95455" stroke-width="1.5"/>
    <path d="M541 107 L532 125" stroke="#ffb9a2" stroke-width="2"/>
  `);
  add('ring', 49, `
    <path d="M751 808 Q760 803 770 807 L770 815
      Q760 812 751 816 Z" ${silver}/>
    <path d="M754 808 L767 808" stroke="#fdfdf4" stroke-width="2"/>
  `);
  add('watch', 50, `
    <path d="M710 718 L742 705 L751 724 L718 740 Z"
      fill="#713958" stroke="#422c44" stroke-width="3"/>
    <path d="M714 721 L737 712 M720 735 L740 727"
      fill="none" stroke="#a66382" stroke-width="3"/>
    <ellipse cx="744" cy="718" rx="12" ry="18" transform="rotate(-20 744 718)" ${silver}/>
    <ellipse cx="744" cy="718" rx="8" ry="14" transform="rotate(-20 744 718)"
      fill="#238f9b" stroke="#326571" stroke-width="2"/>
    <path d="M741 709 L744 718 L750 721" fill="none" stroke="#e1fff2" stroke-width="2"/>
    <circle cx="744" cy="718" r="2" fill="#e8fff6"/>
    <path d="M739 708 L747 716" stroke="#7de7d4" stroke-width="2"/>
  `);
  add('bracelet', 51, `
    <path d="M230 367 Q250 378 269 365 L270 385
      Q250 398 229 385 Z" ${silver}/>
    <path d="M232 373 Q250 383 267 372 L267 381
      Q249 391 232 381 Z" fill="#ef7369" stroke="#ac5955" stroke-width="1.5"/>
    <path d="M242 378 L242 387 M258 379 L258 386"
      stroke="#ecede8" stroke-width="5"/>
    <path d="M232 369 Q250 380 268 367" fill="none" stroke="#fffdf2" stroke-width="3"/>
  `);

  const regions = {
    head: [ellipse(475, 193, 77, 99, -12)],
    hair: [ellipse(448, 114, 93, 67, -15), ellipse(606, 177, 67, 139, -17)],
    forehead: [ellipse(469, 139, 43, 19, -12)],
    eyes: [ellipse(424, 189, 22, 17, -10), ellipse(495, 176, 23, 18, -10)],
    ears: [ellipse(396, 211, 11, 18, -20), ellipse(547, 185, 13, 25, 15)],
    nose: [ellipse(459, 205, 16, 19, -8)],
    cheeks: [ellipse(425, 222, 22, 15, -15), ellipse(514, 212, 21, 15, -15)],
    mouth: [ellipse(469, 240, 32, 16, -15)],
    lips: [ellipse(470, 232, 30, 5, -17), ellipse(472, 253, 20, 6, -10)],
    chin: [ellipse(476, 274, 23, 12, -7)],
    jaw: [ellipse(432, 259, 11, 25, -45), ellipse(514, 266, 10, 22, 38)],
    neck: [ellipse(490, 296, 30, 29)],
    shoulders: [ellipse(370, 358, 44, 47, 22), ellipse(610, 361, 31, 47, -15)],
    chest: [ellipse(500, 405, 78, 58)],
    waist: [ellipse(499, 538, 56, 26)],
    arms: [
      ellipse(330, 444, 27, 59, 30), ellipse(253, 462, 23, 63, -7),
      ellipse(638, 462, 25, 59, -17), ellipse(698, 639, 23, 66, -24)
    ],
    elbows: [ellipse(278, 522, 28, 21, -22), ellipse(668, 535, 25, 24, -17)],
    wrists: [ellipse(250, 378, 20, 20), ellipse(733, 719, 20, 22, -22)],
    hands: [ellipse(245, 330, 29, 35), ellipse(742, 771, 25, 41, -12)],
    fingers: [
      ellipse(195, 291, 10, 28, -43), ellipse(213, 273, 10, 39, -26),
      ellipse(235, 261, 10, 42, -19), ellipse(260, 263, 10, 41, -7),
      ellipse(290, 303, 11, 35, 32), ellipse(751, 833, 20, 34, 18)
    ],
    legs: [ellipse(405, 1181, 34, 127), ellipse(666, 1181, 34, 127, -15)],
    thighs: [ellipse(418, 854, 49, 111, -4), ellipse(589, 854, 47, 111, -10)],
    knees: [ellipse(423, 1011, 41, 43), ellipse(619, 1011, 41, 43, -12)],
    ankles: [ellipse(406, 1325, 29, 38), ellipse(701, 1325, 29, 38, -10)],
    feet: [ellipse(393, 1447, 45, 41), ellipse(735, 1447, 45, 41, -15)],
    heels: [ellipse(436, 1431, 12, 22), ellipse(686, 1431, 12, 22)],
    costume: [ellipse(497, 457, 64, 99), ellipse(429, 846, 34, 86), ellipse(587, 846, 34, 86)],
    belt: [ellipse(499, 598, 90, 26)],
    boots: [
      ellipse(404, 1300, 39, 99), ellipse(680, 1300, 38, 100, -12),
      ellipse(391, 1454, 48, 40), ellipse(738, 1455, 47, 40)
    ],
    earrings: [ellipse(399, 224, 8, 10), ellipse(544, 202, 10, 12)],
    glasses: [ellipse(422, 194, 28, 23, -12), ellipse(495, 179, 29, 23, -12)],
    armband: [ellipse(638, 469, 29, 20, -15)],
    badge: [ellipse(560, 378, 19, 23)],
    'hair-clip': [ellipse(537, 120, 11, 23, 27)],
    scarf: [ellipse(491, 308, 57, 25), ellipse(580, 342, 21, 39, -35)],
    ring: [ellipse(761, 811, 12, 7)],
    watch: [ellipse(744, 718, 15, 20, -20)],
    bracelet: [ellipse(250, 380, 24, 13)]
  };

  // These locations were fitted to Superhero2.png, not copied from the redraw.
  // Covered anatomy is a location beneath the suit, not a claim of visible skin.
  const photoRegions = {
    head: [ellipse(465, 183, 83, 95, -15)],
    hair: [ellipse(448, 132, 93, 76, -23), ellipse(604, 169, 66, 148, -18)],
    forehead: [ellipse(459, 125, 32, 25, -17)],
    eyes: [ellipse(422, 186, 22, 18, -13), ellipse(493, 171, 24, 19, -13)],
    ears: [ellipse(545, 172, 14, 24, 13)],
    nose: [ellipse(454, 203, 17, 20, -9)],
    cheeks: [ellipse(418, 219, 20, 15, -15), ellipse(505, 208, 22, 16, -15)],
    mouth: [ellipse(467, 235, 31, 14, -17)],
    lips: [ellipse(465, 230, 31, 5, -17), ellipse(469, 246, 21, 5, -14)],
    chin: [ellipse(465, 265, 22, 12, -7)],
    jaw: [ellipse(424, 249, 10, 24, -45), ellipse(506, 251, 10, 24, 35)],
    neck: [ellipse(492, 275, 29, 16, -5)],
    shoulders: [ellipse(368, 348, 43, 44, 24), ellipse(610, 365, 32, 49, -17)],
    chest: [ellipse(501, 401, 74, 58)],
    waist: [ellipse(500, 544, 50, 24)],
    arms: [
      ellipse(333, 447, 27, 57, 28), ellipse(257, 456, 23, 62, -8),
      ellipse(633, 482, 26, 60, -17), ellipse(698, 649, 24, 59, -22)
    ],
    elbows: [ellipse(270, 529, 24, 21, -20), ellipse(659, 560, 25, 25, -18)],
    wrists: [ellipse(249, 376, 20, 20), ellipse(734, 720, 20, 22, -24)],
    hands: [ellipse(246, 326, 29, 35), ellipse(738, 781, 23, 43, -9)],
    fingers: [
      ellipse(196, 291, 10, 28, -44), ellipse(211, 270, 10, 39, -27),
      ellipse(232, 257, 10, 39, -19), ellipse(254, 258, 10, 37, -8),
      ellipse(291, 301, 11, 34, 31), ellipse(746, 843, 20, 29, 20)
    ],
    legs: [ellipse(405, 1121, 42, 64), ellipse(654, 1121, 44, 66, -18)],
    thighs: [ellipse(424, 847, 50, 116, -2), ellipse(585, 849, 49, 118, -11)],
    knees: [ellipse(421, 1011, 40, 46, 9), ellipse(618, 1013, 41, 47, -15)],
    ankles: [ellipse(408, 1336, 29, 30), ellipse(702, 1336, 30, 32, -8)],
    feet: [ellipse(387, 1454, 45, 40, 8), ellipse(739, 1454, 47, 40, -14)],
    heels: [ellipse(444, 1420, 12, 27), ellipse(677, 1424, 12, 27)],
    costume: [ellipse(501, 460, 56, 99), ellipse(425, 851, 35, 84), ellipse(583, 851, 35, 84)],
    belt: [ellipse(499, 594, 92, 28)],
    boots: [
      ellipse(402, 1280, 40, 87), ellipse(681, 1280, 38, 87, -12),
      ellipse(388, 1451, 47, 44), ellipse(738, 1451, 47, 44, -12)
    ],
    earrings: [ellipse(543, 201, 9, 10)],
    glasses: [ellipse(416, 192, 30, 23, -12), ellipse(488, 176, 30, 24, -12)],
    armband: [ellipse(627, 470, 33, 21, -16)],
    badge: [ellipse(559, 377, 20, 23, -6)],
    'hair-clip': [ellipse(538, 112, 12, 22, 28)],
    scarf: [ellipse(492, 302, 61, 28), ellipse(581, 332, 23, 43, -34)],
    ring: [ellipse(758, 815, 12, 7)],
    watch: [ellipse(744, 717, 13, 18, -20), ellipse(731, 725, 21, 12, -22)],
    bracelet: [ellipse(248, 377, 25, 13)]
  };

  window.PulseDemoArt = {
    width: 1024, height: 1536, defs,
    layers: layers.sort((a, b) => a.order - b.order),
    regions, photoRegions
  };
})();

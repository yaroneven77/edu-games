/* An original, independently drawn SVG character. No source-image pixels are used. */
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
  const skin = 'fill="url(#beacon-skin)" stroke="#70452e" stroke-width="4"';
  const base = 'fill="url(#beacon-base)" stroke="#294957" stroke-width="4"';
  const cloth = 'stroke="#102e40" stroke-width="5"';
  const gold = 'fill="url(#beacon-gold)" stroke="#9c6826" stroke-width="3"';

  const defs = `<defs>
    <linearGradient id="beacon-skin" x1="0" y1="0" x2="1" y2=".65">
      <stop stop-color="#edb47b"/><stop offset=".52" stop-color="#d9925c"/>
      <stop offset="1" stop-color="#bd7045"/>
    </linearGradient>
    <linearGradient id="beacon-base" x1="0" y1="0" x2="1" y2=".3">
      <stop stop-color="#92b8bf"/><stop offset=".55" stop-color="#729ba7"/>
      <stop offset="1" stop-color="#527b8e"/>
    </linearGradient>
    <linearGradient id="beacon-teal" x1="0" y1="0" x2="1" y2=".7">
      <stop stop-color="#269c9e"/><stop offset=".48" stop-color="#137d88"/>
      <stop offset="1" stop-color="#0c556c"/>
    </linearGradient>
    <linearGradient id="beacon-navy" x1="0" y1="0" x2="1" y2=".7">
      <stop stop-color="#285771"/><stop offset=".52" stop-color="#183f59"/>
      <stop offset="1" stop-color="#102c43"/>
    </linearGradient>
    <linearGradient id="beacon-gold" x1="0" y1="0" x2="1" y2=".8">
      <stop stop-color="#fff0b6"/><stop offset=".36" stop-color="#f3cc70"/>
      <stop offset=".72" stop-color="#daa345"/><stop offset="1" stop-color="#b47a2e"/>
    </linearGradient>
    <linearGradient id="beacon-cape" x1="0" y1="0" x2="1" y2=".15">
      <stop stop-color="#e8ddc5"/><stop offset=".28" stop-color="#fffaf0"/>
      <stop offset=".65" stop-color="#f6efdf"/><stop offset="1" stop-color="#d4c4a5"/>
    </linearGradient>
    <linearGradient id="beacon-hair" x1="0" y1="0" x2=".7" y2="1">
      <stop stop-color="#69432c"/><stop offset=".45" stop-color="#412b21"/>
      <stop offset="1" stop-color="#251f1d"/>
    </linearGradient>
    <radialGradient id="beacon-cheek">
      <stop stop-color="#ef956c" stop-opacity=".62"/><stop offset="1" stop-color="#ef956c" stop-opacity="0"/>
    </radialGradient>
  </defs>`;

  add('cape', 1, `
    <path d="M402 330 Q371 320 329 349 Q280 363 270 417
      C255 608 222 832 183 1049 L128 1231
      Q155 1260 192 1252 Q241 1224 294 1249
      Q347 1273 400 1255 Q466 1293 518 1270
      Q570 1238 627 1258 Q682 1240 723 1268
      Q760 1266 794 1242 L759 998 Q723 702 716 440
      Q715 364 659 350 Q617 319 587 330 L511 373 Z"
      fill="url(#beacon-cape)" stroke="#8b775c" stroke-width="5"/>
    <path d="M313 385 Q298 679 242 923 L169 1236 Q182 1244 192 1240
      L276 937 Q332 676 343 386 Z" fill="#fffdf5"/>
    <path d="M374 359 Q336 704 300 1012 L272 1235
      Q292 1237 310 1246 L354 1008 Q393 653 405 345 Z"
      fill="#cabda3" opacity=".62"/>
    <path d="M451 380 Q456 838 427 1259 Q452 1273 477 1267
      Q491 837 482 392 Z" fill="#e1d4bb"/>
    <path d="M548 387 Q533 831 562 1248 L590 1247
      Q574 820 580 367 Z" fill="#fffdf5"/>
    <path d="M638 374 Q655 809 720 1254 L744 1249
      Q688 804 680 392 Z" fill="#baaa8c" opacity=".58"/>
    <path d="M274 414 Q255 713 183 1049 L128 1231
      Q155 1260 192 1252 Q241 1224 294 1249
      Q347 1273 400 1255 Q466 1293 518 1270
      Q570 1238 627 1258 Q682 1240 723 1268
      Q760 1266 794 1242 L759 998 Q724 704 716 440"
      fill="none" stroke="#b88639" stroke-width="14"/>
    <path d="M274 416 Q255 713 183 1049 L137 1227
      M199 1247 Q242 1219 296 1244 Q345 1266 400 1250
      Q465 1288 516 1265 M730 1260 Q760 1257 786 1237
      L752 999 Q718 702 710 442"
      fill="none" stroke="#f7d58b" stroke-width="7"/>
    <path d="M402 330 Q367 328 339 352 Q298 355 281 384
      Q341 361 399 397 L431 349 Z
      M587 330 Q625 328 652 352 Q698 362 708 387
      Q650 363 592 397 L564 350 Z"
      fill="#fffaf0" stroke="#b3a58c" stroke-width="3"/>
    <path d="M315 365 Q356 354 397 381 M626 356 Q667 355 691 378"
      fill="none" stroke="#ddcfb6" stroke-width="5"/>
    <ellipse cx="408" cy="378" rx="20" ry="17" ${gold}/>
    <ellipse cx="590" cy="378" rx="20" ry="17" ${gold}/>
    <path d="M398 374 Q408 362 420 376 M580 374 Q590 362 602 376"
      fill="none" stroke="#fff1bd" stroke-width="4"/>
  `);

  // The earned anatomy has a neutral, fully covered mannequin foundation.
  // Each limb segment belongs to only one anatomy layer.
  add('legs', 10, `
    <path d="M360 1050 L440 1065 Q420 1191 371 1339
      L302 1329 Q310 1246 327 1173 Z" ${base}/>
    <path d="M565 1066 L647 1051 Q680 1174 685 1330
      L617 1339 Q583 1210 565 1066 Z" ${base}/>
    <path d="M378 1084 Q362 1205 331 1309 M629 1084 Q651 1210 658 1309"
      fill="none" stroke="#acd1d2" stroke-width="12" opacity=".6"/>
  `);
  add('thighs', 11, `
    <path d="M407 735 Q453 744 501 770
      Q491 860 457 955 L435 1025 L357 1017
      Q345 947 364 861 Z" ${base}/>
    <path d="M501 770 Q552 744 598 735
      Q641 859 647 946 L647 1017 L571 1025
      Q527 921 501 770 Z" ${base}/>
    <path d="M401 785 Q374 906 383 977 M594 785 Q629 908 621 977"
      fill="none" stroke="#a8c9ce" stroke-width="13" opacity=".55"/>
  `);
  add('knees', 12, `
    <path d="M358 994 Q398 978 443 1015 L431 1089
      Q385 1110 350 1073 Z" ${base}/>
    <path d="M565 1015 Q604 979 647 994 L655 1073
      Q617 1110 574 1089 Z" ${base}/>
    <path d="M368 1021 Q397 1005 428 1027 L417 1062
      Q389 1080 363 1058 Z
      M580 1027 Q607 1004 637 1021 L642 1058
      Q617 1080 589 1062 Z" fill="#86adb8"/>
  `);
  add('ankles', 13, `
    <path d="M304 1311 L375 1322 L359 1404 L295 1404 Z" ${base}/>
    <path d="M615 1322 L684 1311 L690 1404 L627 1404 Z" ${base}/>
    <path d="M321 1340 L316 1380 M665 1340 L671 1380"
      fill="none" stroke="#a7c8ce" stroke-width="9"/>
  `);
  add('feet', 14, `
    <path d="M299 1382 Q330 1368 358 1397 L357 1452
      Q326 1485 247 1481 Q226 1479 233 1458
      Q244 1436 267 1420 Z" ${base}/>
    <path d="M629 1397 Q658 1368 688 1382 L720 1420
      Q748 1435 764 1459 Q773 1479 751 1482
      Q675 1487 633 1453 Z" ${base}/>
  `);
  add('heels', 15, `
    <path d="M346 1422 L363 1418 L364 1461 L338 1470
      L329 1456 Z" ${base}/>
    <path d="M626 1418 L643 1422 L660 1456 L650 1470
      L625 1461 Z" ${base}/>
  `);
  add('waist', 16, `
    <path d="M399 539 Q502 566 608 539 L592 646
      Q603 708 609 767 Q570 796 504 813
      Q446 796 394 767 Q403 706 411 646 Z" ${base}/>
    <path d="M420 618 Q506 640 586 618" fill="none" stroke="#608793" stroke-width="5"/>
  `);
  add('chest', 17, `
    <path d="M417 350 Q455 338 497 360 Q546 338 583 350
      L624 434 L605 561 Q555 580 501 572
      Q452 580 399 561 L379 434 Z" ${base}/>
    <path d="M425 411 Q453 395 479 407 M529 407 Q558 395 584 411"
      fill="none" stroke="#b0d0d2" stroke-width="10" opacity=".65"/>
  `);
  add('shoulders', 18, `
    <path d="M420 357 Q359 345 324 375 Q295 405 302 456
      L347 484 Q394 467 411 425 Z" ${base}/>
    <path d="M582 357 Q646 344 679 375 Q709 405 703 456
      L658 484 Q608 467 592 425 Z" ${base}/>
    <path d="M327 393 Q355 369 390 376 M615 376 Q650 369 677 393"
      fill="none" stroke="#b0d0d2" stroke-width="10" opacity=".6"/>
  `);
  add('arms', 19, `
    <path d="M305 434 Q344 438 361 467 L346 539
      Q333 582 305 614 L260 592 Q269 501 305 434 Z" ${base}/>
    <path d="M703 434 Q665 438 647 467 L662 539
      Q675 582 704 614 L748 592 Q739 501 703 434 Z" ${base}/>
    <path d="M261 606 L307 624 Q294 692 263 756 L240 793
      L203 781 Q209 690 240 639 Z" ${base}/>
    <path d="M701 624 L747 606 L769 639 Q800 690 805 781
      L768 793 L745 756 Q714 692 701 624 Z" ${base}/>
    <path d="M303 493 L287 553 M703 493 L721 553
      M253 665 L230 746 M755 665 L779 746"
      fill="none" stroke="#a4c7ce" stroke-width="10" opacity=".65"/>
  `);
  add('elbows', 20, `
    <path d="M265 577 Q289 580 311 607 L302 643
      Q270 647 246 622 Z" ${base}/>
    <path d="M699 607 Q721 580 744 577 L763 622
      Q738 647 707 643 Z" ${base}/>
    <path d="M260 609 L291 626 M717 626 L749 609"
      fill="none" stroke="#4c7282" stroke-width="4"/>
  `);
  add('wrists', 21, `
    <path d="M203 770 L246 784 L236 824 L196 815 Z" ${skin}/>
    <path d="M766 784 L808 770 L816 815 L776 824 Z" ${skin}/>
    <path d="M205 800 L230 806 M786 806 L807 800"
      fill="none" stroke="#a4633f" stroke-width="3"/>
  `);
  add('hands', 22, `
    <path d="M197 807 Q215 804 236 820 L245 846
      L260 875 Q265 890 254 890 Q244 886 237 871
      L232 863 L224 894 L188 889 L182 863 Z" ${skin}/>
    <path d="M776 820 Q797 804 815 807 L828 863
      L822 889 L786 894 L779 863 L774 871
      Q766 886 756 890 Q745 890 750 875 L766 846 Z" ${skin}/>
    <path d="M200 820 Q191 842 194 860 M806 820 Q817 842 815 860"
      fill="none" stroke="#f4bd84" stroke-width="7"/>
    <path d="M228 841 L231 856 M782 841 L779 856"
      fill="none" stroke="#9c5c3b" stroke-width="3"/>
  `);
  add('fingers', 23, `
    <path d="M184 861 Q179 866 182 881 L188 907 Q190 915 197 916
      L208 932 Q214 940 220 935 Q223 930 218 923
      L224 928 Q232 932 235 927 Q238 922 231 914
      L222 901 L224 878 L214 864 Z" ${skin}/>
    <path d="M824 861 Q831 866 827 881 L821 907 Q819 915 812 916
      L801 932 Q795 940 789 935 Q786 930 791 923
      L785 928 Q777 932 774 927 Q771 922 778 914
      L787 901 L785 878 L795 864 Z" ${skin}/>
    <path d="M192 873 L198 900 L218 923 M202 870 L208 897 L231 921
      M816 873 L810 900 L790 923 M806 870 L800 897 L778 921"
      fill="none" stroke="#9d5e3a" stroke-width="3"/>
    <path d="M188 878 L194 897 M820 878 L814 897"
      fill="none" stroke="#f2b27b" stroke-width="4"/>
  `);
  add('neck', 24, `
    <path d="M451 267 L553 267 L556 319
      Q563 335 582 346 L553 383 L501 405
      L446 383 L420 346 Q449 332 450 315 Z" ${skin}/>
    <path d="M451 280 Q499 312 553 279 L550 310
      Q523 338 494 345 L458 320 Z" fill="#a9643f" opacity=".64"/>
    <path d="M464 314 L469 344 M541 316 L533 348"
      fill="none" stroke="#edb47b" stroke-width="5"/>
  `);
  add('head', 25, `
    <path d="M424 157 Q418 112 454 92 Q500 68 551 92
      Q589 108 590 155 L589 222 Q587 261 558 285
      Q535 307 507 308 Q478 307 450 283
      Q427 264 424 223 Z" ${skin}/>
    <path d="M437 148 Q433 199 442 241 Q447 263 463 278
      Q433 265 428 228 L426 161 Z" fill="#f4bd83" opacity=".8"/>
    <path d="M577 165 L583 216 Q581 254 552 280
      L536 295 Q565 285 582 256 Q591 231 589 201 Z"
      fill="#a76340" opacity=".47"/>
  `);
  add('jaw', 26, `
    <path d="M430 236 Q437 263 458 280 L482 299
      Q507 314 530 299 L554 281 Q578 260 584 236
      L577 254 Q571 274 548 292 L530 307
      Q507 320 482 307 L459 292 Q438 277 434 260 Z"
      fill="#cf8954" stroke="#70452e" stroke-width="3"/>
    <path d="M442 265 L460 282 M553 282 L571 263"
      fill="none" stroke="#efb57c" stroke-width="4"/>
  `);
  add('chin', 27, `
    <path d="M478 281 Q505 273 534 281 L530 298
      Q506 316 482 298 Z" fill="#dda16a"/>
    <path d="M489 288 Q506 292 524 287" fill="none" stroke="#b97649" stroke-width="3"/>
    <path d="M494 300 Q507 305 519 300" fill="none" stroke="#efb680" stroke-width="4"/>
  `);
  add('forehead', 28, `
    <path d="M439 147 Q438 116 463 105 Q503 91 549 109
      Q570 120 575 148 Q544 141 508 151 Q472 140 439 147 Z"
      fill="#e9aa71"/>
    <path d="M455 125 Q473 115 487 116" fill="none" stroke="#f4be89" stroke-width="5"/>
  `);
  add('ears', 29, `
    <path d="M428 183 Q412 173 405 188 Q400 204 413 227
      Q421 241 433 233 L434 213 Z" ${skin}/>
    <path d="M589 183 Q605 173 612 188 Q617 204 604 227
      Q596 241 584 233 L583 213 Z" ${skin}/>
    <path d="M421 194 Q409 187 412 202 Q415 213 423 216
      M596 194 Q608 187 605 202 Q602 213 594 216"
      fill="none" stroke="#a7603c" stroke-width="4"/>
    <path d="M422 202 L426 218 M595 202 L591 218"
      fill="none" stroke="#f1b982" stroke-width="3"/>
  `);
  add('cheeks', 30, `
    <ellipse cx="455" cy="231" rx="27" ry="18" fill="url(#beacon-cheek)"/>
    <ellipse cx="561" cy="231" rx="27" ry="18" fill="url(#beacon-cheek)"/>
    <path d="M441 226 Q451 221 459 224 M557 224 Q566 221 575 226"
      fill="none" stroke="#f6c18b" stroke-width="5"/>
    <path d="M442 242 Q447 245 451 244 M566 244 Q572 245 575 241"
      fill="none" stroke="#b77047" stroke-width="2.5"/>
  `);
  add('eyes', 31, `
    <path d="M439 167 Q455 155 479 162 L482 171
      Q457 165 439 174 Z M530 162 Q554 155 573 169
      L572 176 Q553 166 530 172 Z" fill="#38281f"/>
    <path d="M437 192 Q456 169 481 189 Q472 211 451 207 Z
      M531 189 Q554 169 576 192 L562 207 Q541 211 531 189 Z"
      fill="#fff9e9" stroke="#68472f" stroke-width="3"/>
    <ellipse cx="461" cy="191" rx="12" ry="15" fill="#14898e" stroke="#143b41" stroke-width="2"/>
    <ellipse cx="550" cy="191" rx="12" ry="15" fill="#14898e" stroke="#143b41" stroke-width="2"/>
    <ellipse cx="463" cy="192" rx="6" ry="10" fill="#142d34"/>
    <ellipse cx="548" cy="192" rx="6" ry="10" fill="#142d34"/>
    <circle cx="465" cy="184" r="4.5" fill="#fff"/>
    <circle cx="552" cy="184" r="4.5" fill="#fff"/>
    <circle cx="456" cy="198" r="2" fill="#8eede2"/>
    <circle cx="543" cy="198" r="2" fill="#8eede2"/>
    <path d="M437 190 Q457 173 479 189 M533 189 Q554 173 576 190"
      fill="none" stroke="#403023" stroke-width="4"/>
  `);
  add('nose', 32, `
    <path d="M502 193 Q501 208 493 220 Q486 229 495 234
      Q506 239 520 232 Q526 226 516 220 L513 208"
      fill="#dc945b" stroke="#ae6a40" stroke-width="2.8"/>
    <path d="M502 204 L499 220 Q504 223 510 221"
      fill="none" stroke="#f7c38b" stroke-width="5"/>
    <path d="M493 230 Q497 227 500 230 M514 230 Q518 227 521 229"
      fill="none" stroke="#825031" stroke-width="3"/>
  `);
  add('mouth', 33, `
    <path d="M465 252 Q506 265 549 250 Q532 277 508 278
      Q483 278 465 252 Z" fill="#70402c" stroke="#613e2b" stroke-width="3"/>
    <path d="M470 254 Q507 263 543 253 L537 263
      Q507 273 479 263 Z" fill="#fffdf1"/>
    <path d="M489 272 Q508 266 527 272 Q510 281 489 272 Z" fill="#df9276"/>
    <path d="M461 253 L466 249 M548 250 L553 252"
      fill="none" stroke="#8c5334" stroke-width="3"/>
  `);
  add('lips', 34, `
    <path d="M467 250 Q484 252 497 250 L507 252 L517 250
      Q535 251 548 248" fill="none" stroke="#b96e49" stroke-width="3"/>
    <path d="M488 279 Q509 287 529 277" fill="none" stroke="#bc704a" stroke-width="4"/>
    <path d="M496 280 Q509 283 519 280" fill="none" stroke="#f2b486" stroke-width="3"/>
  `);
  add('hair', 35, `
    <path d="M425 183 Q410 166 412 147 Q395 138 400 116
      Q403 126 414 121 Q393 99 410 79 Q407 94 426 91
      Q418 65 442 50 Q435 65 455 64 Q456 43 480 34
      Q469 50 491 48 Q521 22 548 37 Q565 44 568 61
      Q581 58 581 42 Q601 61 591 84 Q610 79 615 67
      Q625 90 605 105 Q620 109 623 100 Q627 122 608 130
      Q614 157 588 182 L583 148 Q579 125 559 119
      Q533 109 514 123 Q489 107 467 118 Q444 129 439 151
      L432 180 Z" fill="url(#beacon-hair)" stroke="#2e241e" stroke-width="4"/>
    <path d="M417 109 Q449 100 471 80 Q502 57 537 72
      Q552 81 555 94 Q529 78 501 88 Q464 99 436 121 Z"
      fill="#795035" opacity=".7"/>
    <path d="M457 68 Q474 67 489 58 Q525 37 549 59
      M425 93 Q439 94 450 84 M405 127 Q420 140 433 129
      M555 103 Q580 100 590 86 M574 118 Q595 122 602 143"
      fill="none" stroke="#956340" stroke-width="4" opacity=".65"/>
    <path d="M429 152 Q436 124 464 107 Q489 91 514 108
      M520 70 Q545 74 552 93 M581 68 Q584 81 573 94"
      fill="none" stroke="#211e1b" stroke-width="5"/>
  `);

  add('costume', 40, `
    <g ${cloth}>
      <path d="M417 351 Q392 353 381 385 Q359 407 360 455
        L397 540 L415 641 L404 689 L392 768
        Q443 797 501 814 Q558 797 611 768 L599 689
        L588 641 L608 540 L645 455 Q646 407 620 385
        Q612 356 582 351 L552 370 L501 399 L450 370 Z"
        fill="url(#beacon-teal)"/>
      <path d="M390 364 Q348 349 320 382 Q297 405 300 451
        L275 525 Q269 553 264 584 L307 611
        Q346 568 353 518 L375 466 L397 407 Z"
        fill="url(#beacon-navy)"/>
      <path d="M612 364 Q657 349 684 382 Q706 405 704 451
        L730 525 Q738 553 743 584 L700 611
        Q660 568 653 518 L631 466 L611 407 Z"
        fill="url(#beacon-navy)"/>
      <path d="M265 577 L305 610 Q305 638 289 674
        Q275 728 243 783 L200 772 Q207 697 231 643 Z"
        fill="url(#beacon-navy)"/>
      <path d="M741 577 L701 610 Q701 638 717 674
        Q731 728 764 783 L807 772 Q800 697 776 643 Z"
        fill="url(#beacon-navy)"/>
      <path d="M404 689 Q452 708 501 708 Q551 708 599 689
        L631 837 Q656 918 644 1002 L651 1069
        Q676 1182 681 1219 L610 1250
        Q582 1157 569 1080 L570 1033 Q534 943 511 841
        L498 841 Q476 943 439 1033 L438 1080
        Q414 1180 384 1250 L306 1219
        Q320 1153 349 1069 L355 1002 Q343 918 371 837 Z"
        fill="url(#beacon-navy)"/>
    </g>
    <path d="M423 397 Q470 423 502 417 Q542 423 582 397
      L605 456 L572 514 Q536 501 506 514 Q469 501 428 514
      L399 454 Z" fill="#239296" opacity=".68"/>
    <path d="M425 521 Q469 532 501 520 Q542 532 581 521
      L565 640 L575 674 L433 674 L442 640 Z" fill="#0b6979"/>
    <path d="M398 401 L385 447 L426 523 L453 681
      M609 401 L621 447 L582 523 L555 681"
      fill="none" stroke="#f1cd7c" stroke-width="8"/>
    <path d="M405 696 L434 712 L407 816 L368 900
      Q372 945 392 1006 Q430 952 451 891 L483 808 Z
      M599 696 L570 712 L597 816 L633 900
      Q630 945 610 1006 Q572 952 551 891 L520 808 Z"
      fill="url(#beacon-teal)"/>
    <path d="M428 712 L402 817 L364 895 M577 712 L602 817 L638 895"
      fill="none" stroke="#edc36b" stroke-width="7"/>
    <path d="M388 870 Q383 924 395 956 M615 870 Q625 924 611 956"
      fill="none" stroke="#39a1a3" stroke-width="7" opacity=".5"/>
    <path d="M311 432 Q313 392 349 380 L373 384
      Q337 405 332 441 L312 487 L299 485 Z
      M695 432 Q693 392 657 380 L633 384
      Q669 405 674 441 L694 487 L707 485 Z"
      fill="#2b5b75" opacity=".82"/>
    <path d="M302 535 Q289 567 283 584 M704 535 Q717 567 723 584"
      fill="none" stroke="#356983" stroke-width="8"/>
    <path d="M260 624 Q251 671 229 695 L218 746
      Q251 723 276 684 L286 646 Z
      M746 624 Q755 671 777 695 L788 746
      Q755 723 730 684 L720 646 Z" fill="url(#beacon-teal)"/>
    <path d="M252 632 L235 691 L219 741 L218 775
      M754 632 L771 691 L787 741 L788 775"
      fill="none" stroke="#e6be67" stroke-width="6"/>
    <path d="M363 1006 Q390 993 418 1024 L406 1062
      Q379 1081 354 1065 Z M588 1024 Q614 993 642 1006
      L651 1065 Q627 1081 600 1062 Z" fill="#234d66"/>
    <path d="M367 1093 Q358 1153 337 1209 M638 1093 Q652 1154 658 1208"
      fill="none" stroke="#285974" stroke-width="12"/>
    <path d="M421 351 L439 328 Q452 346 483 353 L501 395
      L519 353 Q552 346 563 328 L582 351 L578 385
      Q539 415 501 417 Q461 412 426 385 Z"
      fill="#17485d" stroke="#102e40" stroke-width="4"/>
    <path d="M439 330 Q452 347 482 355 L500 395
      M519 355 Q550 347 563 330 M425 384 Q463 410 499 414
      Q540 412 578 384"
      fill="none" stroke="#edc475" stroke-width="5"/>
    <path d="M503 441 L523 473 L512 506 L503 527 L493 506
      L482 473 Z" fill="url(#beacon-gold)"/>
    <path d="M503 441 L503 485 L482 473 Z" fill="#fff0b3"/>
    <path d="M503 485 L523 473 L503 527 Z" fill="#b97f2f"/>
    <path d="M472 445 L455 467 L479 493 L488 516
      L438 469 L459 445 Z M534 445 L551 467 L527 493 L518 516
      L568 469 L547 445 Z" fill="url(#beacon-gold)"/>
    <path d="M503 546 L503 627" stroke="#085a6c" stroke-width="4"/>
    <path d="M405 741 Q452 765 488 801 M599 741 Q552 765 516 801"
      fill="none" stroke="#0d6575" stroke-width="4"/>
  `);

  add('boots', 41, `
    <path d="M303 1174 Q304 1210 344 1238 L389 1197
      Q390 1280 363 1389 L365 1445 L348 1466
      Q300 1503 229 1491 Q221 1488 223 1478
      Q226 1451 259 1430 L290 1390 Q295 1280 289 1224 Z"
      fill="url(#beacon-teal)" ${cloth}/>
    <path d="M681 1174 Q679 1210 640 1238 L595 1197
      Q594 1280 621 1389 L619 1445 L636 1466
      Q685 1503 756 1491 Q764 1488 762 1478
      Q759 1451 727 1430 L695 1390 Q690 1280 695 1224 Z"
      fill="url(#beacon-teal)" ${cloth}/>
    <path d="M302 1213 L342 1254 L381 1223 L352 1374
      L327 1391 L304 1376 L315 1301 Z
      M681 1213 L642 1254 L603 1223 L632 1374
      L657 1391 L680 1376 L669 1301 Z" fill="#074d62"/>
    <path d="M305 1243 L322 1259 L308 1361 L296 1386 Z
      M678 1243 L661 1259 L675 1361 L687 1386 Z"
      fill="#33a0a2" opacity=".62"/>
    <path d="M293 1200 Q301 1228 343 1256 L387 1212
      M691 1200 Q682 1228 641 1256 L597 1212"
      fill="none" stroke="#9c6826" stroke-width="13"/>
    <path d="M293 1196 Q301 1224 343 1252 L387 1208
      M691 1196 Q682 1224 641 1252 L597 1208"
      fill="none" stroke="#f0c573" stroke-width="8"/>
    <path d="M290 1393 L305 1372 L327 1364 L352 1388 L360 1410
      M695 1393 L680 1372 L658 1364 L633 1388 L625 1410"
      fill="none" stroke="#a46e2b" stroke-width="13"/>
    <path d="M290 1389 L305 1368 L327 1360 L352 1384 L360 1406
      M695 1389 L680 1368 L658 1360 L633 1384 L625 1406"
      fill="none" stroke="#f0c573" stroke-width="8"/>
    <path d="M306 1390 Q321 1380 336 1400 L344 1440
      Q316 1430 292 1442 L268 1454 Z
      M679 1390 Q664 1380 649 1400 L641 1440
      Q669 1430 693 1442 L717 1454 Z" fill="#0d6576"/>
    <path d="M227 1475 Q247 1436 280 1441 Q319 1441 325 1466
      Q287 1491 227 1485 Z M758 1475 Q738 1436 705 1441
      Q666 1441 660 1466 Q698 1491 758 1485 Z"
      fill="#0b576d" stroke="#102e40" stroke-width="3"/>
    <path d="M239 1469 Q259 1449 283 1451 M746 1469 Q726 1449 702 1451"
      fill="none" stroke="#237e89" stroke-width="6"/>
    <path d="M223 1479 Q255 1499 316 1477 L342 1459
      L363 1447 L363 1468 L344 1476 L330 1474
      Q296 1510 224 1497 Z
      M762 1479 Q730 1499 669 1477 L643 1459
      L622 1447 L622 1468 L641 1476 L655 1474
      Q689 1510 761 1497 Z" ${gold}/>
    <path d="M228 1487 Q273 1502 316 1485 M757 1487 Q712 1502 669 1485"
      fill="none" stroke="#ffe5a1" stroke-width="4"/>
  `);

  add('belt', 42, `
    <path d="M403 671 Q500 699 601 671 L608 714
      Q499 744 397 714 Z" ${gold}/>
    <path d="M404 679 Q500 707 600 679 M401 706 Q500 734 605 706"
      fill="none" stroke="#ffe6a0" stroke-width="4"/>
    <path d="M433 686 L444 721 M573 686 L562 721"
      stroke="#a77734" stroke-width="4"/>
    <path d="M486 681 L520 681 L544 704 L526 732
      L482 732 L463 704 Z" fill="#845b2d" opacity=".4" transform="translate(0 4)"/>
    <path d="M486 678 L520 678 L544 701 L526 729
      L482 729 L463 701 Z" ${gold}/>
    <path d="M490 687 L516 687 L531 702 L520 720
      L488 720 L477 702 Z" fill="#dfaa49" stroke="#a57531" stroke-width="3"/>
    <path d="M490 689 L515 689 L525 699 L483 699 Z" fill="#fce29a"/>
  `);
  add('necklace', 43, `
    <path d="M446 342 Q445 384 503 418 Q558 383 559 342"
      fill="none" stroke="#805b2c" stroke-width="6"/>
    <path d="M446 342 Q445 382 503 416 Q558 382 559 342"
      fill="none" stroke="#f9d984" stroke-width="3.5"/>
    <ellipse cx="503" cy="418" rx="4" ry="6" fill="none" stroke="#e4bb64" stroke-width="3"/>
    <path d="M503 422 L516 440 L503 456 L490 440 Z" ${gold}/>
    <path d="M503 428 L510 440 L503 449 L496 440 Z" fill="#3cc2c0" stroke="#136476" stroke-width="2"/>
    <path d="M503 430 L503 445 L498 440 Z" fill="#c7f5dd"/>
  `);
  add('armband', 44, `
    <path d="M278 491 Q310 491 351 514 L342 541
      Q308 520 270 519 Z" ${gold}/>
    <path d="M279 496 Q309 497 347 518 M275 513 Q311 515 342 533"
      fill="none" stroke="#ffecb0" stroke-width="3"/>
    <path d="M293 499 L306 508 L296 517 L285 508 Z"
      fill="#f8d789" stroke="#b28039" stroke-width="2"/>
    <path d="M323 506 L316 525" stroke="#b98032" stroke-width="3"/>
  `);
  add('glasses', 45, `
    <path d="M412 185 L432 190 M580 190 L600 185"
      fill="none" stroke="#92692c" stroke-width="5"/>
    <path d="M433 182 Q458 175 482 183 Q491 186 489 201
      L484 214 Q465 222 443 215 Q435 212 433 202 Z
      M526 183 Q551 175 578 182 L578 202 Q576 212 568 215
      Q545 222 529 214 L523 201 Q521 187 526 183 Z"
      fill="#d3f5ed" fill-opacity=".07" stroke="#8d672f" stroke-width="5"/>
    <path d="M433 182 Q458 175 482 183 Q491 186 489 201
      L484 214 Q465 222 443 215 Q435 212 433 202 Z
      M526 183 Q551 175 578 182 L578 202 Q576 212 568 215
      Q545 222 529 214 L523 201 Q521 187 526 183 Z"
      fill="none" stroke="#ebce88" stroke-width="2.5"/>
    <path d="M490 192 Q506 184 523 192" fill="none" stroke="#94703c" stroke-width="5"/>
    <path d="M490 191 Q506 184 523 191" fill="none" stroke="#efd795" stroke-width="2"/>
    <path d="M439 188 L451 183 M532 188 L543 183"
      fill="none" stroke="#fff" stroke-opacity=".65" stroke-width="3"/>
  `);
  add('ring', 46, `
    <path d="M789 876 Q799 872 808 877 L806 885
      Q797 880 787 884 Z" ${gold}/>
    <path d="M790 877 Q799 875 806 879" fill="none" stroke="#fff1bb" stroke-width="2"/>
    <path d="M797 875 L802 876 L802 882 L796 881 Z" fill="#fff0b3" stroke="#bc8a3c" stroke-width="1.5"/>
  `);
  add('headband', 47, `
    <path d="M419 121 Q447 80 501 77 Q556 73 596 119
      Q555 85 503 87 Q456 88 419 121 Z"
      fill="url(#beacon-gold)" stroke="#a47733" stroke-width="2"/>
    <path d="M435 106 Q470 79 508 81 Q548 80 578 102"
      fill="none" stroke="#ffeab0" stroke-width="3"/>
  `);
  add('watch', 48, `
    <path d="M766 782 L804 771 L813 801 L777 813 Z"
      fill="#103d50" stroke="#102e40" stroke-width="4"/>
    <path d="M769 788 L804 778 M777 805 L811 794"
      fill="none" stroke="#258b94" stroke-width="4"/>
    <ellipse cx="802" cy="790" rx="17" ry="22" transform="rotate(-14 802 790)" ${gold}/>
    <ellipse cx="802" cy="790" rx="12" ry="17" transform="rotate(-14 802 790)"
      fill="#17485d" stroke="#fcdfa0" stroke-width="2"/>
    <path d="M799 779 L802 790 L809 794 M797 776 L798 779
      M791 790 L794 790 M806 801 L807 804 M810 787 L813 786"
      fill="none" stroke="#f7dc8f" stroke-width="2"/>
    <circle cx="802" cy="790" r="2" fill="#fbe0a0"/>
    <path d="M796 781 L807 791" stroke="#8cd4cf" stroke-width="2" opacity=".45"/>
  `);
  add('bracelet', 49, `
    <path d="M197 783 Q216 779 241 793 L236 809
      Q214 796 193 802 Z" ${gold}/>
    <path d="M199 786 Q217 784 238 796 M197 797 Q214 792 235 804"
      fill="none" stroke="#ffedb1" stroke-width="3"/>
    <path d="M204 785 L205 799 M225 789 L221 802"
      stroke="#b37c2d" stroke-width="2"/>
    <ellipse cx="197" cy="793" rx="7" ry="9" transform="rotate(17 197 793)" ${gold}/>
    <ellipse cx="197" cy="793" rx="3" ry="4" fill="#fdf0bd"/>
  `);
  add('earrings', 50, `
    <circle cx="422" cy="230" r="6" ${gold}/>
    <circle cx="595" cy="230" r="6" ${gold}/>
    <circle cx="420.5" cy="228.5" r="2" fill="#fff4c5"/>
    <circle cx="593.5" cy="228.5" r="2" fill="#fff4c5"/>
  `);

  const regions = {
    head: [ellipse(507, 199, 93, 112)],
    hair: [ellipse(508, 103, 112, 71)],
    forehead: [ellipse(507, 139, 61, 19)],
    eyes: [ellipse(460, 190, 24, 18), ellipse(553, 190, 24, 18)],
    ears: [ellipse(418, 207, 15, 29, -14), ellipse(599, 207, 15, 29, 14)],
    nose: [ellipse(506, 219, 20, 24)],
    cheeks: [ellipse(452, 233, 24, 16), ellipse(565, 233, 24, 16)],
    mouth: [ellipse(507, 264, 43, 17)],
    lips: [ellipse(507, 251, 40, 5), ellipse(509, 280, 24, 6)],
    chin: [ellipse(507, 295, 29, 17)],
    jaw: [ellipse(452, 273, 14, 32, -40), ellipse(562, 273, 14, 32, 40)],
    neck: [ellipse(505, 337, 48, 41)],
    shoulders: [ellipse(355, 410, 57, 56), ellipse(652, 410, 57, 56)],
    chest: [ellipse(503, 477, 99, 75)],
    waist: [ellipse(503, 638, 88, 37)],
    arms: [
      ellipse(312, 538, 32, 68, 18), ellipse(696, 538, 32, 68, -18),
      ellipse(249, 703, 26, 76, 20), ellipse(758, 703, 26, 76, -20)
    ],
    elbows: [ellipse(278, 612, 28, 28), ellipse(729, 612, 28, 28)],
    wrists: [ellipse(220, 794, 24, 23, 16), ellipse(789, 794, 24, 23, -16)],
    hands: [ellipse(213, 848, 27, 41, 8), ellipse(796, 848, 27, 41, -8)],
    fingers: [ellipse(207, 900, 19, 39, -25), ellipse(802, 900, 19, 39, 25)],
    legs: [ellipse(365, 1203, 39, 121, 13), ellipse(631, 1203, 39, 121, -10)],
    thighs: [ellipse(416, 888, 46, 112, 9), ellipse(589, 888, 46, 112, -9)],
    knees: [ellipse(395, 1043, 42, 46), ellipse(611, 1043, 42, 46)],
    ankles: [ellipse(329, 1367, 32, 37), ellipse(656, 1367, 32, 37)],
    feet: [ellipse(286, 1446, 66, 42, -23), ellipse(699, 1446, 66, 42, 23)],
    heels: [ellipse(349, 1450, 15, 23), ellipse(636, 1450, 15, 23)],
    costume: [ellipse(503, 548, 91, 117), ellipse(414, 877, 38, 80), ellipse(592, 877, 38, 80)],
    cape: [ellipse(244, 1045, 48, 168, 9), ellipse(711, 1045, 39, 168, -9)],
    belt: [ellipse(503, 704, 107, 29)],
    boots: [
      ellipse(337, 1290, 43, 108, 6), ellipse(647, 1290, 43, 108, -6),
      ellipse(280, 1464, 61, 33, -14), ellipse(704, 1464, 61, 33, 14)
    ],
    necklace: [ellipse(503, 440, 15, 19), ellipse(505, 382, 58, 34)],
    armband: [ellipse(311, 515, 41, 15, 17)],
    glasses: [ellipse(462, 198, 30, 22), ellipse(552, 198, 30, 22)],
    ring: [ellipse(798, 880, 11, 7)],
    headband: [ellipse(508, 85, 74, 10)],
    watch: [ellipse(802, 790, 19, 24, -14)],
    bracelet: [ellipse(218, 794, 26, 12, 15)],
    earrings: [ellipse(422, 230, 8, 8), ellipse(595, 230, 8, 8)]
  };

  // Photo ellipses were located on the supplied 1024 x 1536 reference.
  // Covered body words locate anatomy beneath clothing, not visible skin.
  const photoRegions = {
    head: [ellipse(494, 190, 89, 100)],
    hair: [ellipse(486, 100, 103, 75)],
    forehead: [ellipse(499, 124, 52, 23)],
    eyes: [ellipse(461, 172, 21, 17), ellipse(529, 171, 22, 17)],
    ears: [ellipse(416, 197, 16, 27, -13), ellipse(566, 194, 14, 27, 14)],
    nose: [ellipse(499, 197, 19, 24)],
    cheeks: [ellipse(453, 207, 21, 19), ellipse(544, 205, 18, 20)],
    mouth: [ellipse(496, 235, 35, 13)],
    lips: [ellipse(496, 228, 34, 5), ellipse(497, 243, 24, 5)],
    chin: [ellipse(497, 267, 26, 16)],
    jaw: [ellipse(448, 249, 12, 27, -34), ellipse(545, 249, 12, 27, 34)],
    neck: [ellipse(494, 308, 47, 36)],
    shoulders: [ellipse(332, 413, 64, 65, 16), ellipse(657, 413, 55, 66, -16)],
    chest: [ellipse(502, 444, 102, 65)],
    waist: [ellipse(516, 625, 81, 35)],
    arms: [
      ellipse(296, 555, 39, 62, 22), ellipse(682, 551, 38, 66, -21),
      ellipse(253, 681, 32, 77, 16), ellipse(734, 681, 33, 77, -16)
    ],
    elbows: [ellipse(274, 609, 26, 30, 12), ellipse(711, 609, 27, 30, -12)],
    wrists: [ellipse(214, 779, 24, 22, 13), ellipse(778, 779, 25, 22, -13)],
    hands: [ellipse(218, 837, 29, 43, -3), ellipse(771, 837, 31, 43, 3)],
    fingers: [
      ellipse(211, 901, 18, 42, -29), ellipse(251, 867, 10, 25, -25),
      ellipse(779, 901, 20, 42, 29), ellipse(736, 867, 10, 25, 25)
    ],
    legs: [ellipse(368, 1157, 44, 87, 14), ellipse(624, 1157, 46, 87, -11)],
    thighs: [ellipse(414, 903, 53, 112, 13), ellipse(588, 903, 52, 112, -13)],
    knees: [ellipse(391, 1047, 41, 43, 15), ellipse(611, 1047, 40, 43, -15)],
    ankles: [ellipse(306, 1369, 30, 40, 7), ellipse(645, 1369, 31, 40, -7)],
    feet: [ellipse(273, 1460, 61, 43, -19), ellipse(697, 1460, 61, 43, 19)],
    heels: [ellipse(332, 1455, 17, 27, 6), ellipse(619, 1455, 17, 27, -6)],
    costume: [ellipse(516, 553, 78, 91), ellipse(418, 888, 43, 83), ellipse(580, 888, 43, 83)],
    cape: [ellipse(247, 1072, 46, 143, 11), ellipse(725, 1072, 31, 143, -7)],
    belt: [ellipse(505, 686, 110, 33)],
    boots: [
      ellipse(327, 1277, 43, 106, 9), ellipse(626, 1277, 43, 106, -9),
      ellipse(268, 1467, 60, 34, -15), ellipse(700, 1467, 61, 34, 15)
    ],
    necklace: [ellipse(509, 403, 14, 19), ellipse(495, 362, 58, 31)],
    armband: [ellipse(300, 515, 48, 16, 18)],
    glasses: [ellipse(460, 177, 31, 24), ellipse(532, 174, 30, 23)],
    ring: [ellipse(784, 883, 16, 6, 8)],
    headband: [ellipse(492, 81, 66, 12)],
    watch: [ellipse(795, 780, 17, 23, -10), ellipse(780, 784, 26, 14, -12)],
    bracelet: [ellipse(207, 787, 29, 12, -8)],
    earrings: [ellipse(422, 221, 7, 8), ellipse(561, 216, 7, 8)]
  };

  window.BeaconDemoArt = {
    width: 1024, height: 1536, defs,
    layers: layers.sort((a, b) => a.order - b.order),
    regions, photoRegions
  };
})();

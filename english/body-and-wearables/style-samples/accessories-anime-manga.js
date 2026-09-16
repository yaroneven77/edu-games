window.CharacterAccessories = window.CharacterAccessories || {};

// Head artwork uses translate(44.25 34.05) scale(.85); these overlays use artboard coordinates.
Object.assign(window.CharacterAccessories, {
  'anime-01': [
    {
      id: 'hat', en: 'Hat', he: 'כובע',
      svg: `<g stroke="#233b43" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M243 131Q241 104 263 93Q293 78 322 96Q339 107 341 130L319 138 262 142Z" fill="#f3eedc"/>
        <path d="M300 90Q326 99 327 129L341 130Q339 104 313 93Z" fill="#b8cbbb" stroke="none"/>
        <path d="M285 89Q274 109 277 135M309 94Q317 113 314 133" fill="none" stroke="#83a69b" stroke-width="1.3"/>
        <path d="M243 129Q291 118 341 128L340 137Q291 130 245 140Z" fill="#298c8d"/>
        <path d="M246 136Q291 126 326 135L344 141Q323 150 293 144L257 146 235 143Z" fill="#f9f3df"/>
        <path d="M241 143Q293 134 333 143L317 147 287 143 257 146Z" fill="#92b7a8" stroke="none"/>
        <path d="M254 138Q290 132 317 137" fill="none" stroke="#fffaf0" stroke-width="1.1"/>
        <path d="M284 101L293 98 302 102 301 114 292 119 283 113Z" fill="#e7c572" stroke-width="1.4"/>
        <path d="M293 102L289 109 295 107 291 115" fill="none" stroke="#286d75" stroke-width="1.5"/>
        <ellipse cx="289" cy="88" rx="4" ry="2.5" fill="#298c8d" stroke-width="1.2"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#244c54" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M263 181Q276 176 289 181L289 193Q278 201 267 194Z"/>
        <path d="M302 179Q315 173 328 178L326 191Q315 199 304 191Z"/>
        <path d="M290 184Q296 180 302 182M263 183L253 177M328 179L336 174"/>
        <path d="M267 183L271 182M306 180L310 179" stroke="#a1dbca" stroke-width="1.1"/>
        <path d="M268 196Q278 201 287 195M306 194Q317 198 325 192" stroke="#d6b470" stroke-width="1.1"/>
        <circle cx="264" cy="184" r="1" fill="#e7c572" stroke="none"/>
        <circle cx="327" cy="180" r="1" fill="#e7c572" stroke="none"/>
      </g>`
    },
    {
      id: 'necklace', en: 'Necklace', he: 'שרשרת',
      svg: `<g stroke="#705b40" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M273 240Q271 261 289 281Q307 263 315 240" fill="none"/>
        <path d="M276 247Q280 267 289 277M291 277Q302 263 310 248" fill="none" stroke="#e7c572" stroke-width="1"/>
        <circle cx="289" cy="283" r="2.6" fill="#e7c572"/>
        <circle cx="289" cy="294" r="9.5" fill="#e7c572"/>
        <circle cx="289" cy="294" r="6.7" fill="#f9f3df" stroke-width="1"/>
        <path d="M289 288L292 297 289 295 286 299Z" fill="#298c8d" stroke="#244c54" stroke-width=".8"/>
        <path d="M289 286V287M297 294H296M289 302V301M281 294H282" fill="none" stroke-width="1"/>
        <path d="M283 289L285 287" fill="none" stroke="#fffaf0"/>
      </g>`
    },
    {
      id: 'watch', en: 'Watch', he: 'שעון',
      svg: `<g stroke="#233b43" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M140 273L164 261 170 272 145 284Z" fill="#b77c53"/>
        <path d="M143 275L166 264M146 281L168 270" fill="none" stroke="#e4b980" stroke-width="1"/>
        <path d="M145 271L155 266 164 280 153 286Z" fill="#e7c572"/>
        <circle cx="154" cy="276" r="8.5" fill="#f9f3df"/>
        <circle cx="154" cy="276" r="6.1" fill="#d8e9df" stroke-width=".8"/>
        <path d="M154 270V271M160 276H159M154 282V281M148 276H149M154 272V276L157 278" fill="none" stroke-width="1"/>
        <circle cx="154" cy="276" r="1" fill="#298c8d" stroke="none"/>
        <path d="M163 272L166 270 168 273 165 275Z" fill="#e7c572" stroke-width="1"/>
      </g>`
    },
    {
      id: 'earring', en: 'Earring', he: 'עגיל',
      svg: `<g stroke="#705b40" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="254" cy="196" r="2.3" fill="#f2d99b"/>
        <path d="M254 198V202" fill="none"/>
        <path d="M254 201L260 208 254 219 248 208Z" fill="#e7c572"/>
        <path d="M254 204L257 209 254 215 251 209Z" fill="#298c8d" stroke-width=".9"/>
        <path d="M250 207L253 204M255 212L254 214" fill="none" stroke="#fff1be" stroke-width="1"/>
      </g>`
    },
    {
      id: 'headband', en: 'Headband', he: 'סרט ראש', slot: 'headwear',
      svg: `<g stroke="#233b43" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M241 151Q246 109 286 102Q323 96 343 137L337 143Q321 110 288 111Q257 116 248 157Z" fill="#e7c572"/>
        <path d="M246 145Q256 114 287 107Q316 103 335 132" fill="none" stroke="#fff1be" stroke-width="1.3"/>
        <path d="M243 148L234 143 237 134 248 140 251 132 260 138 251 151Z" fill="#298c8d"/>
        <path d="M245 150L238 169 234 163 230 165 238 146Z" fill="#298c8d"/>
        <path d="M242 141L246 147 253 139M240 154L236 162" fill="none" stroke="#a1dbca" stroke-width="1"/>
        <circle cx="245" cy="147" r="3.6" fill="#f2d99b"/>
      </g>`
    },
    {
      id: 'bow-tie', en: 'Bow tie', he: 'עניבת פרפר', slot: 'neckwear',
      svg: `<g stroke="#233b43" stroke-width="1.6" stroke-linejoin="round">
        <path d="M283 255L270 248Q266 256 270 266L284 261 298 266Q303 257 299 249L289 255Z" fill="#298c8d"/>
        <path d="M272 252L281 257 272 262M297 253L290 258 297 262" fill="none" stroke="#a1dbca" stroke-width="1.1"/>
        <path d="M282 254Q286 251 290 254L289 263 282 263Z" fill="#e7c572"/>
        <path d="M285 255V261" stroke="#fff1be" stroke-width="1"/>
      </g>`
    },
    {
      id: 'belt', en: 'Belt', he: 'חגורה', slot: 'waistwear',
      svg: `<g stroke="#233b43" stroke-width="1.7" stroke-linejoin="round">
        <path d="M258 420Q296 425 329 420L332 433Q293 440 255 433Z" fill="#b77c53"/>
        <path d="M260 424Q293 430 327 424M259 431Q292 436 329 431" fill="none" stroke="#e4b980" stroke-width=".9"/>
        <path d="M281 422L303 423 302 437 280 436Z" fill="#e7c572"/>
        <path d="M286 426L299 427 298 433 285 432Z" fill="#344854" stroke-width="1"/>
        <path d="M290 429L300 430" stroke="#fff1be" stroke-width="1.7"/>
        <path d="M268 423L267 435M315 425L316 435" stroke="#705b40" stroke-width="3"/>
        <circle cx="322" cy="429" r="1" fill="#233b43" stroke="none"/>
      </g>`
    },
    {
      id: 'knee-pads', en: 'Knee pads', he: 'מגיני ברכיים', slot: 'kneewear',
      svg: `<g stroke="#233b43" stroke-width="1.8" stroke-linejoin="round">
        <path d="M207 538L250 544 248 556 204 551M304 533L351 526 351 539 306 546" fill="#172d36"/>
        <path d="M215 530L243 535 246 557 234 570 212 561 209 544Z" fill="#608087"/>
        <path d="M313 526L339 522 347 539 342 558 320 563 311 547Z" fill="#608087"/>
        <path d="M218 536L239 540 240 553 233 562 218 555 215 545ZM318 532L336 529 341 541 337 551 323 556 317 545Z" fill="#344854" stroke-width="1"/>
        <path d="M218 542L237 546M218 547L237 551M320 538L336 535M321 544L338 541" fill="none" stroke="#a1dbca" stroke-width="1.2"/>
        <circle cx="216" cy="556" r="1.5" fill="#e7c572" stroke="none"/>
        <circle cx="339" cy="552" r="1.5" fill="#e7c572" stroke="none"/>
      </g>`
    },
    {
      id: 'badge', en: 'Explorer badge', he: 'תג סייר', slot: 'lapel',
      svg: `<g stroke="#233b43" stroke-width="1.3" stroke-linejoin="round">
        <path d="M223 245L231 242 244 257 235 263Z" fill="#f3eedc"/>
        <path d="M226 247L231 245 240 257 235 260Z" fill="#e7c572" stroke-width=".8"/>
        <path d="M231 249L230 255 237 256 234 253 232 254Z" fill="#298c8d" stroke="none"/>
        <path d="M230 260L229 270 234 268 238 272 239 262Z" fill="#bf8858"/>
        <path d="M233 262L234 267" stroke="#e9c28b" stroke-width="1"/>
      </g>`
    }
  ],
  'anime-02': [
    {
      id: 'hat', en: 'Hat', he: 'כובע',
      svg: `<g stroke="#49373f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M248 128Q231 108 254 91Q281 73 317 83Q350 91 352 109Q354 125 333 133L266 139Z" fill="#7463a0"/>
        <path d="M311 82Q338 95 337 111Q332 125 311 129L333 133Q356 124 352 109Q347 88 311 82Z" fill="#514870" stroke="none"/>
        <path d="M251 112Q249 98 271 91Q292 85 308 89" fill="none" stroke="#b6a6c8" stroke-width="2"/>
        <path d="M262 103Q274 90 294 88M324 98Q332 107 328 116" fill="none" stroke="#9580b1" stroke-width="1.3"/>
        <path d="M250 125Q290 116 336 126L333 138Q290 129 254 139Z" fill="#5b586e"/>
        <path d="M256 130Q294 123 332 131" fill="none" stroke="#d8b478" stroke-width="1.4"/>
        <path d="M298 80L300 72 305 73 304 81Z" fill="#5b586e" stroke-width="1.4"/>
        <path d="M265 116L269 107 273 116 282 119 273 122 269 131 265 122 256 119Z" fill="#e6bf77" stroke-width="1.3"/>
        <circle cx="269" cy="119" r="3.4" fill="#f6ead1" stroke-width="1"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#866043" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="279" cy="189" rx="13.6" ry="12"/>
        <ellipse cx="314.5" cy="186.5" rx="13.6" ry="12"/>
        <path d="M292.5 185Q296.5 180 301 184M265.5 185L255 179M328 183L336 177"/>
        <path d="M269 183Q273 178 280 178M305 180Q309 175 316 175" stroke="#ead295" stroke-width="1"/>
        <path d="M269 196L272 198M304 193L308 196" stroke="#f6ead1" stroke-width="1"/>
        <circle cx="265.5" cy="185" r="1.4" fill="#ead295" stroke-width=".7"/>
        <circle cx="328" cy="183" r="1.4" fill="#ead295" stroke-width=".7"/>
      </g>`
    },
    {
      id: 'bracelet', en: 'Bracelet', he: 'צמיד',
      svg: `<g stroke="#725444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M425 320Q431 320 434 316L432 323 428 341 420 339Z" fill="#d8b478"/>
        <path d="M428 322L423 337M431 322L427 338" fill="none" stroke="#fff0c2" stroke-width="1.1"/>
        <path d="M423 335L428 337 426 342 421 340Z" fill="#9580b1" stroke-width="1"/>
        <path d="M426 342L425 348" fill="none"/>
        <path d="M425 347L430 352 425 359 420 352Z" fill="#e6bf77" stroke-width="1.2"/>
        <path d="M425 350L426 352 425 355 424 352Z" fill="#7463a0" stroke="none"/>
      </g>`
    },
    {
      id: 'watch', en: 'Watch', he: 'שעון',
      svg: `<g stroke="#49373f" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M177 388L202 398 199 407 174 397Z" fill="#95705b"/>
        <path d="M179 391L199 399M176 395L197 403" fill="none" stroke="#e6c28e" stroke-width="1"/>
        <path d="M185 387L196 391 191 407 180 402Z" fill="#d6b170"/>
        <circle cx="188" cy="397" r="8.1" fill="#ead295"/>
        <circle cx="188" cy="397" r="5.7" fill="#fff4d2" stroke-width=".9"/>
        <path d="M188 392V397L191 399M183 397H184M192 397H193M188 401V402" fill="none" stroke-width="1"/>
        <circle cx="188" cy="397" r="1" fill="#7463a0" stroke="none"/>
        <path d="M195 397L198 398 197 401 194 400Z" fill="#d6b170" stroke-width="1"/>
      </g>`
    },
    {
      id: 'brooch', en: 'Brooch', he: 'סיכה',
      svg: `<g stroke="#725444" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M252 277Q241 269 237 261Q248 261 255 267L261 273Z" fill="#e6bf77"/>
        <path d="M253 277Q244 277 240 270L250 272Z" fill="#d0ad77"/>
        <path d="M241 264L253 272M245 264L256 270M244 272L250 275" fill="none" stroke="#fff0c2" stroke-width="1"/>
        <circle cx="257" cy="274" r="6.4" fill="#d8b478"/>
        <circle cx="257" cy="274" r="3.9" fill="#7463a0" stroke-width=".9"/>
        <path d="M255 272L257 271" fill="none" stroke="#d8c7d8" stroke-width="1.2"/>
        <path d="M257 281L255 286 260 284Z" fill="#e6bf77" stroke-width="1"/>
      </g>`
    },
    {
      id: 'headband', en: 'Headband', he: 'סרט ראש', slot: 'headwear',
      svg: `<g stroke="#49373f" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M247 157Q242 119 275 108Q315 93 337 134L331 139Q312 107 278 115Q251 125 254 156Z" fill="#9580b1"/>
        <path d="M250 148Q249 123 276 113Q310 103 331 130" fill="none" stroke="#d8c7d8" stroke-width="1.2"/>
        <path d="M253 136L246 128 237 131 242 140 234 146 238 154 251 148Z" fill="#d8b478"/>
        <path d="M245 143L242 138 249 137 249 144Z" fill="#fff0c2" stroke-width=".8"/>
        <circle cx="249" cy="143" r="4.2" fill="#7463a0"/>
        <path d="M239 132L244 136M238 148L243 146" stroke="#fff0c2" stroke-width="1"/>
      </g>`
    },
    {
      id: 'ring', en: 'Ring', he: 'טבעת', slot: 'fingerwear',
      svg: `<g stroke="#725444" stroke-width="1.2" stroke-linejoin="round">
        <path d="M462 326L468 323 472 331 466 333Z" fill="#e6bf77"/>
        <path d="M465 326L468 330" fill="none" stroke="#fff0c2" stroke-width="1"/>
        <path d="M465 323L470 320 474 325 469 329Z" fill="#d8b478"/>
        <path d="M467 323L470 322 472 325 469 327Z" fill="#7463a0" stroke-width=".7"/>
        <path d="M468 323L470 323" stroke="#d8c7d8" stroke-width="1"/>
      </g>`
    },
    {
      id: 'armband', en: 'Armband', he: 'סרט זרוע', slot: 'upper-arm',
      svg: `<g stroke="#49373f" stroke-width="1.6" stroke-linejoin="round">
        <path d="M211 287L239 298 234 311 207 300Z" fill="#7463a0"/>
        <path d="M213 291L236 300M210 298L232 307" fill="none" stroke="#d8b478" stroke-width="1.2"/>
        <path d="M221 293L228 296 227 304 220 302Z" fill="#ead295" stroke-width="1"/>
        <path d="M223 296L225 299 222 300" fill="none" stroke="#725444" stroke-width=".9"/>
      </g>`
    },
    {
      id: 'boot-charms', en: 'Boot wings', he: 'כנפיים למגפיים', slot: 'footwear-decoration',
      svg: `<g stroke="#725444" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M275 677Q290 675 301 661L299 674 291 680 297 678Q290 690 277 689Z" fill="#e6bf77"/>
        <path d="M280 683L294 671M284 685L290 682" fill="none" stroke="#fff0c2" stroke-width="1.1"/>
        <circle cx="277" cy="684" r="3.5" fill="#9580b1"/>
        <path d="M354 677Q367 674 378 662L376 675 369 681 375 679Q367 691 357 689Z" fill="#e6bf77"/>
        <path d="M359 683L372 672M362 685L368 682" fill="none" stroke="#fff0c2" stroke-width="1.1"/>
        <circle cx="357" cy="684" r="3.5" fill="#9580b1"/>
      </g>`
    },
    {
      id: 'medal', en: 'Courier medal', he: 'מדליית שליח', slot: 'chest',
      svg: `<g stroke="#725444" stroke-width="1.3" stroke-linejoin="round">
        <path d="M285 302L300 301 297 315 291 318Z" fill="#7463a0"/>
        <path d="M290 303L295 303 294 315 292 315Z" fill="#d8c7d8" stroke="none"/>
        <circle cx="294" cy="318" r="2.4" fill="#e6bf77"/>
        <circle cx="294" cy="327" r="7" fill="#e6bf77"/>
        <circle cx="294" cy="327" r="4.6" fill="#fff0c2" stroke-width=".8"/>
        <path d="M291 327L296 324 295 330 293 328Z" fill="#7463a0" stroke-width=".7"/>
        <path d="M289 321L291 320" stroke="#fff0c2" stroke-width="1"/>
      </g>`
    }
  ],
  'manga-01': [
    {
      id: 'hat', en: 'Hat', he: 'כובע',
      svg: `<g stroke="#242424" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M248 142Q234 129 246 110Q261 90 291 94Q317 94 339 113Q351 127 338 140L298 149Z" fill="#f5f5f5"/>
        <path d="M312 99Q341 119 332 134L308 142 338 140Q351 127 339 113Z" fill="#bdbdbd" stroke="none"/>
        <path d="M256 116Q264 105 281 103M257 121Q262 112 271 110M310 106Q325 115 329 125" fill="none" stroke="#777777" stroke-width="1"/>
        <path d="M249 137Q291 129 338 136L337 148Q291 140 253 149Z" fill="#333333"/>
        <path d="M255 143Q293 135 332 142" fill="none" stroke="#eeeeee" stroke-width="1.3"/>
        <path d="M284 95L285 88Q288 85 291 88L291 95Z" fill="#333333" stroke-width="1.4"/>
        <path d="M267 118L270 124 277 125 272 130 273 137 267 133 261 136 262 129 257 124 264 124Z" fill="#eeeeee" stroke-width="1.4"/>
        <path d="M267 123L269 127 273 127 269 130 269 133 266 131 263 132 264 128 262 126 266 127Z" fill="#555555" stroke="none"/>
        <path d="M319 117L325 123M319 122L327 130M317 126L324 133M313 130L318 135" fill="none" stroke="#777777" stroke-width=".8"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#333333" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <ellipse cx="279" cy="189.5" rx="13.2" ry="11.3"/>
        <ellipse cx="313.7" cy="189.5" rx="13.2" ry="11.3"/>
        <path d="M292.2 186Q296.3 182 300.5 186M265.8 186L253 181M326.9 186L336 180"/>
        <path d="M270 182Q274 179 279 179M305 182Q309 179 314 179" stroke="#999999" stroke-width=".9"/>
        <path d="M268 194L271 197M303 194L306 197" stroke="#bbbbbb" stroke-width="1"/>
        <circle cx="265.5" cy="186" r="1.2" fill="#eeeeee" stroke-width=".7"/>
        <circle cx="327" cy="186" r="1.2" fill="#eeeeee" stroke-width=".7"/>
      </g>`
    },
    {
      id: 'necklace', en: 'Necklace', he: 'שרשרת', slot: 'neckwear',
      svg: `<g stroke="#444444" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M272 237Q272 250 287 263Q303 250 314 237" fill="none"/>
        <path d="M277 244Q280 253 287 260M291 258L302 247" fill="none" stroke="#aaaaaa" stroke-width=".8"/>
        <circle cx="287" cy="264" r="2.1" fill="#eeeeee"/>
        <path d="M287 269Q282 263 278 268Q275 273 287 280Q299 273 296 268Q292 263 287 269Z" fill="#eeeeee"/>
        <path d="M288 273Q292 271 294 268Q298 272 287 278L282 274Z" fill="#999999" stroke="none"/>
        <path d="M280 270Q282 268 284 270" fill="none" stroke="#ffffff" stroke-width="1.5"/>
      </g>`
    },
    {
      id: 'bracelet', en: 'Bracelet', he: 'צמיד',
      svg: `<g stroke="#333333" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M153 268L177 257M155 274L180 263" fill="none" stroke="#555555" stroke-width="2"/>
        <circle cx="156" cy="268" r="3.2" fill="#eeeeee"/>
        <circle cx="162" cy="265.5" r="3.2" fill="#777777"/>
        <circle cx="168" cy="263" r="3.2" fill="#eeeeee"/>
        <circle cx="174" cy="260.5" r="3.2" fill="#777777"/>
        <circle cx="179" cy="258" r="3" fill="#eeeeee"/>
        <path d="M164 270L165 277" fill="none"/>
        <path d="M165 276L167 280 172 280 168 283 169 288 165 285 161 287 162 282 158 280 163 280Z" fill="#ffffff" stroke-width="1.1"/>
        <path d="M165 280L166 283" fill="none" stroke="#888888" stroke-width=".8"/>
      </g>`
    },
    {
      id: 'watch', en: 'Watch', he: 'שעון',
      svg: `<g stroke="#242424" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M332 425L356 435 354 444 328 434Z" fill="#444444"/>
        <path d="M332 430L352 438" fill="none" stroke="#cccccc" stroke-width="1"/>
        <path d="M339 426L349 429 346 444 335 440Z" fill="#bbbbbb"/>
        <rect x="334" y="427" width="16" height="15" rx="4" fill="#eeeeee" transform="rotate(20 342 434.5)"/>
        <path d="M338 430L347 433 345 439 336 436Z" fill="#333333" stroke-width=".8"/>
        <path d="M339 432L341 433 340 435M343 433L345 434 344 436 342 435Z" fill="none" stroke="#ffffff" stroke-width=".9"/>
        <path d="M350 433L353 434 352 437 349 436Z" fill="#999999" stroke-width=".9"/>
      </g>`
    },
    {
      id: 'earmuffs', en: 'Earmuffs', he: 'מחממי אוזניים', slot: 'headwear',
      svg: `<g stroke="#242424" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M247 182Q231 133 266 112Q303 89 333 124Q349 144 341 183" fill="none" stroke="#333333" stroke-width="7"/>
        <path d="M247 177Q235 135 268 115Q302 94 330 126Q345 145 341 177" fill="none" stroke="#cccccc" stroke-width="2"/>
        <path d="M243 177Q248 173 253 179L257 195Q253 205 247 201L240 188Z" fill="#eeeeee"/>
        <path d="M336 177Q342 172 347 178L351 190Q349 202 342 202L336 193Z" fill="#eeeeee"/>
        <path d="M244 181L247 182M243 186L248 187M246 192L251 193M339 181L343 180M340 186L346 185M342 193L347 192" stroke="#999999" stroke-width="1"/>
        <path d="M250 182L254 195M347 181L349 192" stroke="#cccccc" stroke-width="2"/>
      </g>`
    },
    {
      id: 'bow-tie', en: 'Bow tie', he: 'עניבת פרפר', slot: 'neckwear',
      svg: `<g stroke="#242424" stroke-width="1.5" stroke-linejoin="round">
        <path d="M281 258L267 252 266 266 281 265 278 277 284 274 288 277 289 265 304 268 304 252 289 258Z" fill="#555555"/>
        <path d="M271 256L279 261 270 263M299 256L291 261 300 264M283 267L282 273" fill="none" stroke="#eeeeee" stroke-width="1"/>
        <path d="M282 257L289 257 290 267 282 267Z" fill="#dddddd"/>
        <path d="M285 259V265" stroke="#ffffff" stroke-width="1"/>
      </g>`
    },
    {
      id: 'belt', en: 'Belt', he: 'חגורה', slot: 'waistwear',
      svg: `<g stroke="#242424" stroke-width="1.5" stroke-linejoin="round">
        <path d="M245 402Q284 410 327 402L328 412Q287 420 244 412Z" fill="#555555"/>
        <path d="M249 406Q288 413 324 406" fill="none" stroke="#dddddd" stroke-width="1"/>
        <path d="M277 404L297 405 297 417 277 416Z" fill="#eeeeee"/>
        <path d="M282 408L293 409 293 413 282 412Z" fill="#555555" stroke-width=".8"/>
        <path d="M287 410L295 411" stroke="#eeeeee" stroke-width="1.5"/>
        <circle cx="307" cy="410" r="1" fill="#ffffff" stroke="none"/>
        <circle cx="315" cy="409" r="1" fill="#ffffff" stroke="none"/>
        <path d="M259 405V414M320 404L321 413" stroke="#222222" stroke-width="2.5"/>
      </g>`
    },
    {
      id: 'flower-pin', en: 'Flower pin', he: 'סיכת פרח', slot: 'lapel',
      svg: `<g stroke="#242424" stroke-width="1.1" stroke-linejoin="round">
        <path d="M240 262Q232 253 239 248Q244 247 247 254Q250 244 256 249Q260 254 253 260Q264 262 258 268Q254 271 249 265Q247 276 241 272Q237 269 240 262Z" fill="#eeeeee"/>
        <path d="M248 267L253 277Q247 278 245 273L241 280 239 271Z" fill="#777777"/>
        <path d="M242 252L246 259M254 252L250 258M255 265L250 261M242 267L246 263" fill="none" stroke="#aaaaaa" stroke-width="1"/>
        <circle cx="247" cy="261" r="4" fill="#444444"/>
        <circle cx="246" cy="260" r="1.2" fill="#ffffff" stroke="none"/>
      </g>`
    },
    {
      id: 'anklets', en: 'Anklets', he: 'צמידי קרסול', slot: 'anklewear',
      svg: `<g stroke="#444444" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="M239 629Q254 635 273 633M321 630Q336 628 350 621" fill="none" stroke="#eeeeee" stroke-width="2.5"/>
        <circle cx="242" cy="630" r="2" fill="#cccccc"/>
        <circle cx="250" cy="632" r="2" fill="#ffffff"/>
        <circle cx="259" cy="633" r="2" fill="#cccccc"/>
        <circle cx="268" cy="633" r="2" fill="#ffffff"/>
        <circle cx="325" cy="629" r="2" fill="#cccccc"/>
        <circle cx="333" cy="627" r="2" fill="#ffffff"/>
        <circle cx="341" cy="624" r="2" fill="#cccccc"/>
        <circle cx="348" cy="622" r="2" fill="#ffffff"/>
        <path d="M259 635L259 639 263 642 267 638 263 634Z" fill="#eeeeee"/>
        <path d="M335 629L334 633 338 636 342 631 338 628Z" fill="#eeeeee"/>
      </g>`
    }
  ],
  'manga-02': [
    {
      id: 'hat', en: 'Hat', he: 'כובע',
      svg: `<g stroke="#202020" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M245 134Q243 109 260 93Q278 76 301 80Q328 82 337 106L340 133 322 143 265 145Z" fill="#666666"/>
        <path d="M305 81Q325 101 323 132L339 135 337 106Q329 86 305 81Z" fill="#333333" stroke="none"/>
        <path d="M261 101Q255 115 255 132M270 93Q264 112 264 131M280 88Q274 109 275 130M290 86Q285 108 285 129M300 87Q299 110 297 129M310 92Q314 110 309 129M320 99Q326 114 321 129" fill="none" stroke="#aaaaaa" stroke-width="1.2"/>
        <path d="M244 130Q291 121 340 131L340 147Q291 137 246 147Z" fill="#d5d5d5"/>
        <path d="M248 136Q294 127 335 137" fill="none" stroke="#f5f5f5" stroke-width="1.4"/>
        <path d="M251 134L253 144M258 133L260 143M265 132L267 141M273 131L274 141M281 130L282 140M289 130V140M297 130V140M305 130L304 140M313 131L312 141M321 132L320 142M329 133L328 143M336 134L334 144" fill="none" stroke="#777777" stroke-width=".8"/>
        <path d="M308 128L325 130 324 144 307 142Z" fill="#fafafa" stroke-width="1.2"/>
        <path d="M310 139L315 132 318 137 320 135 323 140Z" fill="#444444" stroke="none"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#333333" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M266 182Q279 177 291 181L290 194Q280 201 269 193Z"/>
        <path d="M302 179Q315 174 328 178L327 191Q316 198 305 191Z"/>
        <path d="M291 185Q296 181 303 183M266 184L255 180M328 180L335 175"/>
        <path d="M270 182L279 180M306 179L315 177" stroke="#999999" stroke-width=".9"/>
        <path d="M270 195L274 197M307 193L311 195" stroke="#bbbbbb" stroke-width="1"/>
        <circle cx="267" cy="184" r="1" fill="#eeeeee" stroke="none"/>
        <circle cx="327" cy="180" r="1" fill="#eeeeee" stroke="none"/>
      </g>`
    },
    {
      id: 'gloves', en: 'Gloves', he: 'כפפות',
      svg: `<g stroke="#202020" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M176 410L199 418 202 438 196 441 193 435 187 438 180 438 174 447 166 443 173 429Z" fill="#444444"/>
        <path d="M176 416L186 425 194 426 198 435 192 432 183 434 175 441 171 438Z" fill="#777777" stroke="none"/>
        <path d="M175 413L197 420M169 440L175 443M180 434L187 435M193 431L199 435" fill="none" stroke="#dddddd" stroke-width="1.1"/>
        <path d="M180 421L183 426M184 420L187 426M188 422L191 427" fill="none" stroke="#bbbbbb" stroke-width=".8"/>
        <path d="M305 300L319 306 317 333 308 328 302 329 299 321 287 320 286 312 287 304 282 299 287 293 296 299 298 291 305 292Z" fill="#444444"/>
        <path d="M307 305L314 309 312 326 306 321 301 310 292 305 294 301 301 305Z" fill="#777777" stroke="none"/>
        <path d="M315 309L313 329M289 303L298 307M288 311L297 314M291 320L298 322M300 294L304 295" fill="none" stroke="#dddddd" stroke-width="1.1"/>
        <path d="M304 310L310 314M303 314L309 318M304 319L309 322" fill="none" stroke="#bbbbbb" stroke-width=".8"/>
      </g>`
    },
    {
      id: 'watch', en: 'Watch', he: 'שעון',
      svg: `<g stroke="#202020" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M323 301L332 305 322 337 313 333Z" fill="#555555"/>
        <path d="M326 306L318 331" fill="none" stroke="#bbbbbb" stroke-width="1.1"/>
        <circle cx="323" cy="319" r="9.5" fill="#cccccc"/>
        <circle cx="323" cy="319" r="7.1" fill="#fafafa" stroke-width="1"/>
        <path d="M323 313V314M329 319H328M323 325V324M317 319H318M323 315V319L327 321" fill="none" stroke-width="1"/>
        <circle cx="323" cy="319" r="1" fill="#333333" stroke="none"/>
        <path d="M332 318L335 319 334 323 331 322Z" fill="#aaaaaa" stroke-width="1"/>
        <path d="M317 314L319 312" fill="none" stroke="#ffffff" stroke-width="1.4"/>
      </g>`
    },
    {
      id: 'brooch', en: 'Brooch', he: 'סיכה',
      svg: `<g stroke="#202020" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M241 293L246 289 252 293 254 303 247 311 240 305Z" fill="#eeeeee"/>
        <path d="M244 294L248 292 251 295 251 302 247 307 243 303Z" fill="#555555" stroke-width=".9"/>
        <path d="M247 295L249 300 247 299 245 303Z" fill="#fafafa" stroke="none"/>
        <path d="M243 309Q237 326 251 330Q260 331 264 317" fill="none" stroke="#bbbbbb" stroke-width="2.6"/>
        <path d="M243 309Q237 326 251 330Q260 331 264 317" fill="none" stroke="#333333" stroke-width=".7"/>
        <circle cx="264" cy="316" r="2.7" fill="#eeeeee" stroke-width="1"/>
        <path d="M242 296L243 294M245 304L247 306" fill="none" stroke="#ffffff" stroke-width=".9"/>
      </g>`
    },
    {
      id: 'headband', en: 'Headband', he: 'סרט ראש', slot: 'headwear',
      svg: `<g stroke="#202020" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M242 149Q252 111 289 106Q319 101 338 130L334 136Q312 113 290 114Q260 117 249 153Z" fill="#555555"/>
        <path d="M248 143Q260 116 289 110Q315 107 332 129" fill="none" stroke="#eeeeee" stroke-width="1.1"/>
        <path d="M243 143L235 145 229 161 237 157 239 164 248 148Z" fill="#777777"/>
        <path d="M238 153L242 147" stroke="#dddddd" stroke-width="1"/>
        <path d="M277 109L280 115M284 108L287 113M291 108L294 113" stroke="#bbbbbb" stroke-width="2"/>
        <circle cx="245" cy="146" r="3.2" fill="#eeeeee"/>
      </g>`
    },
    {
      id: 'armband', en: 'Armband', he: 'סרט זרוע', slot: 'upper-arm',
      svg: `<g stroke="#202020" stroke-width="1.4" stroke-linejoin="round">
        <path d="M196 304L231 314 227 330 192 320Z" fill="#dddddd"/>
        <path d="M197 309L228 318M195 317L225 326" fill="none" stroke="#777777" stroke-width="1"/>
        <path d="M208 308L216 310 213 320 218 322 207 325 204 314 209 316Z" fill="#333333" stroke="none"/>
        <path d="M199 309L197 317M223 316L221 323" stroke="#ffffff" stroke-width="1"/>
      </g>`
    },
    {
      id: 'ring', en: 'Ring', he: 'טבעת', slot: 'fingerwear',
      svg: `<g stroke="#333333" stroke-width="1.1" stroke-linejoin="round">
        <path d="M182 451L192 450 193 456 182 457Z" fill="#bbbbbb"/>
        <path d="M183 452L191 451M183 455L191 454" stroke="#ffffff" stroke-width=".8"/>
        <path d="M184 448L189 447 192 451 189 455 184 454 182 451Z" fill="#eeeeee"/>
        <path d="M185 449L189 449 190 451 188 453 184 452Z" fill="#555555" stroke-width=".7"/>
        <path d="M185 450L188 450" stroke="#ffffff" stroke-width=".8"/>
      </g>`
    },
    {
      id: 'belt', en: 'Belt', he: 'חגורה', slot: 'waistwear',
      svg: `<g stroke="#202020" stroke-width="1.5" stroke-linejoin="round">
        <path d="M258 430Q295 442 329 429L332 440Q296 454 255 441Z" fill="#444444"/>
        <path d="M260 434Q294 446 329 434M259 439Q293 451 329 439" fill="none" stroke="#aaaaaa" stroke-width=".8"/>
        <path d="M283 436L306 436 307 450 283 450Z" fill="#dddddd"/>
        <path d="M288 439L302 439 302 446 288 446Z" fill="#555555" stroke-width="1"/>
        <path d="M294 442H305" stroke="#eeeeee" stroke-width="1.5"/>
        <path d="M268 434L266 444M317 435L319 444" stroke="#222222" stroke-width="2.5"/>
      </g>`
    },
    {
      id: 'shoulder-cord', en: 'Shoulder cord', he: 'שרוך כתף', slot: 'shoulderwear',
      svg: `<g fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M355 270Q352 292 373 312Q388 320 380 289M360 270Q360 292 376 303Q384 309 379 284" stroke="#202020" stroke-width="4"/>
        <path d="M355 270Q352 292 373 312Q388 320 380 289M360 270Q360 292 376 303Q384 309 379 284" stroke="#dddddd" stroke-width="2.5"/>
        <path d="M355 279L359 279M357 287L361 286M361 296L365 294M367 304L370 301M375 313L377 309M381 311L384 311M381 303L384 301" stroke="#777777" stroke-width="1"/>
        <path d="M351 267L358 263 380 281 377 288Z" fill="#777777" stroke="#202020" stroke-width="1.4"/>
        <path d="M355 268L376 284" stroke="#eeeeee" stroke-width="1"/>
        <circle cx="357" cy="269" r="2" fill="#eeeeee" stroke="#333333" stroke-width=".8"/>
        <circle cx="376" cy="283" r="2" fill="#eeeeee" stroke="#333333" stroke-width=".8"/>
      </g>`
    }
  ]
});

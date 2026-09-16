window.CharacterAccessories = window.CharacterAccessories || {};

// Coordinates include each source character's head and whole-body scaling.
Object.assign(window.CharacterAccessories, {
  'superhero-01': [
    {
      id: 'hat', en: 'Cap', he: 'כובע מצחייה',
      svg: `<g stroke="#203b43" stroke-width="2.5" stroke-linejoin="round">
        <path fill="#285961" d="M269 111Q267 82 294 78Q321 77 330 102L329 117 272 120Z"/>
        <path fill="#3b7e80" stroke="none" d="M274 105Q277 85 294 84L296 109Z"/>
        <path fill="none" stroke="#76aaa3" stroke-width="1.5" d="M299 83Q311 91 313 109M278 91Q273 101 275 107"/>
        <path fill="#173c49" d="M270 108Q297 104 329 111L343 118Q321 128 299 118L270 121Z"/>
        <path fill="none" stroke="#d9ab72" stroke-width="3" d="M272 112Q299 110 326 114"/>
        <path fill="#e8bb7e" stroke-width="1.3" d="m293 91 6-3 6 4-2 10-5 4-5-4Z"/>
        <path fill="#fff0be" stroke="none" d="m297 93 3 0 1 7-3 2Z"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#273d48" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
        <path d="M270 141 265 140M323 140 327 137M293 145Q297 141 301 145"/>
        <path d="M271 141Q279 137 291 141L293 149Q287 155 279 152Q272 152 271 141ZM301 141Q311 136 321 140L320 149Q313 154 304 151Z"/>
        <path stroke="#e7bb7d" stroke-width="1" d="M273 141Q282 139 289 141M303 140Q312 138 319 140"/>
        <path stroke="#fff9e5" stroke-width="1.2" d="m275 144 3-2m28 1 3-2"/>
      </g>`
    },
    {
      id: 'scarf', en: 'Scarf', he: 'צעיף',
      svg: `<g stroke="#6f4d3c" stroke-width="2.2" stroke-linejoin="round">
        <path fill="#df9d64" d="M280 196Q294 220 317 203L329 204Q317 229 292 231L273 215Z"/>
        <path fill="#f3c58c" d="M276 201Q289 222 317 209L322 217Q292 239 273 215Z"/>
        <path fill="#d58c56" d="M318 219Q339 239 355 260L339 265 343 276Q322 256 311 229Z"/>
        <path fill="#efbd80" d="M317 220Q327 232 328 247L314 245 310 258Q304 240 305 229Z"/>
        <path fill="#eeb77b" d="M308 216 321 216 325 226 314 234 305 228Z"/>
        <path fill="none" stroke="#ffe1ab" stroke-width="1.6" d="M280 209Q293 223 307 216M323 232 341 253M312 233 316 243"/>
        <path fill="none" stroke="#9e643f" stroke-width="1.3" d="m337 260 4 4m4-8 4 4m-34-6 1 5m5-7 2 5"/>
      </g>`
    },
    {
      id: 'necklace', en: 'Necklace', he: 'שרשרת',
      svg: `<g stroke-linejoin="round">
        <path d="M266 229Q255 286 296 316Q334 300 336 273" fill="none" stroke="#77593f" stroke-width="4"/>
        <path d="M266 229Q255 286 296 316Q334 300 336 273" fill="none" stroke="#efc77e" stroke-width="2"/>
        <ellipse cx="296" cy="318" rx="3.5" ry="5" fill="#e9bd76" stroke="#77593f" stroke-width="1.3"/>
        <path fill="#edc58a" stroke="#233e49" stroke-width="2" d="m296 320 10 8-3 13-14 0-4-13Z"/>
        <path fill="#285764" stroke="#ab784e" stroke-width="1.3" d="m296 324 6 6-3 7-7 0-3-7Z"/>
        <path fill="#fff2be" d="m296 325 2 5-2 5-2-5Z"/>
      </g>`
    },
    {
      id: 'ring', en: 'Ring', he: 'טבעת',
      svg: `<g stroke="#77583d" stroke-width="1.3" stroke-linejoin="round">
        <path fill="#efc985" d="m169 446 10-1 0 6-10 1Z"/>
        <path fill="#fff0ba" stroke="none" d="m170 447 8-1 0 2-8 1Z"/>
        <path fill="#528f8b" d="m171 445 3-3 4 2-1 5-5 1Z"/>
        <path d="m174 444 1 3" stroke="#cefff0" stroke-width="1"/>
      </g>`
    },
    {
      id: 'headband', slot: 'headwear', en: 'Headband', he: 'סרט ראש',
      svg: `<g stroke="#28444c" stroke-width="2" stroke-linejoin="round">
        <path fill="#deb279" d="M267 122Q296 109 328 121L326 130Q295 120 268 132Z"/>
        <path fill="none" stroke="#ffdf9f" stroke-width="2" d="M271 124Q296 114 324 124"/>
        <path fill="#316c73" d="m294 114 6-4 6 5-1 10-7 4-6-5Z"/>
        <path fill="#eaf4d7" stroke="none" d="m298 115 3 2-2 7-3-3Z"/>
      </g>`
    },
    {
      id: 'bow-tie', slot: 'neckwear', en: 'Bow tie', he: 'עניבת פרפר',
      svg: `<g stroke="#755442" stroke-width="2" stroke-linejoin="round">
        <path fill="none" stroke="#b6875c" stroke-width="4" d="M282 204Q299 218 318 203"/>
        <path fill="#e7b87b" d="M295 215 277 205 275 225 294 222ZM302 215 319 205 324 224 303 223Z"/>
        <path fill="none" stroke="#fff1bd" stroke-width="1.5" d="m280 211 11 7-11 3m36-10-10 7 12 2"/>
        <path fill="#c98f59" d="m294 212 9 0 1 13-10 0Z"/>
        <path d="m298 215 0 7" stroke="#f9d59c" stroke-width="1.5"/>
      </g>`
    },
    {
      id: 'armband', slot: 'upperarm', en: 'Armband', he: 'סרט זרוע',
      svg: `<g stroke="#2a454c" stroke-width="2.2" stroke-linejoin="round">
        <path fill="#e4c693" d="M176 275Q193 288 216 281L211 294Q190 300 175 289Z"/>
        <path fill="none" stroke="#fff0c6" stroke-width="2" d="M179 279Q194 290 212 285"/>
        <path fill="#537c73" d="m189 281 12 3-2 11-12-3Z"/>
        <path fill="#eaf6cf" stroke="none" d="m193 284 3 1-1 3 3 1-1 3-3-1-1 2-2-1 1-3-3-1 1-2 3 1Z"/>
      </g>`
    },
    {
      id: 'brooch', slot: 'chest-decoration', en: 'Leaf brooch', he: 'סיכת עלה',
      svg: `<g stroke="#765839" stroke-width="1.6" stroke-linejoin="round">
        <path fill="#d4a264" d="M236 282Q229 269 246 264Q250 277 240 284L240 290Z"/>
        <path fill="#edcf94" d="M240 283Q242 269 255 275Q252 287 240 286Z"/>
        <path fill="none" stroke="#fff0bd" stroke-width="1.4" d="m239 278 4-9m-1 13 9-5"/>
        <path fill="none" stroke="#97673f" stroke-width="1.3" d="m241 271-3 1m7 8 1 3"/>
      </g>`
    },
    {
      id: 'boot-chain', slot: 'footwear', en: 'Boot chain', he: 'שרשרת למגף',
      svg: `<g stroke-linecap="round" stroke-linejoin="round">
        <path fill="none" stroke="#805f40" stroke-width="4" d="M236 634Q244 668 277 641"/>
        <path fill="none" stroke="#f0ca85" stroke-width="2" d="M236 634Q244 668 277 641"/>
        <g fill="#f5d291" stroke="#805f40" stroke-width="1.3">
          <circle cx="236" cy="634" r="3"/><circle cx="277" cy="641" r="3"/>
          <circle cx="242" cy="647" r="2.5"/><circle cx="251" cy="653" r="2.5"/><circle cx="262" cy="651" r="2.5"/>
          <path d="m252 656 5 4-2 7-6-1-1-6Z"/>
        </g>
        <path d="m252 660 1 3" stroke="#fff4cd" stroke-width="1.5"/>
      </g>`
    }
  ],
  'superhero-02': [
    {
      id: 'hat', en: 'Beret', he: 'כובע ברט',
      svg: `<g stroke="#49344f" stroke-width="2.3" stroke-linejoin="round">
        <path fill="#78536e" d="M265 94Q248 87 260 71Q276 51 312 59Q337 63 337 81Q335 94 317 96Z"/>
        <path fill="#a5778d" stroke="none" d="M261 77Q275 58 306 62Q320 63 326 69Q286 61 271 83Z"/>
        <path fill="#503a57" d="M265 89Q293 79 323 87L322 99Q293 90 268 101Z"/>
        <path fill="none" stroke="#d4acb4" stroke-width="1.6" d="M266 92Q292 84 319 91M270 71Q278 63 290 63"/>
        <path fill="#6a4865" d="M292 59 294 51 301 52 300 59Z"/>
        <path fill="#f4bb98" stroke-width="1.3" d="m311 70 2 5 6 0-5 4 2 6-5-3-5 3 2-6-4-4 6 0Z"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#674562" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
        <path d="m270 132-8-4m63 4 7-5M295 135Q299 132 303 135"/>
        <path d="M270 131Q283 127 294 132L294 142Q283 150 273 141ZM303 132Q316 126 326 131L323 141Q313 149 304 141Z"/>
        <path stroke="#efb99d" stroke-width="1" d="M273 131Q283 129 292 132M306 131Q316 128 323 131"/>
        <path stroke="#fff8ed" stroke-width="1.3" d="m275 134 4-2m29 2 4-2"/>
      </g>`
    },
    {
      id: 'necklace', en: 'Necklace', he: 'שרשרת',
      svg: `<g stroke-linejoin="round">
        <path fill="none" stroke="#67445d" stroke-width="3.6" d="M275 232Q270 276 298 291Q330 271 327 235"/>
        <path fill="none" stroke="#f4caa4" stroke-width="1.8" d="M275 232Q270 276 298 291Q330 271 327 235"/>
        <ellipse cx="298" cy="293" rx="3" ry="4" fill="#f4caa4" stroke="#67445d" stroke-width="1.2"/>
        <path fill="#e8918f" stroke="#67445d" stroke-width="1.8" d="M298 299Q287 290 286 301Q287 308 298 315Q309 307 310 301Q309 290 298 299Z"/>
        <path fill="#ffd3b8" stroke="none" d="M290 298Q293 296 296 300L293 304Q289 302 290 298Z"/>
      </g>`
    },
    {
      id: 'hair-clip', en: 'Hair clip', he: 'סיכת שיער',
      svg: `<g stroke="#664554" stroke-width="1.5" stroke-linejoin="round">
        <path fill="#f4c19b" d="m328 101 6 1 1 19-6 2Z"/>
        <path d="m331 105 1 14" fill="none" stroke="#fff0d3" stroke-width="1.4"/>
        <path fill="#c0e2d7" d="m327 108 4-5 5 4-1 7-5 2Z"/>
        <path fill="#eef9df" stroke="none" d="m331 106 2 2-2 5-2-4Z"/>
      </g>`
    },
    {
      id: 'ring', en: 'Ring', he: 'טבעת',
      svg: `<g stroke="#76515b" stroke-width="1.2" stroke-linejoin="round">
        <path fill="#f2cbad" d="m413 402 7-3 3 6-8 3Z"/>
        <path fill="#fff0d3" stroke="none" d="m414 402 5-2 1 2-5 2Z"/>
        <path fill="#88c6bf" d="m416 399 4-1 3 3-2 4-4-1Z"/>
        <path d="m419 400 1 2" stroke="#e7fff0" stroke-width="1"/>
      </g>`
    },
    {
      id: 'scarf', slot: 'neckwear', en: 'Silk scarf', he: 'צעיף משי',
      svg: `<g stroke="#5f4864" stroke-width="2" stroke-linejoin="round">
        <path fill="#a5cec4" d="M285 194Q298 211 313 195L319 204Q301 223 280 206Z"/>
        <path fill="#d1e9d9" d="M283 199Q298 215 315 201L315 209Q297 224 281 207Z"/>
        <path fill="#82b4ad" d="M316 208Q343 216 356 243L344 242 341 253Q324 233 309 217Z"/>
        <path fill="#b8d8c9" d="M312 210Q326 223 325 239L315 233 309 240 305 219Z"/>
        <path fill="#c7e3d1" d="m307 207 12 1 3 9-12 7-7-9Z"/>
        <path fill="none" stroke="#f2f5d8" stroke-width="1.5" d="M287 206Q295 213 305 209M322 222 341 242M312 215l4-3"/>
      </g>`
    },
    {
      id: 'armband', slot: 'upperarm', en: 'Armband', he: 'סרט זרוע',
      svg: `<g stroke="#57435f" stroke-width="2" stroke-linejoin="round">
        <path fill="#8ab8b3" d="M354 258Q366 264 382 254L387 268Q373 279 360 271Z"/>
        <path fill="none" stroke="#d8eee0" stroke-width="2" d="M358 262Q371 267 382 260"/>
        <path fill="#e8d9c0" d="m367 260 10-2 4 12-10 3Z"/>
        <path fill="#9a657e" stroke="none" d="m372 263 2-1 1 3 3-1 1 2-3 1 1 3-2 1-1-3-3 1-1-2 3-1Z"/>
      </g>`
    },
    {
      id: 'ribbon-badge', slot: 'chest-decoration', en: 'Ribbon badge', he: 'תג סרט',
      svg: `<g stroke="#68526a" stroke-width="1.7" stroke-linejoin="round">
        <path fill="#bf88a1" d="m243 249-7 22 7-2 4 6 5-24Zm9 0 3 22 5-5 6 2-6-20Z"/>
        <path fill="#efc99d" d="m251 235 4 3 5 0 1 5 3 4-3 4-1 5-5 0-4 3-4-3-5 0-1-5-3-4 3-4 1-5 5 0Z"/>
        <circle cx="251" cy="247" r="7" fill="#b4d8cc" stroke-width="1.3"/>
        <path fill="none" stroke="#fff7db" stroke-width="1.8" d="m247 247 3 3 5-6"/>
      </g>`
    },
    {
      id: 'boot-bow', slot: 'footwear', en: 'Boot bow', he: 'פפיון למגף',
      svg: `<g stroke="#704d68" stroke-width="1.7" stroke-linejoin="round">
        <path fill="#dba8b7" d="M250 648Q232 632 232 645Q231 657 248 653ZM253 648Q272 633 270 647Q269 659 254 653Z"/>
        <path fill="#a97491" d="m248 652-7 17 7-3 4 5 2-16 8 12 3-6 5 2-14-12Z"/>
        <path fill="none" stroke="#f9d7ce" stroke-width="1.5" d="m237 644 10 6m18-7-9 7"/>
        <ellipse cx="252" cy="651" rx="4.5" ry="5" fill="#f2d49f"/>
      </g>`
    },
    {
      id: 'waist-chain', slot: 'waist-accessory', en: 'Waist chain', he: 'שרשרת מותן',
      svg: `<g stroke-linecap="round" stroke-linejoin="round">
        <path fill="none" stroke="#795366" stroke-width="3.5" d="M262 406Q277 447 321 414"/>
        <path fill="none" stroke="#edc5ac" stroke-width="1.8" d="M262 406Q277 447 321 414"/>
        <g fill="#edc5ac" stroke="#795366" stroke-width="1.2">
          <circle cx="262" cy="406" r="3"/><circle cx="321" cy="414" r="3"/>
          <circle cx="283" cy="428" r="2.4"/><circle cx="294" cy="429" r="2.4"/><circle cx="305" cy="424" r="2.4"/>
          <path d="m289 433 5 6-4 8-5-7Z"/>
        </g>
        <path fill="#99c6bc" stroke="none" d="m289 436 2 3-1 4-2-3Z"/>
      </g>`
    }
  ],
  'cartoon-01': [
    {
      id: 'hat', en: 'Cap', he: 'כובע מצחייה',
      svg: `<g stroke="#425b52" stroke-width="2.8" stroke-linejoin="round">
        <path fill="#739d80" d="M236 120Q229 78 270 66Q306 54 336 74Q350 87 354 114L303 135Z"/>
        <path fill="#a8c6a0" stroke="none" d="M243 112Q244 79 275 72Q290 67 300 70Q269 79 270 119Z"/>
        <path fill="none" stroke="#c7d8b0" stroke-width="1.8" d="M301 69Q323 83 326 115M268 74Q255 90 258 117"/>
        <path fill="#416f65" d="M235 115Q276 116 311 107Q337 103 362 117Q351 132 319 135L295 125Q265 131 239 129Z"/>
        <path fill="#b4d2af" stroke="none" d="M307 112Q335 106 354 117Q333 123 312 121L297 119Z"/>
        <path fill="#f6d7a0" stroke-width="1.6" d="m282 82 18-2 7 17-11 12-15-9Z"/>
        <path fill="#69916f" stroke="none" d="m289 100-1-13 10 5Z"/>
        <path d="m287 90 7 5" stroke="#fff1c7" stroke-width="1.3"/>
        <ellipse cx="288" cy="65" rx="7" ry="3.5" fill="#4a7665" stroke-width="1.7"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#476a62" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="m251 192-17-2m117-2 8-5M291 198Q298 191 306 197"/>
        <ellipse cx="272" cy="199" rx="21" ry="23"/>
        <ellipse cx="327" cy="195" rx="21" ry="23"/>
        <path stroke="#b7d1a5" stroke-width="1.2" d="M257 185Q267 174 280 179M313 181Q325 171 336 178"/>
        <path stroke="#fff7d9" stroke-width="1.6" d="m257 192 5-5m51 1 5-5"/>
      </g>`
    },
    {
      id: 'scarf', en: 'Neckerchief', he: 'מטפחת צוואר',
      svg: `<g stroke="#956044" stroke-width="2.3" stroke-linejoin="round">
        <path fill="#e9bd70" d="M270 274Q291 291 320 275L326 289 291 326 264 289Z"/>
        <path fill="#f9db95" d="M270 274Q285 287 300 283L318 277 312 292 291 312 270 293Z"/>
        <path fill="none" stroke="#fff0b6" stroke-width="2" d="m269 286 22 33 25-29"/>
        <path fill="#d69a59" d="m313 287 11 3 14 35-13-3-3 10-13-33Z"/>
        <path fill="#efc17c" d="m310 286 15-1 4 10-11 9-12-9Z"/>
        <path fill="none" stroke="#ffebb0" stroke-width="1.5" d="m317 290 5 5m-3 8 9 17"/>
        <g fill="#bd8751" stroke="none"><circle cx="284" cy="291" r="2"/><circle cx="292" cy="299" r="2"/><circle cx="301" cy="291" r="2"/></g>
      </g>`
    },
    {
      id: 'watch', en: 'Watch', he: 'שעון',
      svg: `<g stroke="#4c6557" stroke-width="2" stroke-linejoin="round">
        <path fill="#638e77" d="m190 442 26 4-2 15-26-4Z"/>
        <path fill="#a8c5a0" stroke="none" d="m191 444 23 4-1 3-23-4Z"/>
        <path fill="none" stroke="#c6d7ae" stroke-width="1.2" d="m191 454 20 4"/>
        <circle cx="201" cy="452" r="12" fill="#e9c487"/>
        <circle cx="201" cy="452" r="8.5" fill="#fff3ce" stroke-width="1.2"/>
        <path d="m201 446 0 6 4 3" fill="none" stroke="#456b60" stroke-width="1.7" stroke-linecap="round"/>
        <path d="M201 444v2m0 12v2m-8-8h2m12 0h2" stroke="#b6935e" stroke-width="1.1"/>
        <circle cx="201" cy="452" r="1.4" fill="#c17a55" stroke="none"/>
        <path d="m213 450 3 0 0 4-3 0" fill="#d0a268" stroke-width="1"/>
      </g>`
    },
    {
      id: 'bracelet', en: 'Bracelet', he: 'צמיד',
      svg: `<g stroke="#80594a" stroke-width="1.5" stroke-linejoin="round">
        <path d="M331 358Q343 358 351 347L356 352Q347 365 335 365Z" fill="#e8c084"/>
        <path d="M335 360Q347 358 352 351" fill="none" stroke="#fff0ba" stroke-width="1.8"/>
        <circle cx="335" cy="360" r="3.3" fill="#eeb786"/>
        <circle cx="341" cy="358" r="3.3" fill="#8ac2ae"/>
        <circle cx="347" cy="355" r="3.3" fill="#eeb786"/>
        <circle cx="352" cy="351" r="3.3" fill="#8ac2ae"/>
        <path fill="#f4d38e" d="m340 364 5 3-1 6-5 1-3-5Z"/>
        <path d="m340 367 2 2" stroke="#fff1bf" stroke-width="1.1"/>
      </g>`
    },
    {
      id: 'earmuffs', slot: 'headwear', en: 'Earmuffs', he: 'מחממי אוזניים',
      svg: `<g stroke="#725449" stroke-width="2.4" stroke-linejoin="round">
        <path fill="none" stroke-width="11" d="M235 194Q212 85 294 81Q377 79 365 188"/>
        <path fill="none" stroke="#efc782" stroke-width="6" d="M235 194Q212 85 294 81Q377 79 365 188"/>
        <ellipse cx="235" cy="203" rx="14" ry="23" fill="#cf9873"/>
        <ellipse cx="365" cy="197" rx="13" ry="23" fill="#cf9873"/>
        <ellipse cx="232" cy="201" rx="8" ry="16" fill="#f4d9a4" stroke="none"/>
        <ellipse cx="363" cy="195" rx="7" ry="16" fill="#f4d9a4" stroke="none"/>
        <path fill="none" stroke="#fff0c6" stroke-width="1.7" d="m228 193 1 12m132-18 1 12"/>
      </g>`
    },
    {
      id: 'bow-tie', slot: 'neckwear', en: 'Bow tie', he: 'עניבת פרפר',
      svg: `<g stroke="#4b7368" stroke-width="2.2" stroke-linejoin="round">
        <path fill="none" stroke="#779581" stroke-width="5" d="M269 279Q291 296 320 279"/>
        <path fill="#a8cab1" d="m288 290-24-13-1 27 24-4Zm10 0 24-13 4 27-26-4Z"/>
        <path fill="#6d9b86" d="m288 287 11 0 3 16-14 1Z"/>
        <path fill="none" stroke="#edf2c9" stroke-width="1.7" d="m269 285 13 9-14 5m48-14-12 9 16 5m-27-8 1 9"/>
        <g fill="#dfe8bc" stroke="none"><circle cx="272" cy="290" r="1.7"/><circle cx="317" cy="293" r="1.7"/></g>
      </g>`
    },
    {
      id: 'whistle-necklace', slot: 'necklace', en: 'Whistle necklace', he: 'שרשרת משרוקית',
      svg: `<g stroke="#7d6550" stroke-width="1.8" stroke-linejoin="round">
        <path fill="none" stroke="#765543" stroke-width="3" d="M268 312Q268 339 288 350Q310 336 315 312"/>
        <path fill="none" stroke="#e9c596" stroke-width="1.2" d="M268 312Q268 339 288 350Q310 336 315 312"/>
        <ellipse cx="289" cy="351" rx="3" ry="4" fill="#e9c596"/>
        <path fill="#d5bd85" d="m288 354 11-5 4 8-8 5q-2 9-10 6-8-4-3-11Z"/>
        <circle cx="288" cy="360" r="4" fill="#af9871" stroke-width="1"/>
        <path d="m296 353 3-1 1 3-3 1Z" fill="#54695d" stroke="none"/>
        <path d="m284 357 5-2" stroke="#fff0bd" stroke-width="1.5"/>
      </g>`
    },
    {
      id: 'explorer-badge', slot: 'chest-decoration', en: 'Explorer badge', he: 'תג סייר',
      svg: `<g stroke="#82614a" stroke-width="1.8" stroke-linejoin="round">
        <path fill="#f1d59f" d="M241 421Q254 417 263 425L261 441 249 447 238 438Z"/>
        <path fill="#769e7a" stroke-width="1.1" d="m244 426 13 1-1 11-7 4-7-7Z"/>
        <path fill="#e3e5b7" stroke="none" d="m244 437 5-9 6 10Z"/>
        <path fill="#fff3d0" stroke="none" d="m247 432 2-4 3 5-3-1Z"/>
        <path fill="none" stroke="#be9868" stroke-width="1.1" stroke-dasharray="1 3" d="m242 424 17 2-1 13-9 5-9-7Z"/>
      </g>`
    },
    {
      id: 'shoe-charm', slot: 'footwear', en: 'Shoe charm', he: 'קישוט לנעל',
      svg: `<g stroke="#6c6850" stroke-width="1.6" stroke-linejoin="round">
        <path fill="none" stroke="#ddc69b" stroke-width="3" d="M236 686Q233 701 223 701"/>
        <path fill="none" stroke="#fff2ca" stroke-width="1.2" d="M236 686Q233 701 223 701"/>
        <ellipse cx="222" cy="701" rx="3" ry="4" fill="#eed09a"/>
        <path fill="#edc27f" d="m218 701 3 6 7 0-5 5 2 7-7-4-6 4 1-7-5-5 7 0Z"/>
        <path fill="#fff0b7" stroke="none" d="m218 705 2 5-3 3-3-4Z"/>
        <circle cx="235" cy="686" r="2.3" fill="#f8dfb0"/>
      </g>`
    }
  ],
  'cartoon-02': [
    {
      id: 'hat', en: 'Hat', he: 'כובע',
      svg: `<g stroke="#755b6c" stroke-width="2.4" stroke-linejoin="round">
        <path fill="#ce9ba5" d="M266 133 271 104Q299 93 326 106L333 135Z"/>
        <path fill="#eec5bd" stroke="none" d="M277 107Q289 103 298 104L294 130 272 132Z"/>
        <path fill="#ac788f" d="M267 124Q299 118 330 127L333 139 265 140Z"/>
        <path fill="#dfb0b1" d="M264 133Q295 126 335 135L348 150Q309 162 253 149Z"/>
        <path fill="none" stroke="#ffe0cc" stroke-width="1.7" d="M260 146Q299 154 340 147M275 108 272 120"/>
        <path fill="none" stroke="#986b81" stroke-width="1.2" stroke-dasharray="2 3" d="M260 143Q299 151 340 144"/>
        <path fill="#b0d8c5" stroke-width="1.4" d="M320 128Q307 115 309 130Q311 139 320 135Q330 121 320 121Z"/>
        <circle cx="319" cy="131" r="3.5" fill="#ffe3a1" stroke-width="1.2"/>
      </g>`
    },
    {
      id: 'glasses', en: 'Glasses', he: 'משקפיים',
      svg: `<g fill="none" stroke="#7d566e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <path d="m256 201-15-4m107 3 6-5M291 207Q297 201 304 206"/>
        <path d="M254 199Q270 190 289 200L291 218Q276 233 260 220ZM304 199Q322 187 341 197L338 216Q322 229 306 217Z"/>
        <path stroke="#efc8bf" stroke-width="1.2" d="M258 199Q273 193 286 201M307 199Q323 191 337 198"/>
        <path stroke="#fff7e3" stroke-width="1.6" d="m261 204 4-3m46 1 4-3"/>
      </g>`
    },
    {
      id: 'scarf', en: 'Scarf', he: 'צעיף',
      svg: `<g stroke="#6d667b" stroke-width="2.3" stroke-linejoin="round">
        <path fill="#9ba8cf" d="M270 276Q291 296 322 277L327 290Q300 309 272 295L265 286Z"/>
        <path fill="#c3cce7" d="M270 278Q294 295 319 282L321 290Q296 309 269 292Z"/>
        <path fill="#8494c0" d="M271 290Q253 308 247 337L261 333 268 342Q270 317 280 303Z"/>
        <path fill="#b5c1df" d="M275 296Q285 316 280 331L270 328 266 335 267 301Z"/>
        <path fill="#b4bfde" d="m269 288 13 4 3 12-13 4-9-10Z"/>
        <path fill="none" stroke="#eef0f9" stroke-width="1.8" d="M279 288Q297 298 313 289M271 294 278 299M267 309 257 328"/>
        <path fill="none" stroke="#ead09b" stroke-width="2" d="m251 334-2 6m7-9-2 6m6-5-1 6m11-9-1 5m6-4-1 5"/>
      </g>`
    },
    {
      id: 'bracelet', en: 'Bracelet', he: 'צמיד',
      svg: `<g stroke="#716961" stroke-width="1.5" stroke-linejoin="round">
        <path fill="#9acdb7" d="m410 352 8-5q-2 11 9 22l-9 4q-10-10-8-21Z"/>
        <path fill="none" stroke="#dcf0cc" stroke-width="1.8" d="M414 351Q413 362 422 369"/>
        <circle cx="414" cy="352" r="3.7" fill="#f5d290"/>
        <circle cx="415" cy="360" r="3.7" fill="#e7a19a"/>
        <circle cx="420" cy="367" r="3.7" fill="#f5d290"/>
        <path fill="#dba7b2" d="m420 372 5 3-1 7-6-1-2-5Z"/>
        <path d="m420 375 2 3" stroke="#ffe2d2" stroke-width="1.2"/>
      </g>`
    },
    {
      id: 'watch', en: 'Watch', he: 'שעון',
      svg: `<g stroke="#785d6e" stroke-width="1.8" stroke-linejoin="round">
        <path fill="#d59eaa" d="m188 380 26 10-6 14-25-11Z"/>
        <path fill="none" stroke="#f5d1c6" stroke-width="1.5" d="m188 383 23 9m-26-1 22 10"/>
        <circle cx="198" cy="392" r="11.5" fill="#f3d59a"/>
        <circle cx="198" cy="392" r="8" fill="#fff1d8" stroke-width="1"/>
        <path fill="none" stroke="#76688b" stroke-width="1.7" stroke-linecap="round" d="m198 387 0 5-4 2"/>
        <path d="M198 385v1m0 12v1m-7-7h1m12 0h1" stroke="#b09069" stroke-width="1.2"/>
        <circle cx="198" cy="392" r="1.4" fill="#b47c91" stroke="none"/>
        <path d="m209 392 3 1-1 4-3-1" fill="#d7b778" stroke-width="1"/>
      </g>`
    },
    {
      id: 'headband', slot: 'headwear', en: 'Headband', he: 'סרט ראש',
      svg: `<g stroke="#6c586b" stroke-width="2.2" stroke-linejoin="round">
        <path fill="#a9cdbd" d="M246 178Q239 129 279 121Q325 109 348 149L351 171 343 167Q337 131 304 129Q265 124 254 158L253 180Z"/>
        <path fill="none" stroke="#e5efcf" stroke-width="1.7" d="M248 159Q256 121 295 124Q328 123 342 148"/>
        <path fill="#efc794" stroke-width="1.5" d="M273 125Q259 109 258 122Q253 134 269 133Q282 142 283 132Q287 121 273 125Z"/>
        <circle cx="270" cy="128" r="4.2" fill="#d8949f" stroke-width="1.2"/>
      </g>`
    },
    {
      id: 'tie', slot: 'neckwear', en: 'Tie', he: 'עניבה',
      svg: `<g stroke="#6c5474" stroke-width="2" stroke-linejoin="round">
        <path fill="none" stroke="#9b85a9" stroke-width="4" d="M276 283Q297 299 320 282"/>
        <path fill="#ab92b8" d="m293 290 14 0 3 9-9 8-10-8Z"/>
        <path fill="#bba3c9" d="m297 305 8-2 9 37-10 14-13-11Z"/>
        <path fill="#dfc9da" stroke="none" d="m296 315 11 3 2 8-14-5Zm-2 20 17 4-7 9-11-7Z"/>
        <path fill="none" stroke="#f1dce5" stroke-width="1.5" d="m296 293 7 0m-3 14-3 25"/>
      </g>`
    },
    {
      id: 'ring', slot: 'ring', en: 'Flower ring', he: 'טבעת פרח',
      svg: `<g stroke="#92765d" stroke-width="1.2" stroke-linejoin="round">
        <path fill="#f0cc8b" d="m460 331 6-3 4 7-6 3Z"/>
        <path fill="#dba5b7" d="M463 329Q462 323 467 326Q472 322 472 328Q478 331 472 333Q471 338 467 333Q461 335 463 329Z"/>
        <circle cx="468" cy="330" r="2.2" fill="#fff0ae"/>
        <path d="m463 333 2 3" stroke="#fff3c8" stroke-width="1"/>
      </g>`
    },
    {
      id: 'rainbow-badge', slot: 'chest-decoration', en: 'Rainbow badge', he: 'תג קשת',
      svg: `<g stroke="#8c795e" stroke-width="1.5" stroke-linejoin="round">
        <circle cx="347" cy="344" r="13" fill="#fff0c5"/>
        <path fill="none" stroke="#cd849e" stroke-width="3" d="M338 347Q338 334 347 334Q356 334 356 347"/>
        <path fill="none" stroke="#e4ba70" stroke-width="2.5" d="M341 347Q341 337 347 337Q353 337 353 347"/>
        <path fill="none" stroke="#91b9a9" stroke-width="2.5" d="M344 347Q344 340 347 340Q350 340 350 347"/>
        <path fill="#eceddb" stroke-width="1" d="M334 348Q332 343 337 343Q339 338 342 343Q347 344 343 349Zm17 0Q347 343 352 343Q355 339 358 344Q362 346 358 349Z"/>
      </g>`
    },
    {
      id: 'leg-warmers', slot: 'legwear', en: 'Leg warmers', he: 'מחממי רגליים',
      svg: `<g stroke="#6e6379" stroke-width="2.3" stroke-linejoin="round">
        <path fill="#b7a9ca" d="M234 588Q255 594 283 588L281 634Q257 640 232 633L235 622 232 612 235 601Z"/>
        <path fill="#b7a9ca" d="M334 592Q348 588 364 582L379 627Q363 638 343 639L342 628 337 617 338 606Z"/>
        <path fill="#d8cce0" stroke="none" d="m240 596 11 2-3 31-10-1Zm101 0 7-2 13 33-11 3Z"/>
        <path fill="none" stroke="#9386ac" stroke-width="2" d="M237 602Q255 608 280 602M236 614Q256 619 280 614M236 625Q254 631 278 626M340 604 367 595M343 614 371 606M347 626 375 617"/>
        <path fill="none" stroke="#ebe0e9" stroke-width="1.5" d="M238 592Q256 599 279 592M338 594 362 586M236 630Q255 636 277 631M349 633 374 624"/>
      </g>`
    }
  ]
});

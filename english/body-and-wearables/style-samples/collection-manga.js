/* Original fashion-manga drawings. All geometry and teaching targets use the 600 × 800 artboard. */
(function () {
  'use strict';
  window.IllustratedCharacters = window.IllustratedCharacters || {};
  window.IllustratedLayers = window.IllustratedLayers || {};
  window.CharacterAccessories = window.CharacterAccessories || {};
  const ink = '#343039';
  const n = v => +v.toFixed(3);
  const mix = (a,b,t) => a.map((v,i)=>n(v+(b[i]-v)*t));
  const ellipse = (cx,cy,rx,ry,angle=0) => ({cx:n(cx),cy:n(cy),rx:n(rx),ry:n(ry),angle:n(angle)});
  const span = (a,b,r) => ellipse((a[0]+b[0])/2,(a[1]+b[1])/2,r,Math.hypot(b[0]-a[0],b[1]-a[1])/2,-Math.atan2(b[0]-a[0],b[1]-a[1])*180/Math.PI);
  const P = (d,fill='none',stroke=ink,width=1.2) => `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const E = (x,y,rx,ry,fill,stroke='none',width=1) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  // Bake drafting transforms into each point, including Bézier controls, for independently portable layers.
  function placed(d,x,y,angle=0,sx=1,sy=sx) {
    const a=angle*Math.PI/180,co=Math.cos(a),si=Math.sin(a);
    return d.replace(/([MLQCZ])([^MLQCZ]*)/g,(_,command,values)=>{
      const v=values.match(/-?(?:\d*\.)?\d+/g)||[],points=[];
      for(let i=0;i<v.length;i+=2) points.push(`${n(x+v[i]*sx*co-v[i+1]*sy*si)} ${n(y+v[i]*sx*si+v[i+1]*sy*co)}`);
      return command+points.join(' ');
    });
  }
  const L = (d,x,y,fill='none',angle=0,sx=1,sy=sx,stroke=ink,width=1.2) => P(placed(d,x,y,angle,sx,sy),fill,stroke,width);
  function sleeve(s,e,w,rs,re,rw,fill,stroke=ink,crown=1.2) {
    const unit=(a,b)=>{const len=Math.hypot(b[0]-a[0],b[1]-a[1]);return [(b[1]-a[1])/len,-(b[0]-a[0])/len];};
    const u=unit(s,e),v=unit(e,w),j=mix(u,v,.5);
    const q=(p,a,r)=>p.map((v,i)=>n(v+a[i]*r)).join(' ');
    return P(`M${q(s,u,rs)}Q${q(mix(s,e,.5),u,rs)} ${q(e,j,re)}Q${q(mix(e,w,.5),v,re)} ${q(w,v,rw)}L${q(w,v,-rw)}Q${q(mix(e,w,.5),v,-re)} ${q(e,j,-re)}Q${q(mix(s,e,.5),u,-rs)} ${q(s,u,-rs)}Q${q(s,[u[1],-u[0]],rs*crown)} ${q(s,u,rs)}Z`,fill,stroke);
  }
  const words = {
    beret:['Beret','כובע ברט','headwear'],cap:['Cap','כובע מצחייה','headwear'],beanie:['Beanie','כובע צמר','headwear'],
    headband:['Headband','קשת לשיער','headwear'],'hair-clip':['Hair clip','סיכת שיער','hair'],
    glasses:['Glasses','משקפיים','eyewear'],sunglasses:['Sunglasses','משקפי שמש','eyewear'],
    scarf:['Scarf','צעיף','neckwear'],necklace:['Necklace','שרשרת','neckwear'],'bow-tie':['Bow tie','עניבת פרפר','neckwear'],
    watch:['Watch','שעון יד','wristwear'],bracelet:['Bracelet','צמיד','wristwear'],ring:['Ring','טבעת','fingerwear'],
    earrings:['Earrings','עגילים','earwear'],belt:['Belt','חגורה','waistwear'],backpack:['Backpack','תיק גב','backwear'],
    badge:['Badge','תג','chestwear'],brooch:['Brooch','סיכה דקורטיבית','chestwear'],armband:['Armband','סרט זרוע','armwear'],
    'shoe-charm':['Shoe charm','תליון לנעל','footwear'],'waist-chain':['Waist chain','שרשרת מותן','waistwear'],
    'knee-pads':['Knee pads','מגני ברכיים','kneewear'],earmuffs:['Earmuffs','מחממי אוזניים','earwear']
  };
  const people = [
    {id:'manga-03',nameEn:'Miri',nameHe:'מירי',colorMode:'color',style:0,hx:297,hy:145,face:1.06,
      descriptionHe:'מירי עם תספורת בוב ערמונית, חולצת שנהב עם שרוולים תפוחים וחצאית קפלים בצבע יין.',
      colors:['#ffe4cf','#d69b85','#743f32','#c98559','#fff7e9','#d5bca5','#743e55','#442c43','#bd9453','#4e837b'],
      arms:[[[243,246],[211,326],[170,382]],[[349,246],[381,327],[402,415]]],
      legs:[[[271,407],[265,561],[249,704]],[[320,407],[324,566],[346,705]]],
      extras:['beret','headband','hair-clip','glasses','necklace','bracelet','ring','earrings','brooch','waist-chain']},
    {id:'manga-04',nameEn:'Toma',nameHe:'תומה',colorMode:'color',style:1,hx:300,hy:141,face:1.04,
      descriptionHe:'תומה עם שיער נחושתי סוער, קפוצ׳ון בהיר מתחת לז׳קט כחול ומכנסי מטען חומים.',
      colors:['#edc2a0','#b27e65','#98492c','#eeb175','#f6e9d3','#c0a88c','#386881','#234253','#cd8245','#806a42'],
      arms:[[[238,240],[218,324],[234,403]],[[365,242],[399,311],[422,355]]],
      legs:[[[273,412],[252,562],[247,704]],[[330,412],[345,558],[368,697]]],
      extras:['cap','beanie','sunglasses','scarf','watch','badge','armband','backpack','shoe-charm','ring']},
    {id:'manga-05',nameEn:'Neri',nameHe:'נרי',colorMode:'color',style:2,hx:300,hy:148,face:1.02,
      descriptionHe:'נרי עם שיער שזיף ארוך, סוודר סרוג בצבע מרווה וחצאית משובצת, במראה חורפי אלגנטי.',
      colors:['#f6d9cc','#ca9d91','#493446','#a17487','#dbe2cc','#a7b4a0','#4b5c64','#303d47','#c99e61','#756187'],
      arms:[[[246,249],[225,328],[233,420]],[[350,249],[375,330],[361,412]]],
      legs:[[[278,417],[298,556],[290,703]],[[323,417],[340,567],[357,705]]],
      extras:['beret','hair-clip','glasses','necklace','watch','ring','earrings','brooch','waist-chain','shoe-charm']},
    {id:'manga-06',nameEn:'Ido',nameHe:'עידו',colorMode:'color',style:3,hx:301,hy:142,face:1.04,
      descriptionHe:'עידו עם שיער כהה גלי, חולצת טריקו בצבע חרדל, ג׳ינס כחול ונעלי ספורט אדומות.',
      colors:['#dcae88','#a97057','#302c36','#89715f','#d8ae63','#a77940','#3f6e8b','#294759','#bd584d','#708359'],
      arms:[[[242,241],[215,326],[216,422]],[[364,243],[390,328],[401,423]]],
      legs:[[[272,409],[260,562],[245,704]],[[328,409],[341,565],[357,705]]],
      extras:['cap','beanie','sunglasses','necklace','watch','bracelet','badge','armband','belt','shoe-charm']},
    {id:'manga-07',nameEn:'Luma',nameHe:'לומה',colorMode:'color',style:4,hx:296,hy:145,face:1.06,
      descriptionHe:'לומה עם שיער ורוד מדורג, ז׳קט שזיף, חולצה ארוכה בהירה וטייץ, בתנוחה פתוחה וידידותית.',
      colors:['#f9d9cb','#c39285','#b56883','#f1b5bd','#fff4ec','#dbc4c8','#51405f','#302b43','#c57792','#698f95'],
      arms:[[[242,245],[213,327],[223,410]],[[348,245],[407,285],[464,311]]],
      legs:[[[269,415],[258,565],[249,704]],[[319,415],[322,562],[336,705]]],
      extras:['headband','hair-clip','glasses','scarf','bracelet','ring','earrings','brooch','waist-chain','shoe-charm']},
    {id:'manga-08',nameEn:'Yori',nameHe:'יורי',colorMode:'monochrome',style:5,hx:302,hy:142,face:1.05,
      descriptionHe:'יורי עם שיער מדורג סוער, קפוצ׳ון רך ומכנסיים צרים, באיור דיו מפורט בגווני אפור.',
      colors:['#f4f4f4','#bebebe','#626262','#d4d4d4','#ededed','#b5b5b5','#535353','#303030','#8b8b8b','#727272'],
      arms:[[[240,243],[208,330],[227,409]],[[365,243],[397,334],[378,415]]],
      legs:[[[273,415],[261,562],[249,705]],[[331,415],[343,562],[363,704]]],
      extras:['beanie','cap','glasses','scarf','watch','ring','badge','armband','backpack','shoe-charm']},
    {id:'manga-09',nameEn:'Noa',nameHe:'נועה',colorMode:'monochrome',style:6,hx:298,hy:147,face:1.04,
      descriptionHe:'נועה עם שיער גלי ארוך, חולצה בעלת צווארון, אפוד סרוג וחצאית קפלים, באיור שחור ולבן.',
      colors:['#eeeeee','#bcbcbc','#393939','#ababab','#fafafa','#c7c7c7','#777777','#424242','#b0b0b0','#666666'],
      arms:[[[244,249],[217,328],[191,402]],[[352,249],[381,328],[370,415]]],
      legs:[[[273,418],[265,562],[258,704]],[[321,418],[325,561],[341,704]]],
      extras:['beret','headband','hair-clip','glasses','bow-tie','bracelet','earrings','brooch','waist-chain','shoe-charm']},
    {id:'manga-10',nameEn:'Eitan',nameHe:'איתן',colorMode:'monochrome',style:7,hx:301,hy:141,face:1.05,
      descriptionHe:'איתן עם שיער גלי כהה, צעיף ארוג, בלייזר ומכנסיים מחויטים, בהצללות דיו עדינות.',
      colors:['#d9d9d9','#a3a3a3','#303030','#909090','#f4f4f4','#bbbbbb','#575757','#303030','#8b8b8b','#707070'],
      arms:[[[238,241],[209,328],[224,418]],[[367,241],[395,325],[403,420]]],
      legs:[[[271,411],[255,563],[240,704]],[[331,411],[345,560],[365,704]]],
      extras:['cap','beanie','glasses','watch','ring','earrings','brooch','belt','shoe-charm','armband']}
  ];
  // Each crown and its locks are drawn expressly for this collection, not from a traced reference.
  const hairShapes = [
    'M-46 16C-58-11-54-47-29-60C-4-77 34-66 46-43C59-21 50 9 54 35Q57 53 39 61L26 54 31 30 36 0Q24-5 17-35Q5-14-17-7L-30-13Q-34 12-29 34L-23 55Q-42 65-53 51L-48 31Z',
    'M-44 11Q-54 1-51-12L-57-17Q-46-21-44-30L-53-34Q-38-37-32-49L-40-56Q-23-52-15-63Q-8-76 6-69L2-80Q17-78 23-65Q38-68 46-55L38-53Q52-42 52-31L60-29Q52-19 44-18L51-8Q43-2 39-3L37 17Q29 9 30-7L28-23Q21-8 10-5L15-27Q7-17-3-11L-1-36Q-10-20-25-11L-32 9-35 17Z',
    'M-45 26C-60-7-52-48-27-61Q-2-76 26-63C54-52 54-8 45 23L46 88Q54 112 42 142L25 153 31 118 29 64 35 12 30-21Q14-22 1-37Q-16-19-33-22L-34 19-27 75-31 124-21 151Q-48 145-52 128L-46 86Z',
    'M-43 14Q-50 7-48-6L-54-10Q-47-18-44-28L-52-29Q-35-40-27-49Q-26-65-40-68Q-12-75 3-59Q14-68 26-65L23-56Q43-57 49-42Q52-30 45-24L54-18Q49-10 42-10Q46 6 38 17L31 7 31-20Q25-9 13-5L17-26Q7-13-3-9L2-31Q-12-11-29-6L-33 17Z',
    'M-45 28C-56-4-55-40-29-59Q-6-74 21-62C47-59 55-35 49-8L44 26 55 61 40 69 23 48 30 10 29-13Q17-17 13-37Q2-15-21-9L-30-13-33 1-28 36-17 58-34 66-51 54Z',
    'M-44 18Q-53 10-49-3L-58 2Q-61-9-49-20L-61-24Q-47-29-43-39L-54-41Q-37-42-29-54L-36-61Q-20-58-12-66Q-8-81 6-76L1-86Q17-85 23-68Q38-74 44-61L37-57Q54-54 53-40L63-39Q56-28 47-28L56-17Q53-10 44-10Q47 3 54 5Q43 17 35 12L33 24Q28 13 30-3L31-25Q23-9 12-5L16-34Q6-15-7-9L-1-37Q-11-15-28-6L-32 23Z',
    'M-44 22Q-58-10-49-39Q-39-66-12-67Q22-78 43-48Q59-28 48 5L44 39Q44 64 60 73L47 93 30 86Q37 108 28 120L16 117 22 83 30 47 33-4Q15-9 8-33Q-8-8-29-6L-31 27Q-33 58-23 79L-26 111-40 113-36 93Q-56 86-57 71L-46 54Z',
    'M-45 14Q-53 3-47-14L-54-19Q-45-24-40-34L-47-39Q-35-47-22-50Q-11-70 7-61Q17-70 29-66L25-57Q44-56 48-42L42-39Q54-32 49-19L54-13Q51-6 42-3Q43 10 37 19L31 5 32-24Q27-12 15-7L20-31Q8-18-5-9L0-36Q-14-17-29-7L-33 18Z'
  ];
  function create(c) {
    const [skin,skinShade,hairColor,hairLight,cloth,clothShade,bottom,bottomShade,accent,eye]=c.colors;
    const line=c.colorMode==='monochrome'?'#343434':ink;
    const layers=[],regions={},outfit=[];
    const wrap=svg=>`<g stroke-linecap="round" stroke-linejoin="round">${c.colorMode==='monochrome'?svg.replaceAll(ink,line):svg}</g>`;
    const add=(id,order,svg,targets)=>{layers.push({id,order,svg:wrap(svg)});regions[id]=targets;};
    const wear=(id,order,svg,targets)=>{layers.push({id,order,svg:wrap(svg)});outfit.push({id,regions:targets});};
    const tone=name=>`url(#${c.id}-paint-${name})`;
    const gradient=(name,a,b,direction='x2="100%" y2="80%"')=>`<linearGradient id="${c.id}-paint-${name}" ${name==='bottom'?'gradientUnits="userSpaceOnUse" x1="240" y1="330" x2="375" y2="700"':`x1="0%" y1="0%" ${direction}`}><stop offset="0" stop-color="${a}"/><stop offset="${name==='hair'?'0.14':'0.55'}" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
    const defs=`<defs>${gradient('skin',skin,skinShade)}${gradient('hair',hairLight,hairColor,'x2="25%" y2="100%"')}${gradient('cloth',cloth,clothShade)}${gradient('bottom',bottom,bottomShade)}${gradient('accent',accent,bottomShade)}${gradient('cargo',c.style===1?'#9c876e':bottom,c.style===1?'#615348':bottomShade)}
      <pattern id="${c.id}-paint-plaid" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="28" height="28" fill="${bottom}"/><path d="M0 7L28 7M7 0L7 28" stroke="${clothShade}" stroke-width="5"/><path d="M0 19L28 19M19 0L19 28" stroke="${cloth}" stroke-width=".65"/><path d="M0 22L28 22M22 0L22 28" stroke="${bottomShade}" stroke-width="1.2"/></pattern>
      <pattern id="${c.id}-paint-knit" width="7" height="9" patternUnits="userSpaceOnUse"><rect width="7" height="9" fill="${cloth}"/><path d="M1 1Q4 2 3.5 7Q4 3 6 1" fill="none" stroke="${clothShade}" stroke-width=".55"/></pattern>
      <pattern id="${c.id}-paint-weave" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${accent}"/><path d="M0 0L6 6M0 6L6 0" stroke="${bottomShade}" stroke-width=".45"/></pattern></defs>`;
    const f=(d,fill='none',stroke=line,width=1.05)=>L(d,c.hx,c.hy,fill,0,c.face,c.face,stroke,width);
    const fr=(x,y,rx,ry)=>ellipse(c.hx+x*c.face,c.hy+y*c.face,rx*c.face,ry*c.face);
    const mid=(c.arms[0][0][0]+c.arms[1][0][0])/2,top=(c.arms[0][0][1]+c.arms[1][0][1])/2;
    const t=(d,fill='none',stroke=line,width=1.2)=>L(d,mid,top,fill,0,1,1,stroke,width);
    const tr=(x,y,rx,ry)=>ellipse(mid+x,top+y,rx,ry);
    let arms='',elbows='',wrists='',hands='',palms='',fingers='';
    const ar=[],er=[],wr=[],hr=[],pr=[],fir=[];
    c.arms.forEach(([s,e,w],index)=>{
      arms+=sleeve(s,e,w,13.8,10.5,7.2,tone('skin'),line);
      const angle=-Math.atan2(w[0]-e[0],w[1]-e[1])*180/Math.PI,sign=index?-1:1;
      const hand=(d,fill=skin,stroke=line,width=.9)=>L(d,...w,fill,angle,sign,.84,stroke,width);
      elbows+=L('M-7-4Q0-6 7-3M-5 3Q0 5 5 2',...e,'none',0,1,1,skinShade,.8);
      wrists+=hand('M-7-5L7-5 7 8Q0 11-7 8Z',tone('skin'));
      hands+=hand('M-7 5Q-10 14-9 24Q-4 30 7 25L8 13 6 5Z',tone('skin'));
      palms+=hand('M-5 13Q1 11 5 16L5 23Q0 27-5 22Z',skin,'none')+hand('M-5 18Q-1 15 3 18M-4 23L2 21','none',skinShade,.55);
      fingers+=hand('M-8 15Q-11 15-13 21L-16 27Q-17 31-14 30L-9 25-7 23Z M-8 23L-8 37Q-7 40-5 38L-3 25Z M-3 25L-3 42Q-1 45 1 41L2 25Z M2 25L3 39Q5 42 6 38L6 24Z M6 22L8 34Q10 37 11 33L10 21Z',tone('skin'))+
        hand('M-6 32L-4 32M-1 36L1 36M4 33L6 33M8 29L10 29','none',skinShade,.55);
      const point=(x,y)=>{const a=angle*Math.PI/180;return [w[0]+x*sign*Math.cos(a)-y*.84*Math.sin(a),w[1]+x*sign*Math.sin(a)+y*.84*Math.cos(a)];};
      ar.push(span(s,e,13),span(e,w,10));er.push(ellipse(...e,8,6));wr.push(ellipse(...w,7,6,angle));
      hr.push(ellipse(...point(0,17),9,11,angle));pr.push(ellipse(...point(0,19),5,6,angle));
      [[-12,24,3,7],[-6,32,2,7],[-1,35,2,8],[4,32,2,7],[9,28,2,6]].forEach(([x,y,rx,ry])=>fir.push(ellipse(...point(x,y),rx,ry,angle)));
    });
    add('arms',16,arms,ar);add('elbows',17,elbows,er);add('wrists',18,wrists,wr);
    add('hands',56,hands,hr);add('palms',57,palms,pr);add('fingers',58,fingers,fir);
    let legs='',thighs='',knees='',ankles='',feet='',heels='';const lr=[],thr=[],kr=[],anr=[],fer=[],her=[];
    c.legs.forEach(([h,k,a],i)=>{
      legs+=sleeve(h,k,a,22,14,8.5,tone('skin'),line);
      thighs+=L('M-12-31Q-4-23-8 12L-11 30Q-16 6-12-31Z',...mix(h,k,.4),skinShade,0,1,1,'none');
      knees+=L('M-8-3Q0 1 8-3M-5 5Q0 8 5 5',...k,'none',0,1,1,skinShade,.8);
      ankles+=L('M-8-8L8-8 9 12-9 12Z',...a,tone('skin'),0,1,1,line,.8);
      const sign=i?1:-1;
      feet+=L('M-8 3L9 3 11 17Q23 20 29 30Q31 36 21 37L-11 36Q-16 32-13 23Z',...a,tone('skin'),0,sign,1,line,1);
      heels+=L('M-12 23Q-16 32-10 35L-5 35-6 26Z',...a,skinShade,0,sign,1,'none');
      lr.push(span(h,a,20));thr.push(span(mix(h,k,.1),mix(h,k,.8),17));kr.push(ellipse(...k,11,8));anr.push(ellipse(...a,9,10));
      fer.push(ellipse(a[0]+sign*7,a[1]+26,23,12));her.push(ellipse(a[0]-sign*10,a[1]+30,5,6));
    });
    add('legs',10,legs,lr);add('thighs',11,thighs,thr);add('knees',12,knees,kr);add('ankles',13,ankles,anr);add('feet',14,feet,fer);add('heels',15,heels,her);
    add('chest',19,t('M-45-3Q0-18 45-3L42 75Q0 100-42 75Z',tone('skin')),[tr(0,38,42,43)]);
    add('waist',20,t('M-42 74Q0 94 42 74L45 174Q30 199 0 184Q-29 199-45 174Z',tone('skin')),[tr(0,142,39,26)]);
    add('shoulders',21,c.arms.map(([s])=>L('M-13 5Q-17-5-1-7Q14-6 14 3L8 12-8 12Z',...s,tone('skin'),0,1,1,line,1)).join(''),c.arms.map(([s])=>ellipse(...s,14,8)));
    add('neck',22,P(`M${c.hx-15} ${c.hy+45}L${c.hx-18} ${top-9}Q${c.hx} ${top+11} ${c.hx+19} ${top-9}L${c.hx+15} ${c.hy+45}Z`,tone('skin'),line)+
      P(`M${c.hx-14} ${c.hy+51}Q${c.hx} ${c.hy+65} ${c.hx+15} ${c.hy+49}L${c.hx+14} ${c.hy+66}Q${c.hx} ${c.hy+74} ${c.hx-14} ${c.hy+58}Z`,skinShade,'none'),[ellipse(c.hx,(c.hy+52+top-7)/2,16,22)]);
    add('head',25,f('M-40-20C-41-43-22-54 0-54C26-54 41-39 40-17L38 16C36 34 18 49 0 55C-19 49-37 34-39 16Z',tone('skin'),line,1.35),[fr(0,0,41,54)]);
    add('forehead',26,f('M-26-28Q0-36 26-27L25-11Q0-16-25-11Z',skin,'none'),[fr(0,-22,24,9)]);
    add('cheeks',27,f('M-30 21L-28 23M-25 21L-23 23M-20 21L-18 23M20 21L22 23M25 21L27 23M30 20L32 22','none',skinShade,.65),[fr(-24,21,10,6),fr(24,21,10,6)]);
    add('jaw',28,f('M-37 23Q-30 39-15 47M37 23Q30 39 15 47','none',skinShade,.7),[fr(-27,37,10,7),fr(27,37,10,7)]);
    add('chin',29,f('M-9 50Q0 55 9 50','none',skinShade,.65),[fr(0,51,8,4)]);
    add('ears',30,f('M-39-2Q-50-9-49 6Q-48 19-38 18Z M39-2Q50-9 49 6Q48 19 38 18Z',tone('skin'))+f('M-44 2Q-48 6-42 11M44 2Q48 6 42 11','none',skinShade,.85),[fr(-44,7,6,11),fr(44,7,6,11)]);
    let eyes=f('M-32 0Q-22-10-10-1Q-15 10-26 7Z M10-1Q22-10 32 0L26 7Q15 10 10-1Z','#fff',skinShade,.8);
    [-21,21].forEach(x=>{
      eyes+=E(c.hx+x*c.face,c.hy+.5*c.face,5.5*c.face,6.9*c.face,eye,line,.7)+E(c.hx+x*c.face,c.hy-.9*c.face,2.6*c.face,4.8*c.face,line)+
        f(`M${x-4} 4Q${x} 8 ${x+4} 4`,'none',hairLight,1.2)+E(c.hx+(x-1.7)*c.face,c.hy-2.6*c.face,1.9*c.face,2.2*c.face,'#fff')+E(c.hx+(x+2.5)*c.face,c.hy+3*c.face,.75,.8,'#fff');
    });
    eyes+=f('M-33-1Q-22-10-10-1M10-1Q22-10 33-1','none',line,1.9)+
      f('M-32-1L-35-3M32-1L35-3M-29 9Q-21 12-14 8M14 8Q21 12 29 9','none',skinShade,.65)+
      f(c.style%2?'M-31-14Q-21-18-12-14M12-14Q22-17 31-13':'M-31-13Q-22-18-12-14M12-14Q22-18 31-13','none',hairColor,1.4);
    add('eyes',32,eyes,[fr(-21,0,12,9),fr(21,0,12,9)]);
    add('nose',33,f('M1 8Q-1 14-2 18L1 20M3 20L5 19','none',skinShade,.95)+f('M-3 21L-1 21','none',line,.6),[fr(1,16,5,7)]);
    add('mouth',34,f(c.style===1||c.style===4?'M-10 32Q0 36 11 29Q7 42-2 40Q-8 38-10 32Z':'M-10 32Q0 38 11 31Q3 39-5 36Z','#fff',line,.85),[fr(0,34,10,5)]);
    add('lips',35,f('M-10 32Q0 36 11 31M-3 41Q1 42 5 40','none',skinShade,.85),[fr(1,38,8,4)]);
    let hair=f(hairShapes[c.style],tone('hair'),line,1.5);
    const long=[0,2,4,6].includes(c.style);
    const sweptLocks=[
      'M-6-64C-29-65-49-42-45-14Q-44-36-30-42Q-35-28-30-13C-30-38-18-55-6-64Z',
      'M-5-64C-24-54-32-29-22-12Q-9-15-3-21Q-19-24-17-34Q-9-49-5-64Z',
      'M-3-65C-10-49-10-30-5-22Q8-26 13-38Q2-34 2-45Q4-55-3-65Z',
      'M0-65C14-63 23-52 25-34Q26-18 36-6Q21-9 17-35Q15-51 0-65Z',
      'M10-64Q34-61 42-39C46-20 44-9 41 4Q39-20 33-31Q32-47 10-64Z',
      'M-45-19Q-51 14-45 36L-42 52Q-48 37-49 16Z',
      'M-37-10Q-41 20-33 46L-30 53Q-42 33-43 12Z',
      'M43-12Q50 13 46 38L42 51Q45 20 40 10Z'
    ];
    const centerLocks=[
      'M0-65Q-22-69-39-47Q-51-30-43-4Q-43-31-30-43Q-30-26-33-21Q-9-27 0-43Z',
      'M0-63Q-22-51-22-24Q-11-28-3-36Q-11-40 0-63Z',
      'M1-64Q16-67 31-51Q43-33 42-12Q38-34 27-39Q22-27 30-21Q12-25 1-38Z',
      'M5-61Q15-46 21-37Q13-37 7-44Q5-53 5-61Z',
      'M-43-12Q-46 22-41 53L-37 79Q-44 68-47 40Z',
      'M39-9Q45 22 39 52L35 73Q35 45 36 24Z',
      'M-35 22Q-34 61-29 84L-33 116Q-36 82-39 66Z',
      'M42 51Q43 88 44 110L37 134Q41 94 37 79Z'
    ];
    const shortLocks=[
      'M2-61Q-10-69-21-56Q-36-46-43-34Q-34-39-27-38Q-39-27-44-15Q-28-22-22-39Q-18-53 2-61Z',
      'M1-60Q-23-43-25-14Q-12-22-7-31Q-16-26-13-38Q-9-49 1-60Z',
      'M5-61Q-8-42-3-13Q9-24 14-36Q1-23 4-40Q9-52 5-61Z',
      'M9-62Q24-62 30-45Q33-31 30-14Q26-29 18-30Q24-44 9-62Z',
      'M18-62Q37-62 43-48L38-44Q48-34 44-23Q36-38 33-41Q31-53 18-62Z',
      'M-15-57Q-21-61-29-55L-39-47Q-21-50-15-57Z',
      'M-38-27Q-49-11-42 6L-36 11Q-39-4-33-17Z',
      'M38-27Q47-16 41-5L36 8Q37-7 34-10Z',
      ...(c.style===1||c.style===5?['M-1-65Q-4-73 3-75Q12-73 15-64Q8-68 5-65Z']:[])
    ];
    const locks=long?(c.style===2?centerLocks:sweptLocks):shortLocks;
    hair+=locks.map(d=>f(d,tone('hair'),hairColor,.65)).join('');
    hair+=f(long?
      'M-30-47Q-19-59-9-60L-15-55Q-24-52-29-44Z M-26-43L-23-45-25-38-28-35Z M-16-48Q-15-52-11-53L-15-43-19-40Z M3-58Q13-54 18-45L16-40Q12-52 3-58Z M27-47L30-42 32-34 29-38Z M-44 14L-42 28-40 34-40 24Z M43 12L44 24 42 35 41 24Z':
      'M-27-43Q-18-53-7-54L-14-49-24-39Z M-19-39L-15-42-17-35-21-31Z M-3-48L1-54-2-39-5-33Z M9-54Q15-48 16-40L13-37Q14-45 9-54Z M29-48L34-44 37-37 32-40Z M-38-16L-36-21-38-8-40-5Z',
      hairLight,'none');
    const strands=long?
      ['M-7-62Q-29-52-31-28','M-11-58Q-31-41-29-20','M-4-62Q-18-40-12-25','M1-59Q-4-38 3-29','M9-59Q21-50 23-28','M20-58Q35-46 38-24','M-44-24Q-47-5-44 7','M-38-6Q-40 23-34 39','M41-2Q46 29 40 44']:
      ['M-5-59Q-24-52-31-39','M-2-56Q-19-38-21-23','M1-53Q-7-36-6-23','M8-55Q15-44 11-34','M20-55Q28-45 28-30','M31-51Q42-40 41-32','M-39-30L-45-21','M-36-19Q-42-4-38 4','M39-21Q42-11 38-3'];
    hair+=strands.map(d=>f(d,'none',hairColor,.55)).join('');
    hair+=f(long?'M-45-3Q-46 28-40 47M-40 6Q-43 30-34 50M40-2Q43 29 39 49M36 14Q35 31 33 42':'M-43-15L-38 2M-36-25L-33-10M36-22L37-2M-22-41Q-9-48-3-56M5-43L10-53M24-34L30-45','none',hairColor,.9);
    if(c.style===2)hair+=f('M-43 32Q-40 74-40 120L-34 138M-37 38Q-31 82-36 109M40 31Q34 73 40 107L35 140M35 72L36 110','none',hairLight,1)+f('M-47 52Q-43 87-46 109M44 67Q47 100 42 126','none',hairColor,.7);
    if(c.style===6)hair+=f('M-43 28Q-48 53-37 70Q-28 88-33 101M42 29Q34 52 46 69L39 83M-49 59Q-48 78-40 84','none',hairLight,1);
    add('hair',49,hair,[fr(0,-35,47,33),...(long?[fr(-40,33,12,26),fr(40,33,12,26)]:[]),...(c.style===2?[fr(-39,99,11,44),fr(38,99,11,44)]:[])]);
    const torso=(hem=166,flare=0)=>`M-56-3L-21-17Q0 5 21-17L56-3Q58 42 45 84L${51+flare} ${hem-10}Q10 ${hem+7} ${-53-flare} ${hem}L-44 87Q-59 38-56-3Z`;
    const topTargets=(long=true,hem=165)=>[tr(0,hem/2,48,hem/2),...c.arms.flatMap(([s,e,w])=>long?[span(s,e,21),span(e,mix(e,w,.94),16)]:[span(s,mix(s,e,.5),21)])];
    function sleeves(fill,long=true,puff=false) {
      return c.arms.map(([s,e,w],i)=>{
        const end=long?mix(e,w,.95):mix(s,e,.51),el=long?e:mix(s,end,.5),start=[s[0]+(i?-4:4),s[1]+2];
        const a=-Math.atan2(end[0]-el[0],end[1]-el[1])*180/Math.PI;
        return sleeve(start,el,end,puff?24:22,long?(puff?22:18):22,long?11:19,fill,line)+
          L(long?'M-11-8L11-8 11 3-11 3Z':'M-19-5L19-5 19 3-19 3Z',...end,clothShade,a,1,1,line,.8)+
          (long?L('M-13-19Q-9-9 8-3L-3 4-9 14-6 1-14-5Z M12 8L3 15 7 22 10 12Z',...e,fill===tone('bottom')?bottomShade:clothShade,0,1,1,'none'):'')+
          (long?L('M-12-13L2-6-8 0M11-3L-1 5 9 11M-10 12L2 9',...e,'none',0,1,1,bottomShade,.9):L('M-13-17L-7-5M11-15L7-5',...end,'none',a,1,1,clothShade,.9))+
          (long?L('M-12-24L-8-19M-13-20L-10-16M9 17L7 21M-5 15L-1 12M-7 18L-3 15',...e,'none',0,1,1,clothShade,.55):'')+
          P(`M${mix(start,el,.2)[0]} ${mix(start,el,.2)[1]}Q${el[0]+(i?6:-6)} ${el[1]-25} ${el[0]+(i?10:-10)} ${el[1]-9}`,'none',clothShade,1.5);
      }).join('');
    }
    const folds=(hem=160)=>t(`M-44 52Q-30 69-22 96L-39 82Z M44 64L28 101 38 89Z M-46 ${hem-24}Q-18 ${hem-9} 20 ${hem-21}L-26 ${hem-3}Z M41 ${hem-42}L8 ${hem-17} 38 ${hem-30}Z`,clothShade,'none')+
      t(`M-35 29Q-31 45-21 54M36 39L29 62M-41 ${hem-28}Q-20 ${hem-13} 10 ${hem-20}M-31 ${hem-5}L-13 ${hem-10}M29 ${hem-7}L42 ${hem-16}`,'none',bottomShade,.8)+
      t(`M-46 35Q-42 48-39 54M-40 63L-34 73M-37 70L-31 80M-34 77L-28 88M35 81L31 89M32 89L28 97M-34 ${hem-30}L-23 ${hem-25}M-28 ${hem-27}L-16 ${hem-23}M20 ${hem-24}L31 ${hem-30}M25 ${hem-22}L37 ${hem-28}M-39 ${hem-7}Q-18 ${hem+1} 1 ${hem-4}`,'none',clothShade,.55);
    const collar=()=>t('M-21-17L0 6-18 26-34-9Z M21-17L0 6 18 26 34-9Z',cloth,line,1)+t('M-18-9L-4 6-17 19M18-9L4 6 17 19','none',clothShade,.7);
    const buttons=(x,start,end,step=22)=>{let svg='';for(let y=start;y<=end;y+=step)svg+=E(mid+x,top+y,2.4,2.4,cloth,line,.7)+P(`M${mid+x-.7} ${top+y-.6}L${mid+x+.7} ${top+y+.6}`,'none',bottomShade,.6);return svg;};
    function pants(id,fill,wide=0,end=693) {
      let svg='',targets=[];const pantShade=c.style===1?'#615348':bottomShade;
      c.legs.forEach(([h,k,a],i)=>{
        const finish=mix(k,a,(end-k[1])/(a[1]-k[1])),w=23+wide;
        svg+=P(`M${h[0]-w} ${h[1]-9}L${h[0]+w} ${h[1]-9}Q${h[0]+w+5} ${h[1]+57} ${k[0]+16+wide} ${k[1]-10}L${k[0]+20+wide} ${k[1]+8} ${finish[0]+13+wide} ${end-16} ${finish[0]+17+wide} ${end}Q${finish[0]} ${end+8} ${finish[0]-16-wide} ${end+2}L${finish[0]-12-wide} ${end-23} ${k[0]-16-wide} ${k[1]+13} ${k[0]-18-wide} ${k[1]-5}Q${h[0]-w} ${h[1]+57} ${h[0]-w} ${h[1]-9}Z`,fill,line)+
          P(`M${h[0]+(i?13:-13)} ${h[1]+25}Q${k[0]+(i?9:-9)} ${k[1]-55} ${k[0]+(i?8:-8)} ${k[1]-13}L${k[0]+(i?13:-13)} ${k[1]+14} ${finish[0]+(i?9:-9)} ${end-12}L${finish[0]+(i?4:-4)} ${end-8} ${k[0]+(i?2:-2)} ${k[1]+19} ${k[0]+(i?-2:2)} ${k[1]-10}Z`,pantShade,'none')+
          P(`M${k[0]-11} ${k[1]-9}L${k[0]+7} ${k[1]-2} ${k[0]-8} ${k[1]+6}M${k[0]+11} ${k[1]+16}L${k[0]-4} ${k[1]+22}M${finish[0]-10} ${end-22}L${finish[0]+8} ${end-16} ${finish[0]-8} ${end-9}M${finish[0]-13-wide} ${end-1}Q${finish[0]} ${end+3} ${finish[0]+12+wide} ${end-3}`,'none',clothShade,.85);
        if(c.style===1)svg+=L('M-22-16L4-16 5 20-21 22Z M-22-16L4-16 2-7-19-6Z',h[0]+(i?20:-3),h[1]+84,fill,0,1,1,line,.9)+
          L('M-18-1L-18 17M0-1L0 16',h[0]+(i?20:-3),h[1]+84,'none',0,1,1,clothShade,.6);
        targets.push(span(h,finish,w));
      });
      svg+=t('M-49 157Q0 146 49 157L43 188 15 189 0 201-15 189-43 188Z',fill,'none')+
        t('M-49 153Q0 145 49 153L49 167Q0 162-49 169Z',fill,line,1)+
        t('M-36 169Q-31 188-46 194M36 168Q31 186 45 193M0 164L0 189Q-1 199-8 201M-5 169L-5 190','none',clothShade,.9)+buttons(0,158,158);
      wear(id,37,svg,targets);
    }
    function skirt(fill,hem=286) {
      let svg=t(`M-47 153Q0 146 47 153L76 ${hem-10} 59 ${hem} 34 ${hem-3} 11 ${hem+5}-12 ${hem+1}-37 ${hem+4}-61 ${hem-1}-79 ${hem-10}Z`,fill);
      for(let j=0;j<6;j++){
        const x=-44+j*17,edge=x*1.5;
        svg+=t(`M${x} 166L${edge} ${hem-7} ${edge+10} ${hem-3} ${x+5} 166Z`,bottomShade,'none')+
          t(`M${x+6} 172Q${x+8} 225 ${edge+12} ${hem-8}`,'none',clothShade,.7);
      }
      svg+=t('M-47 151Q0 145 47 151L49 165Q0 161-49 168Z',bottom,line,1)+t(`M-74 ${hem-17}Q0 ${hem+1} 70 ${hem-16}`,'none',clothShade,.8);
      wear('skirt',40,svg,[tr(0,(160+hem)/2,62,(hem-160)/2)]);
    }
    function socks(tall=false) {
      const height=tall?128:36;
      wear('socks',42,c.legs.map(([,k,a])=>{
        const b=mix(k,a,1-height/(a[1]-k[1]));
        return sleeve(b,mix(b,a,.5),mix(a,[a[0],a[1]+10],.6),tall?13:10,11,9,tone('bottom'),line,0)+
          L('M-11 0L11 0M-10 5L10 5M-7 9L-7 24M-2 9L-2 24M3 9L3 24M8 9L8 24',...b,'none',0,1,1,clothShade,.7);
      }).join(''),c.legs.map(([, ,a])=>ellipse(a[0],a[1]-height/2,12,height/2+7)));
    }
    function shoes(id,boot=false) {
      const svg=c.legs.map(([, ,a],i)=>{
        const sign=i?1:-1,hi=boot?-31:-5;
        if(id==='shoes')return L('M-10-3L9-3 11 15Q25 17 32 28Q36 36 24 39L-13 37Q-18 30-12 19Z',...a,tone('bottom'),0,sign,1,line,1.2)+
          L('M-14 32Q8 39 33 30L33 37Q12 45-14 39Z M-14 38L-3 40-3 44-14 42Z',...a,bottomShade,0,sign,1,line,.9)+
          L(c.style===7?'M-4 4L6 5 13 22 0 25Z':'M-11 9Q0 13 12 10L14 17Q0 21-12 17Z',...a,accent,0,sign,1,line,.9)+
          L(c.style===7?'M-3 9L8 10M-1 14L10 16M1 20L12 21':'M5 11L12 11 13 17 6 17Z',...a,clothShade,0,sign,1,line,.65)+
          L('M15 24Q24 20 29 28M-10 26Q0 32 13 31M-11 30L-8 32M-6 32L-3 33M0 34L3 34',...a,'none',0,sign,1,clothShade,.65);
        return L(`M-10 ${hi}L10 ${hi} 12 15Q23 18 30 27Q35 35 24 39L-13 37Q-18 28-11 18Z`,...a,tone('bottom'),0,sign,1,line,1.2)+
          L('M-14 29Q5 34 31 28L32 36Q12 45-14 38Z',...a,cloth,0,sign,1,line,1)+
          L('M-11 34Q8 40 29 33M-11 38L-11 41M-4 39L-4 42M4 40L4 43M12 40L12 43M21 38L21 41',...a,'none',0,sign,1,clothShade,.7)+
          L(`M-4 ${hi+7}L5 ${hi+7} 12 22 0 24Z`,...a,id==='trainers'?accent:clothShade,0,sign,1,line,.8)+
          L(`M-5 ${hi+11}L7 ${hi+12}M-4 ${hi+17}L8 ${hi+18}M-2 15L10 17M0 21L12 22M19 23Q28 21 30 29`,...a,'none',0,sign,1,cloth,.9)+
          L('M-10 19L-5 23M-11 24L-7 26',...a,'none',0,sign,1,hairLight,.6);
      }).join('');
      wear(id,45,svg,c.legs.map(([, ,a],i)=>ellipse(a[0]+(i?6:-6),a[1]+(boot?3:22),26,boot?36:19)));
    }
    const hoodie=()=>{
      const svg=sleeves(tone('cloth'),true)+t(torso(182,2),tone('cloth'))+folds(173)+
        t('M-20-24Q-42-35-55-13Q-58-2-43 17L-20 35-4 20-13 2Z M21-24Q46-35 56-10Q60 4 39 22L17 33 3 17 13 0Z',tone('cloth'))+
        t('M-20-23Q-34-18-34-7L-16 18-5 21-12 3Z M22-23Q39-18 37-5L17 21 5 18 13 1Z',clothShade,line,.7)+
        t('M-44-12Q-50-2-38 11L-20 24M45-10Q50 0 35 13L23 21M-18 28L-12 31M18 27L13 30','none',clothShade,.8)+
        t('M-17 22Q-20 55-17 74M17 22L21 70','none',bottomShade,1.5)+t('M-18 70L-19 79-15 80-14 71Z M19 67L18 77 22 78 23 68Z',cloth,line,.8)+
        t('M-38 111L-22 92 23 92 40 118 33 148Q0 160-34 148Z',tone('cloth'))+
        t('M-23 97L-34 116M24 97L36 117M-30 146Q0 155 29 145','none',bottomShade,.9)+
        t('M-54 169Q0 182 55 167L54 184Q0 197-55 184Z',clothShade);
      return svg;
    };
    const jacket=(short=false)=>sleeves(tone('bottom'),true)+
      t(`M-57-4L-26-20-12 25-18 ${short?120:177}-58 ${short?123:177}-47 85Z M57-4L26-20 12 25 18 ${short?120:177} 58 ${short?123:177} 47 85Z`,tone('bottom'))+
      t('M-26-20L-10 9-27 32-39 3Z M26-20L10 9 27 32 39 3Z',accent)+
      t(`M-20 35L-25 ${short?109:160}M20 35L25 ${short?109:160}M-49 ${short?112:164}L-23 ${short?115:168}M49 ${short?112:164}L23 ${short?115:168}`,'none',clothShade,1.3)+
      t('M-49 75L-29 63-27 82-45 94Z M49 75L29 63 27 82 45 94Z',bottomShade)+
      t('M-46 77L-32 69M46 77L32 69M-48 42L-40 53M48 42L40 53','none',hairLight,.8);
    switch(c.style) {
      case 0:
        wear('blouse',39,sleeves(tone('cloth'),false,true)+t(torso(166),tone('cloth'))+folds(158)+
          t('M-21-17Q0 5 21-17L25-9Q0 17-25-9Z',cloth)+t('M0 9L0 151','none',clothShade,.8)+buttons(0,28,136)+
          t('M-21-7L-26 18M-12 1L-17 22M11 1L17 23M22-7L27 17','none',clothShade,.8),topTargets(false));
        skirt(tone('bottom'),282);socks(true);shoes('shoes');break;
      case 1:
        pants('trousers',tone('cargo'),4);
        wear('hoodie',38,hoodie(),topTargets(true,184));
        wear('jacket',41,jacket(false),[tr(-36,84,22,91),tr(36,84,22,91),...topTargets().slice(1)]);
        shoes('trainers');break;
      case 2:
        skirt(tone('plaid'),278);
        wear('sweater',41,sleeves(tone('knit'),true,true)+t(torso(171),tone('knit'))+folds(167)+
          t('M-20-20Q0-9 20-20L24-3Q0 11-24-3Z',tone('knit'))+
          t('M-53 157Q0 178 53 158L53 176Q0 195-55 174Z',clothShade)+
          t('M-43 167L-43 175M-34 170L-34 178M-25 173L-25 181M-16 175L-16 183M-7 176L-7 184M2 177L2 185M11 176L11 184M20 175L20 183M29 173L29 181M38 170L38 178M47 167L47 175','none',cloth,.8),
          topTargets(true,176));
        socks();shoes('boots',true);break;
      case 3:
        pants('jeans',tone('bottom'));
        wear('T-shirt',39,sleeves(tone('cloth'),false)+t(torso(178),tone('cloth'))+folds(177)+
          t('M-21-17Q0 10 21-17L24-11Q0 18-24-11Z',clothShade)+
          t('M-52 167Q-17 180 21 169L51 157M-49 173Q-15 187 21 176','none',bottomShade,.85),topTargets(false,180));
        shoes('trainers');break;
      case 4:
        pants('leggings',tone('bottom'),-5,697);
        wear('blouse',38,t(torso(226,10),tone('cloth'))+folds(218)+
          t('M-21-17Q0 14 21-17L25-9Q0 26-25-9Z',clothShade)+
          t('M-63 212Q0 240 63 211L65 227Q0 251-65 228Z',cloth)+
          t('M-53 220L-54 230M-40 224L-41 234M-27 227L-28 237M-14 229L-14 239M0 230L0 240M14 229L14 239M27 227L28 237M40 224L41 234M53 220L54 230','none',clothShade,.8),[tr(0,115,55,117)]);
        wear('jacket',41,jacket(true),[tr(-37,59,22,65),tr(37,59,22,65),...topTargets().slice(1)]);
        shoes('trainers');break;
      case 5:
        pants('trousers',tone('bottom'),1);
        wear('hoodie',40,hoodie(),topTargets(true,184));shoes('trainers');break;
      case 6:
        wear('shirt',38,sleeves(tone('cloth'),true,true)+t(torso(171),tone('cloth'))+collar()+buttons(0,29,161),topTargets(true,171));
        skirt(tone('plaid'),279);
        wear('vest',41,t('M-32-12L-48-5-39 52-48 163Q0 180 48 163L39 52 48-5 32-12 0 43Z',tone('bottom'))+
          t('M-30-10L0 49 30-10M-45 155Q0 170 45 155','none',clothShade,3)+
          t('M-30 64Q-36 89-25 113M32 86L25 111M-39 134L-18 145 10 137','none',bottomShade,1)+
          [-24,0,24].map((x,j)=>t(`M${x} ${70+j%2*18}L${x+10} ${87+j%2*18} ${x} ${104+j%2*18} ${x-10} ${87+j%2*18}Z`,clothShade,line,.5)).join(''),[tr(0,85,42,80)]);
        socks(true);shoes('shoes');break;
      case 7:
        pants('trousers',tone('bottom'),2);
        wear('shirt',38,sleeves(tone('cloth'),true)+t(torso(170),tone('cloth'))+collar()+buttons(0,25,158),topTargets(true,170));
        wear('jacket',41,sleeves(tone('bottom'),true)+t('M-56-4L-25-19-8 44-14 120 5 163-18 185-59 172-48 86Z M56-4L25-19 8 44 14 120-5 163 18 185 59 172 48 86Z',tone('bottom'))+
          t('M-25-19L-7 42-29 62-42 30-32 24-41 8Z M25-19L7 42 29 62 42 30 32 24 41 8Z',bottomShade)+
          t('M-25-15L-11 39-28 56M25-15L11 39 28 56M-52 127L-25 126-25 136-52 138Z M52 127L25 126 25 136 52 138Z','none',clothShade,1)+buttons(10,118,145,26)+
          t('M-43 78L-35 89M41 88L32 108M-49 159L-25 166M49 159L25 166','none',clothShade,.8),[tr(-34,85,25,91),tr(34,85,25,91),...topTargets().slice(1)]);
        wear('scarf',51,t('M-26-23Q0-9 26-23L31-3Q0 22-31 0Z',tone('weave'))+
          t('M-19 7Q-25 40-16 75L2 78Q-7 43 2 16Z',tone('weave'))+
          t('M-24-13Q0 1 25-13M-26-6Q0 9 26-6M-15 76L-15 83M-10 77L-10 85M-5 78L-5 85M0 79L0 86','none',clothShade,.9),
          [tr(0,-4,30,16),tr(-10,47,12,34)]);
        shoes('shoes');break;
    }
    window.IllustratedCharacters[c.id]={id:c.id,category:'Manga',nameEn:c.nameEn,nameHe:c.nameHe,colorMode:c.colorMode,descriptionHe:c.descriptionHe,image:`./style-samples/${c.id}.svg`,bodyRegions:regions,outfit};
    window.IllustratedLayers[c.id]={defs,layers};
    window.CharacterAccessories[c.id]=accessories(c,mid,top,wrap);
  }
  function accessories(c,mid,top,wrap) {
    const [, ,hairColor,hairLight,cloth,clothShade,bottom,bottomShade,accent]=c.colors;
    const line=c.colorMode==='monochrome'?'#343434':ink;
    const h=(d,fill='none',width=1)=>L(d,c.hx,c.hy,fill,0,c.face,c.face,line,width);
    const t=(d,fill='none',width=1)=>L(d,mid,top,fill,0,1,1,line,width);
    const [,e,w]=c.arms[0],angle=-Math.atan2(w[0]-e[0],w[1]-e[1])*180/Math.PI;
    const wrist=(d,fill='none',width=1)=>L(d,...w,fill,angle,1,1,line,width);
    const shoe=(d,fill='none')=>L(d,...c.legs[1][2],fill,0,1,1,line,.8);
    const variants={
      beret:()=>h('M-49-37Q-60-69-25-79Q4-92 36-73Q60-66 47-44L28-31Z',bottom)+h('M-46-42Q0-51 43-43L40-31Q0-36-43-30Z',bottomShade)+h('M-29-66Q-11-77 9-74M17-78L20-85 25-84 24-77','none',.8),
      cap:()=>h('M-47-31Q-47-70-6-74Q35-73 44-37L41-29Z',bottom)+h('M-45-31Q0-39 43-30L62-19Q37-5 3-20L-44-22Z',accent)+h('M-6-70Q-14-52-13-35M14-67Q29-54 29-35','none',.7),
      beanie:()=>h('M-46-29Q-50-73-4-81Q47-78 45-29Z',clothShade)+h('M-47-37Q0-47 47-36L46-20Q0-29-47-20Z',bottom)+
        [-35,-25,-15,-5,5,15,25,35].map(x=>h(`M${x}-34L${x+1}-24`,'none',.7)).join('')+h('M-30-46Q-30-65-18-70M-9-48L-6-72M15-47L13-70M30-45L25-61','none',.7),
      headband:()=>h('M-46-12Q-43-60-7-63Q30-62 46-19L41-15Q26-54-7-55Q-34-49-40-10Z',accent)+h('M-42-18Q-33-53-12-57','none',.7),
      'hair-clip':()=>h(c.style%2?'M27-28L43-22 41-16 25-22Z':'M25-22L43-30 46-25 28-17Z',accent)+h(c.style%2?'M30-24L39-21':'M30-22L40-26','none',.6),
      glasses:()=>h('M-34-4Q-22-10-10-3L-11 10Q-23 15-33 8Z M10-3Q22-10 34-4L33 8Q23 15 11 10Z M-10 1Q0-3 10 1M-34 0L-42-5M34 0L42-5','none',1.3),
      sunglasses:()=>h('M-34-4Q-22-10-10-3L-12 10Q-25 14-33 7Z M10-3Q22-10 34-4L33 7Q25 14 12 10Z',bottomShade)+h('M-10 0Q0-4 10 0M-34 0L-43-5M34 0L43-5','none',1.2)+P(placed('M-28-1L-20-4M17-1L25-4',c.hx,c.hy,0,c.face,c.face),'none',cloth,1),
      scarf:()=>t('M-25-22Q0-7 25-22L30-3Q0 18-30-2Z',accent)+t('M-17 8Q-28 34-19 72L-2 76Q-11 42 4 15Z',accent)+t('M-23-12Q0 2 23-12M-22-5Q0 9 24-5M-18 71L-18 78M-12 73L-12 81M-6 74L-6 81','none',.7),
      necklace:()=>t('M-20-11Q-21 30 0 47Q21 30 20-11','none',1)+t('M0 42L6 48 0 55-6 48Z',accent)+t('M0 45L3 48 0 51-3 48Z',cloth,.5),
      'bow-tie':()=>t('M-4 6L-20-2-24 15-5 13 5 13 24 15 20-2 4 6Z',accent)+t('M-4 5L4 5 4 14-4 14Z',bottom),
      bracelet:()=>wrist('M-8-3Q0 1 8-3L8 3Q0 8-8 3Z',accent)+wrist('M-5 0L-4 4M0 1L0 5M5 0L4 4','none',.6),
      watch:()=>wrist('M-8-8L8-8 8 6-8 6Z',bottom)+wrist('M-5-7Q0-10 5-7L6 4Q0 8-6 4Z',cloth)+wrist('M0-4L0 0 3 2','none',.8),
      ring:()=>wrist('M1 27L6 26 6 30 1 31Z',accent)+wrist('M2 27L4 24 6 27 4 29Z',cloth,.5),
      earrings:()=>h('M-44 16Q-49 24-44 29Q-39 24-44 16Z M44 16Q49 24 44 29Q39 24 44 16Z',accent,.8)+h('M-44 19L-44 24M44 19L44 24','none',.5),
      belt:()=>t('M-49 160Q0 152 49 160L49 169Q0 161-49 169Z',bottomShade)+t('M-7 157L8 157 8 169-7 169Z',accent)+t('M-4 160L5 160 5 166-4 166Z',bottom)+t('M-24 159L-24 165M25 159L25 165','none',.6),
      'waist-chain':()=>t('M-47 170Q-24 206 22 169M-45 174Q-21 209 21 174','none',.9)+t('M-25 194L-25 202M-16 196L-16 204M-6 194L-5 202','none',.6),
      badge:()=>t('M-43 44L-29 44-29 59-36 65-43 59Z',accent)+t('M-39 49L-36 46-33 49-34 54-38 54Z',cloth,.6),
      brooch:()=>{const x=mid+(c.style===2?15:-35),y=top+(c.style===2?76:36);return L('M0-5Q-12-19-7-3Q-20 0-6 4Q-8 17 2 6Q13 13 7 0Q18-9 3-6Z',x,y,accent,0,1,1,line,1)+E(x,y,3.3,3.3,cloth,line,.6);},
      armband:()=>{const [s,e]=c.arms[1],p=mix(s,e,.65),a=-Math.atan2(e[0]-s[0],e[1]-s[1])*180/Math.PI;return L('M-20-6L20-6 20 6-20 6Z',...p,accent,a,1,1,line,1)+L('M-4-3L4-3 4 3-4 3Z',...p,cloth,a,1,1,line,.5);},
      'shoe-charm':()=>shoe('M4 6Q13 4 13 12M13 10L18 16 13 22 8 16Z',accent)+shoe('M13 13L15 16 13 19 11 16Z',cloth),
      backpack:()=>t('M-49-7Q-63 45-49 103L-41 100Q-51 46-40-1Z M49-7Q63 45 49 103L41 100Q51 46 40-1Z',bottomShade)+t('M-48 5Q-54 40-48 68M48 5Q54 40 48 68','none',.8)
    };
    return c.extras.map(id=>{
      const [en,he,slot]=words[id],result={id,en,he,slot,svg:wrap(variants[id]())};
      if(id==='backpack') result.rearSvg=wrap(t('M-50 8Q-67 15-68 50L-70 139Q-66 159-44 162L44 162Q66 159 70 139L68 50Q67 15 50 8Z',bottom)+t('M-67 78L-57 78-56 126-68 128Z M67 78L57 78 56 126 68 128Z',accent)+t('M-28 10L-28-10Q0-29 28-10L28 10 19 10 19-6Q0-17-19-6L-19 10Z',bottomShade));
      return result;
    });
  }
  people.forEach(create);
})();

/**
 * The Smileyometer is based on 5-point Likert scale (configurable from 2 to 5) showing very sad to very happy faces.
 *
 * Sclera symbols (https://www.sclera.be) are licensed by creative commons (CC BY-NC 2.0 BE).
 * Code is licensed by creative commons (CC BY-NC-ND 3.0).
 * 
 * @author (Tero Avellan, tero.avellan@tuni.fi) 
 * @version (20190302)
 */
 
var smileyWidth, smileyHeight, smileyTextY, smileyTextSize; 
var smileyColor, smileyData, smileyImg, smileyState;
var smileyRangeAsc, smileyRangeSize, smileyRangeLabel, smileyResponseTime;
var colors, images, timestamp;

function setup() {
  createCanvas(windowWidth,windowHeight);
  
  smileyRangeAsc = true; // True = Ascending, False = Descending
  smileyRangeSize = 2; // Size of pictorial Likert scale
  smileyRangeLabel = true; // True = show, False = hidden
  smileyResponseTime = 1500; // Time between possible clicks in ms
  
  smileyX = windowWidth/smileyRangeSize/2;
  smileyY = windowHeight/2;
  
  colors = new Array();
  images = new Array();
  smileyImg = new Array();
  smileyColor = new Array();
  smileyData = new Array();
  smileyState = new Array();
  
  smileyWidth = windowWidth/smileyRangeSize;
  smileyHeight = smileyWidth;
  smileyTextY = smileyHeight/1.25;
  smileyTextSize = smileyHeight/4;
  
  // Range from negative (1)0 to neutral (3)2 to positive (5)4, showing very sad to very happy faces  
  switch(smileyRangeSize) {
    case 2:
      // Colors
      colors[0] = color(255,0,0); // red
      colors[1] = color(0,128,0); //green
      // Images
      images[0] = 'assets/smiley_2.png';
      images[1] = 'assets/smiley_3.png';
      break;
    case 3:
      // Colors
      colors[0] = color(255,128,128); // red
      colors[1] = color(255,255,204); // yellow
      colors[2] = color(128,255,128); //green
      // Images
      images[0] = 'assets/smiley_2.png';
      images[1] = 'assets/smiley_3.png';
      images[2] = 'assets/smiley_5.png';
      break;
    case 4:
      // Colors
      colors[0] = color(255,0,0); // red
      colors[1] = color(255,128,128); // light red
      colors[2] = color(128,255,128); // light green
      colors[3] = color(0,128,0); //green
      // Images
      images[0] = 'assets/smiley_1.png'; // Sad
      images[1] = 'assets/smiley_2.png';
      images[2] = 'assets/smiley_3.png';
      images[3] = 'assets/smiley_5.png'; // Happy
      break;
    default:
      // Colors
      colors[0] = color(255,0,0); // red
      colors[1] = color(255,128,128); // light red
      colors[2] = color(255,255,204); // yellow
      colors[3] = color(128,255,128); // light green 
      colors[4] = color(0,128,0); //green
      // Images
      images[0] = 'assets/smiley_1.png'; // Sad
      images[1] = 'assets/smiley_2.png';
      images[2] = 'assets/smiley_3.png';
      images[3] = 'assets/smiley_4.png'; 
      images[4] = 'assets/smiley_5.png'; // Happy
      break;
  }

  // Reset/clear browser's localStorage
  for(smileyIndex=0; smileyIndex<smileyRangeSize; smileyIndex++) { 
    smileyState[smileyIndex] = 0;
    localStorage['smileyPoint'+smileyIndex] = 0;
    if (smileyRangeAsc) { smileyImg[smileyIndex] = loadImage(images[smileyIndex]); smileyColor[smileyIndex] = colors[smileyIndex]; }
    else { smileyImg[smileyIndex] = loadImage(images[smileyRangeSize-i-1]); smileyColor[smileyIndex] = colors[smileyRangeSize-i-1]; }
  }
} 

function draw() {
  for(smileyIndex=0; smileyIndex<smileyRangeSize; smileyIndex++) { smileyData[smileyIndex] = Number(localStorage['smileyPoint'+smileyIndex]); }
  smileyDataSum = smileyData.reduce(function(a, b) { return a + b; }, 0);
  
  background(0);
  imageMode(CENTER);
  textAlign(CENTER);
  
  var smileyPosCoeff = 1; 
  for(smileyIndex=0; smileyIndex<smileyRangeSize; smileyIndex++) {
    if (smileyState[smileyIndex] == 1) { tint(smileyColor[smileyIndex]); } else { noTint(); };
    image(smileyImg[smileyIndex], smileyX*(smileyPosCoeff),smileyY, smileyWidth, smileyHeight);
    if(smileyDataSum>0 && smileyRangeLabel) {
      stroke(0); strokeWeight(2); fill(255);
      textSize(smileyTextSize*0.5); text(smileyData[smileyIndex], smileyX*(smileyPosCoeff),smileyY-smileyTextY);      
      textSize(smileyTextSize); text(Math.round(smileyData[smileyIndex]/smileyDataSum*100)+'%', smileyX*(smileyPosCoeff),smileyY+smileyTextY); 
    }
    smileyPosCoeff = smileyPosCoeff+2;
  }
  // Copyright
  fill(255); textSize(smileyTextSize*0.2);
  text('Kuvat: Sclera. Lisenssi: CC BY-NC 2.0 BE.', windowWidth/2,windowHeight-(smileyTextSize*0.2));
}

function saveCount(smileyIndex) {
  var timestampNow = Math.round(new Date().getTime());  
  if (!timestamp || timestampNow-timestamp>smileyResponseTime) {
    localStorage['smileyPoint'+smileyIndex] = Number(localStorage['smileyPoint'+smileyIndex])+1;
    timestamp = timestampNow;
  }
}

function overSmiley(sX, sY, sWidth, sHeight) {
  if (mouseX >= sX-sWidth/2 && mouseX <= sX+sWidth/2 && mouseY >= sY-sHeight/2 && mouseY <= sY+sHeight/2) { return true; } 
  else { return false; }
}

function touchStarted() {
  var smileyPosCoeff=1; for(smileyIndex=0; smileyIndex<smileyRangeSize; smileyIndex++) { if(overSmiley(smileyX*(smileyPosCoeff),smileyY, smileyWidth, smileyHeight)) { saveCount(smileyIndex); smileyState[smileyIndex] = 1; } else { smileyState[smileyIndex] = 0; }; smileyPosCoeff = smileyPosCoeff+2; }
  return false;
}

function touchEnded() {
  for(smileyIndex=0; smileyIndex<smileyRangeSize; smileyIndex++) { smileyState[smileyIndex]=0; }
  return false;
}

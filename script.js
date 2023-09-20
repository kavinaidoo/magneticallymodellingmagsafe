//Dimensions taken from https://developer.apple.com/accessories/Accessory-Design-Guidelines.pdf Release R20, p125 onwards (MagSafe Attach > Mechanical)
const inner_r1 = 23     //mm
const inner_r2 = 24.15  //mm
const outer_r1 = 25.9   //mm
const outer_r2 = 27.05  //mm
mThickness = 0.55  //mm

inner_r = (inner_r1+inner_r2)/2.0 //reducing the physical magnet dimensions to individual dipoles
outer_r = (outer_r1+outer_r2)/2.0 //^

//Scaling dimensions for better plotting
scaleFactor = 4

inner_r = inner_r*scaleFactor
outer_r = outer_r*scaleFactor
mThickness = mThickness*scaleFactor
mWidth = (outer_r2 - outer_r1)*scaleFactor

//Variables for sketch size and array

var sketchSize = [600,600] //width, height in px

var staticXY = [sketchSize[0]/2,sketchSize[1]/3] //XY co-ord of centre of static array
var radii = [inner_r,outer_r] //array of radii
var magDipoleMoment = [[0,1],[0,-1]] // up and down versions

//staticArray -> [[position_x, position_y, dipole_moment_x, dipole_moment_y],...]
var staticArray = [[-1*radii[1]+staticXY[0],staticXY[1],magDipoleMoment[0][0],magDipoleMoment[0][1]],
                   [-1*radii[0]+staticXY[0],staticXY[1],magDipoleMoment[1][0],magDipoleMoment[1][1]],
                   [radii[0]+staticXY[0],staticXY[1],magDipoleMoment[1][0],magDipoleMoment[1][1]],
                   [radii[1]+staticXY[0],staticXY[1],magDipoleMoment[0][0],magDipoleMoment[0][1]]]


var controlMode = "mouse";
function switchMode(){ //switches between mouse and slider mode
  if (controlMode == "mouse"){
    controlMode = "sliders"
  } else {
    controlMode = "mouse"
  }
}

var xSlider;
var ySlider;
var modeButton;
function setup() { //sets up sketch
  createCanvas(sketchSize[0],sketchSize[1]); //400x400px canvas
  xSlider = createSlider(0,sketchSize[0],sketchSize[0]/2,0);
  xSlider.position(105, sketchSize[1]+5);
  xSlider.style('width', '80px');
  ySlider = createSlider(0,sketchSize[1]/3-10,(sketchSize[1]/3-10)/2,0);
  ySlider.position(195, sketchSize[1]+5);
  ySlider.style('width', '80px');
  modeButton = createButton('Switch Mode');
  modeButton.position(5, sketchSize[1]+6);
  modeButton.mousePressed(switchMode);
  noCursor(); //hides mouse cursor
  //noStroke(); //removes black border (stroke)
}


function draw() {
  background(126);
  
  drawArray(staticArray)
  
  var xPos = 0;
  var yPos = 0;
  stroke('black')
  strokeWeight(0);
  fill('black')
  if (controlMode == "mouse"){
    xPos = mouseX; //sets position to mouse
    yPos = Math.min(mouseY,sketchSize[1]/3-10); //^
    noCursor();
    text("Mouse Mode (use Mouse for control)", 5, sketchSize[1]-5);
  } else {
    text("Slider Mode (use Sliders for control)", 5, sketchSize[1]-5);
    xPos = xSlider.value() //sets position to slider value
    yPos = ySlider.value() //^
    cursor();
  }
  
  let movingArray = addForcesToMovingArray(staticArray,setupMovingArray(xPos,yPos));
  
  drawArray(movingArray);
  drawForceLines(movingArray,xPos,yPos)
  
  stroke('black')
  strokeWeight(0);
  fill('black')
  text(xPos, 10,15);
  text(mouseY, 10,25);
}

function dot(a,b){
  //dot product of 2x2 arrays
  return a[0]*b[0]+a[1]*b[1]
}

function forceVector(m1,m2,r){
  //force of magnetic dipole m1 on m2, r is from m1 to m2
  //implements equation from here -> https://en.wikipedia.org/wiki/Force_between_magnets#Magnetic_dipole%E2%80%93dipole_interaction

  //let mu0 = 1.256e-6 //actual mu0
  let mu0 = 40000000 //scaled mu0 for visibility
  let rmag = Math.sqrt(r[0]**2+r[1]**2)
  let a1 = 3*mu0/(4*Math.PI*rmag**5)
  
  a2x = dot(m1,r)*m2[0]
  a2y = dot(m1,r)*m2[1]
  a3x = dot(m2,r)*m1[0]
  a3y = dot(m2,r)*m1[1]
  a4x = dot(m1,m2)*r[0]
  a4y = dot(m1,m2)*r[1]
  a5x = 5*r[0]*(dot(m1,r)*dot(m2,r))/(rmag**2)
  a5y = 5*r[1]*(dot(m1,r)*dot(m2,r))/(rmag**2)
  
  fx = a1*(a2x+a3x+a4x-a5x)
  fy = a1*(a2y+a3y+a4y-a5y)
  
  return [fx,fy]
}


function addForcesToMovingArray(sArray,mArray){
  //calculates and adds forces to magnetic dipoles in mArray
  //sArray -> [[position_x, position_y, dipole_moment_x, dipole_moment_y],...]
  //mArray -> [[position_x, position_y, dipole_moment_x, dipole_moment_y, force_x, force_y],...]

  let fx = 0;
  let fy = 0;
  let j = 0;
  
  for (let s of mArray){ //note swapped vars, my mistake :)
    for (let m of sArray){
      fx = fx + forceVector([s[2],s[3]],[m[2],m[3]],[s[0]-m[0],s[1]-m[1]])[0]
      fy = fy + forceVector([s[2],s[3]],[m[2],m[3]],[s[0]-m[0],s[1]-m[1]])[1]
    }
    mArray[j][4] = fx
    mArray[j][5] = fy
    fx = 0
    fy = 0
    j = j + 1
  }
  return mArray;
}

function setupMovingArray(mX,mY){
  // returns movingArray based on mouse positions passed to function
  //mArray -> [[position_x, position_y, dipole_moment_x, dipole_moment_y, force_x, force_y],...]
  let mArray = [[-1*radii[1]+mX,mY,magDipoleMoment[0][0],magDipoleMoment[0][1],0,0],
                [-1*radii[0]+mX,mY,magDipoleMoment[1][0],magDipoleMoment[1][1],0,0],
                [radii[0]+mX,mY,magDipoleMoment[1][0],magDipoleMoment[1][1],0,0],
                [radii[1]+mX,mY,magDipoleMoment[0][0],magDipoleMoment[0][1],0,0]];
  
  return mArray;
}

function drawArray(anyArray){
  //draws magnets, based on dipole moment direction
  for (let x of anyArray){ 
    stroke('black')
    strokeWeight(1);
    if (x[3]==-1){ //
      fill(color(0, 0, 255))
      rect(x[0]-mWidth/2,x[1]-mThickness,mWidth,mThickness)
      fill(color(255, 0, 0))
      rect(x[0]-mWidth/2,x[1],mWidth,mThickness)
    }
    if (x[3]==1){
      fill(color(255, 0, 0))
      rect(x[0]-mWidth/2,x[1]-mThickness,mWidth,mThickness)
      fill(color(0, 0, 255))
      rect(x[0]-mWidth/2,x[1],mWidth,mThickness)
    }
     
    //ellipse(x[0],x[1],10,10);

  }
}

function drawForceLines(mArray,mX,mY){
  //draws forces on magnetic dipoles as lines and sums to get resultant
  let fx = 0;
  let fy = 0;
  stroke('orange')
  strokeWeight(1);
  for (let x of mArray){
    line(x[0],x[1],x[0]+x[4],x[1]+x[5]);
    fx = fx + x[4];
    fy = fy + x[5];    
  }
  //strokeWeight(fx+fy);
  stroke('red')
  line(mX,mY,mX+fx,mY+fy)
  
}
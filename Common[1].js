const containerClass = "stepContainer";
const circleClass = "circle";
const captionClass = "stepCaption";
const activeContainerClass = "stepContainer inProgress";
const activeCircleClass = "circle inProgressCircle";
const activeCaptionClass = "stepCaption finished";
const finishedContainerClass = "stepContainer";
const finishedCircleClass = "circle finishedCircle";
const finishedCaptionClass = "stepCaption finished";
const innerCircleClass = "availableStep";

window.currentStep = 0;
window.maxStep = 0;


//the steps from where our robot is allowed to go to next
window.allowedNextSteps = [1];

// A bookmarklet to send a speaktext command to the BrowserSpeak application.
var server = "localhost:{0}";
// Change the port number for your app to something unique.

var maxreqlength = 1500;
// This is a conservative limit that should work with all browsers.

var stepsDict = {};
var stepsArray = [];

//keep track whether we just finished executing a step or not
window.finishedStep = false;

String.prototype.format = function() {
  a = this;
  for (k in arguments) {
    a = a.replace("{" + k + "}", arguments[k])
  }
  return a
}

//
//defining some methods that will be used to dynamically create the UIElements of both of the status bars
//

function addContainer(step) {
  var container = document.createElement("div");
  container.id = "step" + step;
  container.className = containerClass;
  document.getElementById("UiPathButtonContainer").appendChild(container);
  return container;
}

//some steps will be done only in actionbar mode
function addCircleDiv(container, step, actionbar) {
  var circ = document.createElement("div");
  circ.className = circleClass;
  if(actionbar) circ.innerHTML = "<div class='stepid'>" + step + "</div>";
  container.appendChild(circ);
  
   if(actionbar)
   {
	  //create the 'step available' circle
	  var innerCircle = document.createElement("div");
	  innerCircle.className = innerCircleClass;
	  container.getElementsByClassName(circleClass)[0].appendChild(innerCircle);
   }
}

function addCaptionDiv(container, caption) {
  var cap = document.createElement("div");
  cap.className = captionClass;
  cap.innerHTML = caption;
  container.getElementsByClassName(circleClass)[0].appendChild(cap);
}

//some steps will be done only in actionbar mode
function addStep(stepData, actionbar) {
	
  var stepDataObject = JSON.parse(stepData);  
  
  
  var newStep = ++window.maxStep;
  
  //add step index to the stepData
  stepDataObject.stepIndex = newStep;
  
  var container = addContainer(newStep);
  addCircleDiv(container, newStep, actionbar);
  addCaptionDiv(container, stepDataObject.name);
  stepsDict[stepDataObject.name] = stepDataObject;
  stepsArray[newStep] = stepDataObject;
  
  if(actionbar)
  {
	//add the Change State Event
	$(".stepContainer").click(clickOnState);
	uiOutlineNextSteps();
  }
  else{
	//if dashboard
	$(".stepContainer").click(clickOnUseCase);
	
  }
}

function getPageState(){
	
	//call from workflow. Hide loader
	//$(".loading").hide();
	return window.currentPageStatus;
}


/*Pushing Status to the robot process*/
function _formatCommand(port,args)
{
    // Add a timestamp to ensure the URL is always unique and hence
    // will never be cached by the browser.

    return "http://" + server.format(port) + "/dummy.gif" + args + 
           "&timestamp=" + new Date().getTime(); 
}

function _speakText(port)
{
	//using a dummy image object to send a request to the robot
	try {
		//Using this way of sending requests in order to get around the Cross Domain policy (and alternative might be CORS)
		var image = new Image(1,1); 
		image.src = _formatCommand(port,"?pageStatus=" + JSON.stringify(window.currentPageStatus));
		//pushPageState();
	}
	catch(err) {
		//console.log("Could not make out the response"); 
	}
}

//function used to push a status to all the ports foundin the postingPorts array
function _pushStatus(){

	//console.clear();
	for(var i=0;i<= postingPorts.length;i++)
	{
		_speakText(postingPorts[i]);
	}
	
	
}

//pushing a status to the robot process once every 100ms
var intervalID = setInterval(_pushStatus, 100);


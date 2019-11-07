window.currentPageStatus = { isAnyStepSelected:false, stepSelected: -1};


function resetStep(step) {
  if (step > 0 && step <= maxStep) {
  var stepDiv = document.getElementById("step" + step);
  stepDiv.className = containerClass;
  var divs = stepDiv.getElementsByTagName("div");
  divs[0].className = circleClass;
  divs[2].className = captionClass;
  }
}

function goToStepByNumber(step) {
  finishStep(window.currentStep);

  activateStep(stepsArray[step].stepIndex);
  window.currentStep = step;
}

function goToStep(stepName) {
  goToStepByNumber(stepsDict[stepName].stepIndex);
}






function clickOnState(event){
	
	//extract the number from the current 
	var step = parseInt($(event.currentTarget).attr("id").match(/\d+/)[0]);
	
	//if the step is in the allowed next steps
	if (step > 0 && step <= maxStep && allowedNextSteps.indexOf(step) > -1) 
	{
		//visual changes letting the user know that the next step needs to be selected
		$("body").removeClass("blinking");
		
		currentPageStatus.clickedStep = step;
		currentPageStatus.isJumpingToStep = true;
		
		//modify the UI
		finishStep(window.currentStep);
		activateStep(step);
		
		
		//show loader until call from workflow is reached
		$(".loading").show();
	}
	else{
		console.log("this step cannot be selected as it is not a valid next step");
	}
}



function clickOnUseCase(event){
	
	//extract the number from the current 
	var step = parseInt($(event.currentTarget).attr("id").match(/\d+/)[0]);
	window.currentPageStatus.isAnyStepSelected = true;
	window.currentPageStatus.stepSelected = step;
	
	//show loader until call from workflow is reached
	$(".loading").show();
}

$(document).ready(
function(){
	
	//the dashboard will enter test mode if launched in Chrome
	var isChrome = !!window.chrome && !!window.chrome.webstore;
	
	if(isChrome)
	{
		addStep('{"name":"Test1", "nextSteps":[2,3]}');
		addStep('{"name":"Test2", "nextSteps":[3]}');
		addStep('{"name":"Test3", "nextSteps":[1]}');
	}
	
	console.log("Initialized events");
	
});

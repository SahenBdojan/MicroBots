window.currentPageStatus = { isPaused:false, isJumpingToStep: false, clickedStep:0, useCaseStopped:false, finishedStep: false};
window.currentStep = 0;

function setCurrentStep(step) {
	window.lastStep = window.currentStep;
	window.currentStep = step;
}

function uiMakeStepsClickable(){
	$(".stepContainer").removeClass("nextStepPhase");
	$(".nextStepCircle").removeClass("nextStepCircle");
	
	//mark the potential next steps as clickable
	allowedNextSteps.forEach(function(item){
		$("#step" + item).addClass("nextStepPhase");
		$("#step" + item + ">div.circle").addClass("nextStepCircle");
	});
}

function uiOutlineNextSteps(){
	if (window.currentStep > 0 && window.currentStep <= maxStep) {
		var stepProps = stepsArray[window.currentStep];
		allowedNextSteps = stepProps.nextSteps;
		
		//make the appropriate steps clickable
		uiMakeStepsClickable();
	}
	else if(window.currentStep == 0){
		
		//mark the first step as clickable
		uiMakeStepsClickable();
	}
}

function uiSetStepCurrent(step) {
	if (step > 0 && step <= maxStep) {
		var stepDiv = document.getElementById("step" + step);
		stepDiv.className = activeContainerClass;
		var divs = stepDiv.getElementsByTagName("div");
		divs[0].className = activeCircleClass;
		divs[3].className = activeCaptionClass;
	}
}

function uiSetStepFinished(step) {
	if (step > 0 && step <= maxStep) {
		var stepDiv = document.getElementById("step" + step);
		stepDiv.className = finishedContainerClass;
		var divs = stepDiv.getElementsByTagName("div");
		divs[0].className = finishedCircleClass;
		divs[3].className = finishedCaptionClass;
	}
}

function uiResetStepToInitial(step) {
	if (step > 0 && step <= maxStep) {
		var stepDiv = document.getElementById("step" + step);
		stepDiv.className = containerClass;
		var divs = stepDiv.getElementsByTagName("div");
		divs[0].className = circleClass;
		divs[3].className = captionClass;
	}
}


function resume(){
	//activate pause button; deactivate play button
	window.currentPageStatus.isPaused = false;
	$(".playButton .playBarImage").hide();
	$(".playButton .playBarImage.playBarImage-disabled").show();
	$(".pauseButton .playBarImage").show();
	$(".pauseButton .playBarImage.playBarImage-disabled").hide();
	if($("body").hasClass("blinking"))
	{	
		$("body").removeClass("blinking");
	}
}
function pause(){
	//activate play button; deactivate pause button
	window.currentPageStatus.isPaused = true;
	$(".playButton .playBarImage").show();
	$(".playButton .playBarImage.playBarImage-disabled").hide();
	$(".pauseButton .playBarImage").hide();
	$(".pauseButton .playBarImage.playBarImage-disabled").show();
	$("body").addClass("blinking");
}

function activateStep(step) {
	//if the step is in the allowed next steps
	if (step > 0 && step <= maxStep) 
	{
		resume();
		
		setCurrentStep(step);
		uiSetStepCurrent(step);
		
		uiOutlineNextSteps();

		//new step activated by workflow. Stop Loading
		$(".UiPathLoader").hide();

		currentPageStatus.isJumpingToStep = false;
		window.finishedStep = false;
	}
	else{
		console.log("this step cannot be selected as it is not a valid next step");
	}
}


function pausePlay( event ) {
	
	//toggle between pause and play
	if ($(event.currentTarget).hasClass('playButton') && window.currentPageStatus.isPaused){
		console.log("Playing...");
		//if workflow is paused and we press run
		resume();
	  
	  
		//if we need to go to the next step and we have a next step
		if (window.finishedStep && allowedNextSteps.length > 0)
		{
			//activateStep(allowedNextSteps[0]);
			//reset
			finishedStep = false;
			
			currentPageStatus.isJumpingToStep = true;
			currentPageStatus.clickedStep = allowedNextSteps[0];
		}
		

	  
		
	}
	else if($(event.currentTarget).hasClass('pauseButton') && ! window.currentPageStatus.isPaused){
		console.log("Pausing...");
		pause();
	//if workflow is running and we press pause
	
	
	}
	else if($(event.currentTarget).hasClass('cancelButton')){
	
		//cancel the execution of the current usecase
		window.currentPageStatus.useCaseStopped = true;
	}
}

function clickOnState(event){
	
	//extract the number from the current 
	var step = parseInt($(event.currentTarget).attr("id").match(/(?:step)(\d+)/)[1]);
	console.log(step);
	
	//if the step is in the allowed next steps
	if (step > 0 && step <= maxStep && allowedNextSteps.indexOf(step) > -1) 
	{
		
		//activating the clicked step only if the current one is finished
		if (window.finishedStep)
		{
			activateStep(step);
		}
		
		
		
		//visual changes letting the user know that the next step needs to be selected

		currentPageStatus.clickedStep = step;
		currentPageStatus.isJumpingToStep = true;
		

		
		if(window.currentPageStatus.isPaused){
			//if we're paused, we will set the workflow to resume mode
			resume();
		}
		
		
		//show loader until call from workflow is reached
		$(".UiPathLoader").show();
	}
	else{
		console.log("this step cannot be selected as it is not a valid next step: " + step);
	}
}


//this event will be called at the end of each phase.
//the user can either resume the execution of the next step or he can select another one.
function stepFinished(stepNumber, wasSkipped, suppressPause)
{
	
	if (!suppressPause) { pause(); }
	
	finishedStep = true;
	if (wasSkipped) {
		uiResetStepToInitial(stepNumber);
		window.currentStep = window.lastStep;
		uiOutlineNextSteps();
		//window.currentPageStatus.isJumpingToStep = false;
		//window.currentPageStatus.clickedStep = allowedNextSteps[0];
	} else {
		uiSetStepFinished(stepNumber);
	}
	
	uiOutlineNextSteps();

	
}

$(document).ready(
function(){
	// change to true for debugging
	if (false) {
		addStep('{"name":"Test1", "nextSteps":[2,3]}', true);
		addStep('{"name":"Test2", "nextSteps":[3]}', true);
		addStep('{"name":"Test3", "nextSteps":[1]}', true);
		addStep('{"name":"Test4", "nextSteps":[1]}', true);
		stepFinished(1);
		activateStep(2);
	}
	
	//visual initialization
	$(".playButton .playBarImage").hide();
	$(".playButton .playBarImage.playBarImage-disabled").show();
	
	//add the Pause Play event to the buttons
	$(".playBarButton").click(pausePlay);
	

	
	console.log("Initialized events");
});

$(document).on('pageinit', function (event) {	 
	$('.portal-name').html(evernym_name);
	$('.logo').html(evernym_name);					 		
});
/*
 * common functions for page show
 */
function showContents ( page, method, callback, element ) {
	$(page).on( "pageshow", function( event ) {
		app.ajaxescplan( method, callback, element, accesstokenvalue );
		$('.portal-name').html(evernym_name);
		$('.logo').html(evernym_name);
	});	
}

/*
 *Contact information
 */
function contactinfo() {
	//$.mobile.loading('show');
	showhideerror();	
	$('input#add-number,input#add_phone_or_email').on('keyup', function() {
		showhideerror();
	});		
	$('.back').off('click').on('click', function(event) {				
		if($(this).hasClass('del-mode')) {
			$('#top-del-btn').removeClass('red-delete');
			$(this).removeClass('del-mode');
			$('a#additional-link').removeClass('ui-disabled');			
			app.ajaxcallemailid( 'commethod','AddedEmail', '#added_details', accesstokenvalue );
		}
		else {
			//$.mobile.changePage('index.html',{transition:"none"});
			goToView('escalationPlansView');
		}
	});
	$('#top-del-btn').off('click').on('click', function(event) {
		//$.mobile.loading('show');
		$(this).toggleClass('red-delete');		
		if($(this).hasClass('red-delete')) {
			$('a#additional-link').addClass('ui-disabled');
			$('.back').addClass('del-mode');
			deletion(contact_details,'#added_details',accesstokenvalue);
			$('#addTXT').css('display','none');
		}
		else {
			showhideerror();
			$('#contact-info input').val( '' );
			$('a#additional-link').removeClass('ui-disabled');
			//$.mobile.loading('show');		  
			app.ajaxcallemailid( 'commethod','AddedEmail', '#added_details', accesstokenvalue );
		}
	});
	$('#addNumber').off('click').on('click', function(event) {		
		$('#add-number').blur();
		//$.mobile.loading('show');	
		var phone = $('#add-number').val();
		validateTxtcomMethod(phone);
	});
	$('#add_phone_or_email').off('click').on('click', function(event) {		
		$('#phone_or_email').blur();
		//$.mobile.loading('show');			     
		var phoneOremail = $('#phone_or_email').val();
		validate_commethods( phoneOremail);
	});			 
	$('#contact-info input').val( '' );
	$('#top-del-btn').removeClass('red-delete'); 
	$('a#additional-link').removeClass('ui-disabled');
	app.ajaxcallemailid( 'commethod','AddedEmail', '#added_details', accesstokenvalue ); 
/*	if($('#addTXT').css('display') == 'inline-block' || $('#addTXT').css('display') == 'block' ) {
		$("input").focus();
	}*/
	onGobuttonPress_addTxtcomMethod('#add-number');
	onGobuttonPress('#phone_or_email');	
}

/*
 *Additional phone or email page
 */
function additionalEmailOrPhone() {
	$('#phoneOremail').focus();
	$('#add_phoneOrEmail').off('click').on('click', function(event) {		
		$('#phoneOremail').blur();
		//$.mobile.loading('show');
		var phoneOremail = $('#phoneOremail').val();								
		validate_commethods( phoneOremail);
	});	
	$('input#phoneOremail').on('keyup', function() {
		showhideerror();
	});
	showhideerror();
	$('#phoneOremail').val('');				
	onGobuttonPress('#phoneOremail');		
}
/*
 * Email-verification page
 */
function verification() {
	var digitCode;
	var emailReg = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
	$('input#verification-code_email').on('keyup', function() {
		showhideerror();
	});
	showhideerror();
	$('#verification-code_email').val('');					
	$('#verify-code_email').off('click').on('click', function(event) {		
		$('#verification-code_email').blur();
		//$.mobile.loading('show');							 
		digitCode = $('#verification-code_email').val();				
		validate_verification_code(digitCode);
	});
	$('#resendEmail').off('click').on('click', function(event) {
		app.ajaxcallForSendingemailVerificationCode('commethod/',verification_com_method_id,accesstokenvalue);									
	});	
	if(emailReg.test(verification_com_method)) { 
			$('#verification-code_email').attr("placeholder", "enter 6-digit code from email");
	}
	else { 
			$('#verification-code_email').attr("placeholder", "enter 6-digit code from TXT");
	}	
	$('#recently-added-email').html(verification_com_method);
	onGobutton_for_verify('#verification-code_email');	
}

/*
 *Phone-verification page
 */
function PhoneVerify() {	
	var digitCode;
	$('.error-message').html('');
	$('#verification-code_phone').val('');
	$('input#verification-code_phone').on('keyup', function() {
		showhideerror();
	});			
	$('#verify-code_phone').off('click').on('click', function(event) {		
		$('#verification-code_phone').blur();
		//$.mobile.loading('show');				 
		digitCode = $('#verification-code_phone').val();					
		validate_verification_code(digitCode);
	});				
	$('#recently-added-no').html(verification_com_method);
	onGobutton_for_verify('#verification-code_phone');	
}
/*
 * This function is called at specific escalation plan action click
 */
function EscPlansettings() {	
	esc_plans_settings( esc_plans, '#escPlanData' );	
	$('#urgencyName').html(urgencynameTxt);
}
/*
 *This function is for  Go button press
 */
function onGobuttonPress_addTxtcomMethod(Textbox) {
	$('input'+Textbox+'').on('keyup', function(e) {
		if (e.keyCode == '13') {
			$('input'+Textbox+'').trigger('blur');
			var inputVal = $(Textbox).val();
			validateTxtcomMethod(inputVal);		
		}
	});
}
function onGobuttonPress(Textbox) {
	$('input'+Textbox+'').on('keyup', function(e) {
		if (e.keyCode == '13') {
			$('input'+Textbox+'').trigger('blur');			
			var inputVal = $(Textbox).val();			
			validate_commethods( inputVal);
		}
	});
}
/*
 *This function is for  Go button press
 */
function onGobutton_for_verify(Textbox) {
	$('input'+Textbox+'').on('keyup', function(e) {
		if (e.keyCode == '13') {
			$('input'+Textbox+'').trigger('blur');
			var inputVal = $(Textbox).val();			
			validate_verification_code(inputVal);
		}
	});
}
/*
 *This function is for  Go button press
 */
function validateTxtcomMethod(inputVal) {
	var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
	var  phonepatternforhyphen = /^\d+(-\d+)*$/;
	if(inputVal == '') {
		$('.error-message').html('<span>ERROR : </span>Please enter phone number');
		$.mobile.loading('hide');	
		return false;
	}
	else if(phoneNumberPattern.test(inputVal) || phonepatternforhyphen.test(inputVal) ){ 
		validate_commethods( inputVal);
	}
	else { 
		$('.error-message').html('<span>ERROR : </span>Not a valid phone number');
		$.mobile.loading('hide');
		return false;
	}
}
/*
 *This function validate verification code
 */
function validate_verification_code(digitCode) {
	if(digitCode == '') {
		$('.error-message').html('<span>ERROR : </span>Please enter verification code');
			$.mobile.loading('hide');				
			return false;
	}
	else {						
		if(isNaN(digitCode) || digitCode.length != 6){ 
			$('.error-message').html('<span>ERROR : </span>Incorrect verification code');
			$.mobile.loading('hide');
		}
		else {			
				app.ajaxcall_com_method_Verification('commethod/verification/',digitCode,accesstokenvalue);		
		}
	}
}
/*
 * This function validates all phone/emails
 */
function validate_commethods( phoneOremail) {	
 var emailReg = /^([\w-\.\+]+@([\w-]+\.)+[\w-]{2,4})?$/;
 var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
 var  phonepatternforhyphen = /^\d+(-\d+)*$/;
 if(phoneOremail == '') {
  $('.error-message').html('<span>ERROR : </span>Please enter email or phone number');
	$.mobile.loading('hide');	
  return false;
 } 
 else if ( !phonepatternforhyphen.test(phoneOremail)) {
  if(!emailReg.test(phoneOremail)) {
   $('.error-message').html('<span>ERROR : </span>Not a valid email');
	 $.mobile.loading('hide');      
   return false;
  }
  else if( emailReg.test(phoneOremail) ) {  
   var resultdata = app.ajaxcall_create_com_method('commethod',phoneOremail,accesstokenvalue, 'EMAIL');   
   if ( typeof resultdata.address == 'undefined' ) {
    $('.error-message').html('<span>ERROR : </span>'+resultdata);
    $.mobile.loading( 'hide');
   }	
   else  {
    verification_com_method = resultdata.address;
    verification_com_method_id = resultdata.id;		  
    //$.mobile.changePage("verification.html",{ transition: "none"});	
		goToView('verifyContactView');
   }
  }    
 }
 else  {
  if(!phoneNumberPattern.test(phoneOremail) || (10 > phoneOremail.length > 12 )){
   $('.error-message').html('<span>ERROR : </span>Not a valid phone number');
	 $.mobile.loading('hide');      
   return false;
  }
  else if(phoneNumberPattern.test(phoneOremail)){   
   if(phoneOremail.match(/^[0-9]{3}\-[0-9]{3}\-[0-9]{4}$/)) {
    phoneOremail = phoneOremail;
   }
   else if(phoneOremail.indexOf('-') == 3 || phoneOremail.indexOf('-') == 6)
    
   {
    phoneOremail = (phoneOremail.indexOf('-') == 3) ? phoneOremail.substring(0, 7) + "-" + phoneOremail.substring(7, phoneOremail.length) : phoneOremail.substring(0, 3) + "-" + phoneOremail.substring(3, phoneOremail.length);
   }
   else {
    phoneOremail = phoneOremail.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
   }
   var resultdata = app.ajaxcall_create_com_method('commethod', phoneOremail, accesstokenvalue, 'TEXT');
   if ( typeof resultdata.address == 'undefined' ) {
    $('.error-message').html('<span>ERROR : </span>'+resultdata);
		$.mobile.loading('hide');    
   }
   else {
    verification_com_method = resultdata.address+' (TXT)';
    verification_com_method_id = resultdata.id;		 
    //$.mobile.changePage("phone-verify.html",{transition:"none"});
		goToView('verifyContactView');	  
   }          
  }    
 } 
}
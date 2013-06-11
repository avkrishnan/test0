var api_codes = {
    100000: 'A verification email was sent to the email address that you specified. Please click on the link in that email to verify that you own that account.',
    100912: 'The verification key you submitted has already been verified.',
    100500: 'The verification key you submitted is invalid.',
    100202: '',
    
};

function getAPICode(key){
    return api_codes[key];
}
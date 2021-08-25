module.exports = function myFunction() {
    let Browser = '';
    if ((navigator.userAgent.indexOf("Opera") || navigator.userAgent.indexOf('OPR')) != -1) {
        Browser = 'Opera';
    }
    else if (navigator.userAgent.indexOf("Chrome") != -1) {
        Browser = 'Chrome';
    }
    else if (navigator.userAgent.indexOf("Safari") != -1) {
        Browser = 'Safari';
    }
    else if (navigator.userAgent.indexOf("Firefox") != -1) {
        Browser = 'Firefox';
    }
    else if ((navigator.userAgent.indexOf("MSIE") != -1) || (!!document.documentMode == true)) //IF IE > 10
    {
        Browser = 'IE';
    }
    else {
        Browser = 'unknown';
    }
    return Browser;
}

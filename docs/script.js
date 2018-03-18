function hide(id) {
    document.getElementById(id).style.display = 'none';
}
function show(id,how) {
    document.getElementById(id).style.display = how;
}
function htmlspecialchars(str) {
    var f = true;
    var res = str;
    var resold = res;
    ch = 0;
    while (f) {
        res = res.replace("&","&amp");
        res = res.replace("<","&lt");
        res = res.replace(">","&gt");
        res = res.replace("\"","&#34");
        res = res.replace("'","&#39");
        ch++;
        if (ch == (res.length)-1) {
            f = false;
        }
    }
    return res;
}
function replacefromto(oldid,newid,oldrem=false) {
    var fromid = document.getElementById(oldid);
    var tostr = htmlspecialchars(fromid.value);
    document.getElementById(newid).innerHTML = tostr;
    if (oldrem==true) {
        fromid.innerHTML="";
    }
}
function replacevalue(id, newv) {
    document.GetElementById(id).innerHTML=newv;
    if (oldid.value!=encodeURIComponent(oldid.value)) {
    }
}
$(document).ready(function() {
    $("load").addClass("fa fa-spinner fa-pulse fa-1x fa-fw");
});
<html>
<div id="root"></div>
@vite('resources/js/app.js')


<script>
var token='{{(isset($token))?$token:"" }}';

    setCookie('_UserSession',token,1);
    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }

console.log('function',getCookie('_UserSession'));
    function getCookie(name) {
        var nameEQ = name + "=";

        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }
</script>
</html>

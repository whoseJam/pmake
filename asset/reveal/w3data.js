export function w3IncludeHTML(cb) {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var parser = new DOMParser();
          var htmlString = this.responseText;
          var doc = parser.parseFromString(htmlString, 'text/html');
          var rootElement = doc.documentElement.children[1].firstChild;
          
          var parentElement = elmnt.parentNode;
          parentElement.insertBefore(rootElement, elmnt.nextSibling);
          parentElement.removeChild(elmnt);
          w3IncludeHTML(cb);
        }
      }      
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
  if (cb) cb();
}
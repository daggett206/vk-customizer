$.get(chrome.extension.getURL('/style.css'),
    function(data) {
        var script = document.createElement("style");
        script.innerHTML = data;
        document.body.appendChild(script);
    }
);
$.get(chrome.extension.getURL('/injected.js'),
    function(data) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.innerHTML = data;
        document.body.appendChild(script);
    }
);
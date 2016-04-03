(function(){

    var customBox = addElement("div", "customBox"),
        customTrigger = addElement("div", "customTrigger"),
        customColorInput = addElement("input", "customColorInput", function(el){
            el.setAttribute('type','color');
        }),
        customHeading = addElement("h3", "customHeading"),
        customColorSet = addElement("input", "customColorSet", function(el){
            el.setAttribute('type','color');
        });

    var model = {
        user_data: {
            bgColor: function(){
                return localStorage.getItem('bgColor')
            }
        }
    };

    var controller = {
        openBox: function(){
            customTrigger.addEventListener('click',function(ev){
                if (!customBox.classList.contains("active")) {
                    customBox.className += " active";
                } else {
                    customBox.className = customBox.className.replace(/\bactive\b/,'');
                }
            },false);
        },
        chooseColor: function(){
            customColorInput.addEventListener('change',function(){
                var currenColor = customColorInput.value,
                    body = document.body;
                localStorage.setItem('bgColor', currenColor);
                body.style.backgroundColor = model.user_data.bgColor();
            })
        },
        chooseFeatures: function(arr){
            arr.forEach(function(el){
                el && el();
            });
        },
        render: function(){
            view.render();
        }
    };

    var view = {
        init: function(){
            var features = [controller.openBox, controller.chooseColor];
            function addToCustomBox(elem) {
                customBox.appendChild(elem);
            }
            addToCustomBox(customTrigger);
            addToCustomBox(customColorInput);
            controller.chooseFeatures(features);
            return customBox;
        },
        render: function(){
            var body = document.body,
                finishBox = view.init();
            body.style.background = localStorage.getItem('bgColor');
            body.appendChild(finishBox);
        }
    };

    function addElement(tag, className, callback){
        var elem = document.createElement(tag);
        elem.setAttribute("class", className);
        if (callback){
            callback(elem);
        }
        return elem;
    }

    controller.render();


})();
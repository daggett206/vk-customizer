(function(){

    var customBox = addElement("div", "customBox"),
        customTrigger = addElement("div", "customTrigger"),
        customColorInput = addElement("input", "customColorInput", function(el){
            el.setAttribute('type','color');
        }),
        customHeading = addElement("h3", "customHeading"),
        customColorSelect = addElement("div", "customColorContainer", function(el){
            var label = addElement("label","customColorLabel", function(el){
                el.setAttribute("for", "customColorSelect");
                el.textContent = "Цветовая схема";
            });
            var select = addElement("select", "customColorSelect", function(el){
                var optionNames = ["Выберите схему:","Premium black", "Pinky"];
                var options = function(){
                    var arr = [];
                    for (var i=0;i<optionNames.length;i++){
                        arr.push(addElement("option", "customColorOption"));
                    }
                    return arr;
                };
                el.setAttribute("id", "customColorSelect");
                options().forEach(function(item, index){
                    if(index == 0){
                        item.setAttribute("disabled", "disabled");
                        item.setAttribute("selected", "true");
                    }
                    item.textContent = optionNames[index];
                    el.appendChild(item);
                });
            });
            el.appendChild(label);
            el.appendChild(select);
        });

    var model = {
        user_data: {
            bgColor: function(){
                return localStorage.getItem('bgColor')
            },
            colorScheme: function(){
                return localStorage.getItem('colorScheme');
            }
        },
        features : function(){
            return [
                controller.openBox,
                controller.chooseScheme
            ];
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
        chooseScheme: function(){
            customColorSelect.addEventListener('change',function(){
                localStorage.setItem('colorScheme', customColorSelect.value);
                console.log(customColorSelect.value);
            },false);
        },
        chooseFeatures: function(){
            model.features().forEach(function(el){
                el && el();
            });
        },
        render: function(){
            view.render();
        }
    };

    var view = {
        init: function(){
            function addToCustomBox(arr) {
                arr.forEach(function(elem){
                    customBox.appendChild(elem);
                });
            }
            addToCustomBox([
                customTrigger,
                customColorSelect
            ]);
            controller.chooseFeatures();
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
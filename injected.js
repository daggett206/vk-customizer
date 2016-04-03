;(function(){

    var html = htmlNode,
        doc = document,
        body = doc.body,
        topVkMenu = doc.querySelector('#top_support_link');
    var lightTrigger = addElement('a', 'lightTrigger top_profile_mrow', function(elem){
            elem.textContent = "Кастомизация";
            elem.setAttribute("accesskey", "p");
        }),
        lightClose = addElement('a', 'lightClose'),
        lightContainer = addElement('div','lightContainer'),
        lightPopup = addElement('div','lightPopup');
    var colorBlock = addElement('div', 'lightColorContainer'),
        colorLabel = addElement('label', 'lightColorLabel', function(elem){
            elem.setAttribute("for", "lightColorSelect");
            elem.textContent = "Цветовая схема"
        }),
        colorSelect = addElement("select", "lightColorSelect", function(elem){
            var optionNames = ["Выберите схему:","Dracula", "Ariel", "Pinki"];
            var options = function(){
                var arr = [];
                for (var i=0;i<optionNames.length;i++){
                    arr.push(addElement("option", "lightColorOption"));
                }
                return arr;
            };
            elem.setAttribute("id", "customColorSelect");
            options().forEach(function(item, index){
                if(index == 0){
                    item.setAttribute("disabled", "disabled");
                    item.setAttribute("selected", "true");
                }
                item.textContent = optionNames[index];
                elem.appendChild(item);
            });
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
                controller.openPopup
            ];
        }
    };


    var controller = {
        injectElements: function(){
            insertAfter(lightTrigger, topVkMenu);
            appending(lightPopup, lightClose);
            appending(lightContainer, lightPopup);
            appending(colorBlock, colorLabel);
            appending(colorBlock, colorSelect);
            appending(lightPopup, colorBlock);
            appending(body, lightContainer);
        },
        chooseFeatures: function(){
            model.features().forEach(function(el){
                el && el();
            });
        },
        openPopup: function(container, arr){
            function openPopup(){
                if (!container.classList.contains("active")) {
                    container.className += " active";
                } else {
                    container.className = container.className.replace(/\bactive\b/,'');
                }
            }
            document.onkeydown = function(evt) {
                evt = evt || window.event;
                if (evt.keyCode == 27) {
                    container.className = container.className.replace(/\bactive\b/,'');
                }
            };
            for(var i=0;i<arr.length;i++){
                (function(){
                    arr[i].addEventListener('click',function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        openPopup();
                    },false);
                })();
            }
        }
    };

    var view = {
        openPopup: function(){
            controller.openPopup(
                lightContainer,
                [
                    lightTrigger,
                    lightClose
                ]
            );
        },
        init: function(){
            controller.injectElements();
            controller.chooseFeatures();
        },
        render: function(){
            view.init();
        }
    };

    view.render();

    function insertAfter(elem, refElem) {
        return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }
    function appending(container, element){
        container.appendChild(element);
    }
    function addElement(tag, className, callback){
        var elem = document.createElement(tag),
            props = {};
        elem.setAttribute("class", className);
        if (callback){
            callback(elem, props);
        }
        return elem;
    }
})();
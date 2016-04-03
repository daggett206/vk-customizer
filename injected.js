;(function(){

    var model = {
        customNames:  ["Выберите схему:","Dracula", "Ariel", "Pinky"],
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
                view.openPopup,
                view.chooseScheme
            ];
        }
    };

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
            var optionNames = model.customNames;
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
        },
        chooseScheme: function(select){
            select.addEventListener('change',function(){
                switch (select.value){
                    case model.customNames[1]:
                        html.removeAttribute('class');
                        html.className += select.value.toLowerCase();
                        break;
                    case model.customNames[2]:
                        html.removeAttribute('class');
                        html.className += select.value.toLowerCase();
                        break;
                    case model.customNames[3]:
                        html.removeAttribute('class');
                        html.className += select.value.toLowerCase();
                        break;
                    default:
                        console.log('controller.chooseScheme has crashed');
                }
                localStorage.setItem('colorScheme', select.value);
            },false);
            select.value = model.user_data.colorScheme() || model.customNames[0];
        },
        start: function(){
            if (localStorage.getItem('colorScheme') !== '') {
                html.className += localStorage.getItem('colorScheme').toLowerCase();
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
        chooseScheme: function(){
            controller.chooseScheme(colorSelect);
        },
        init: function(){
            controller.injectElements();
            controller.chooseFeatures();
            controller.start();
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
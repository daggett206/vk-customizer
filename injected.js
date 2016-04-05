;(function(){

    /**
     * MODEL
     * */
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

    /**
     * ORIGIN VARIABLES
     * */
    var doc = document,
        html = doc.documentElement,
        body = doc.body,
        topVkMenu = doc.querySelector('#top_support_link');

    /**
     * ORIGIN POPUP VARIABLES
     * */
    var lightTrigger = new AddElement('a', 'lightTrigger top_profile_mrow', function(elem){
            elem.textContent = "Кастомизация";
            elem.setAttribute("accesskey", "q");
        }),
        lightClose = new AddElement('a', 'lightClose'),
        lightContainer = new AddElement('div','lightContainer'),
        lightPopup = new AddElement('div','lightPopup'),
        lightHeading = new AddElement('h3', 'lightHeading', function(elem){
            elem.textContent = "Кастомизация";
        }),
        lightBlock = new AddElement('div', 'lightBlock');

    /**
     * COLOR SCHEME BLOCK
     * */
    var colorLabel = new AddElement('label', 'lightColorLabel', function(elem){
            elem.setAttribute("for", "lightColorSelect");
            elem.textContent = "Цветовая схема"
        }),
        colorSelect = new AddElement("select", "lightColorSelect", function(elem){
            var optionNames = model.customNames;
            var options = function(){
                var arr = [];
                for (var i=0;i<optionNames.length;i++){
                    arr.push(new AddElement("option", "lightColorOption"));
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

    /**
     * REMOVE ADS BLOCK
     * */


    /**
     * VIRTUAL DOM
     * */
    var virtualDOM = {
        root: {
            block: lightContainer,
            content: [
                {
                    block: lightPopup,
                    content: [
                        {
                            block: lightHeading
                        },
                        {
                            block: lightBlock,
                            content: [
                                {
                                    block: colorLabel
                                },
                                {
                                    block: colorSelect
                                }
                            ]
                        },
                        {
                            block: lightClose
                        },
                        {
                            block: lightBlock
                        }
                    ]
                }
            ]
        }
    };

    /**
     * CONTROLLER
     * */
    var controller = {
        injectElements: function(){
            insertAfter(lightTrigger, topVkMenu);
        },
        initVirtualDom: function(tree){
            var queue = [tree.root];
            while(queue.length) {
                var node = queue.shift();
                if (node.content){
                    for(var i = 0; i < node.content.length; i++) {
                        queue.push(node.content[i]);
                        appending(node.block, node.content[i].block);
                        console.log(i,node.block, node.content[i], queue[i].block);
                    }
                }
            }
            appending(body, tree.root.block);
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
                    container.className = container.className.replace(/\b active\b/,'');
                }
            }
            document.onkeydown = function(evt) {
                evt = evt || window.event;
                if (evt.keyCode == 27) {
                    container.className = container.className.replace(/\b active\b/,'');
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

    /**
     * VIEW
     * */
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
            controller.initVirtualDom(virtualDOM);
            controller.chooseFeatures();
            controller.start();
        },
        render: function(){
            view.init();
        }
    };

    view.render();

    /**
     * SUPPORT FUNCTIONS
     * */
    function insertAfter(elem, refElem) {
        return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
    }
    function appending(container, element){
        container.appendChild(element);
    }
    function AddElement(tag, className, callback){
        this.elem = document.createElement(tag);
        this.elem.setAttribute("class", className);
        if (callback){
            callback(this.elem);
        }
        return this.elem;
    }



})();
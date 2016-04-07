;(function(){

    /**
     * MODEL
     * */
    var model = {
        customNames:  ["Выберите схему:","Dracula", "Ariel", "Pinky", "Dafault"],
        user_data: {
            bgColor: function(){
                return localStorage.getItem('bgColor')
            },
            colorScheme: function(){
                return localStorage.getItem('colorScheme');
            },
            ads: function(){
                return localStorage.getItem('adsOff');
            }
        },
        features : function(){
            return [
                view.openPopup,
                view.chooseScheme,
                view.removeAds
            ];
        }
    };

    /**
     * ORIGIN VARIABLES
     * */
    var doc = document,
        html = doc.documentElement,
        body = doc.body,
        topVkMenu = doc.querySelector('#top_support_link'),
        vkAds = doc.querySelector('#ads_left');

    /**
     * VARIABLES FOR EXTENDS
     * */
    var extendLabel = new AddElement('label','customLabel'),
        extendBlock = new AddElement('div', 'customBlock'),
        extendCheckbox = new AddElement('input', 'customCheckBox', function(elem){
            elem.setAttribute('type', 'checkbox');
        });

    /**
     * ORIGIN POPUP VARIABLES
     * */
    var customTrigger = new AddElement('a', 'customTrigger top_profile_mrow', function(elem){
            elem.textContent = "Кастомизация";
            elem.setAttribute("accesskey", "q");
        }),
        customClose = new AddElement('a', 'customClose'),
        customContainer = new AddElement('div','customContainer'),
        customPopup = new AddElement('div','customPopup'),
        customHeading = new AddElement('h3', 'customHeading', function(elem){
            elem.textContent = "Кастомизация";
        });

    /**
     * COLOR SCHEME BLOCK
     * */
    var colorBlock = cloneElement(extendBlock, 'customColorBlock'),
        colorLabel = cloneElement(extendLabel, 'customColorLabel', 'Цветовая схема',function(elem){
            elem.setAttribute('for', 'customColorSelect');
        }),
        colorSelect = new AddElement("select", "customColorSelect", function(elem){
            var optionNames = model.customNames;
            var options = function(){
                var arr = [];
                for (var i=0;i<optionNames.length;i++){
                    arr.push(new AddElement("option", "customColorOption"));
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
    var adsBlock = cloneElement(extendBlock, 'customAdsBlock'),
        adsLabel = cloneElement(extendLabel, 'customAdsLabel', 'Скрыть рекламу',function(elem){
            elem.setAttribute('for', 'customAdsCheckbox');
        }),
        adsCheckbox = cloneElement(extendCheckbox, 'customAdsCheckbox');

    /**
     * VIRTUAL DOM
     * */
    var virtualDOM = {
        root: {
            block: customContainer,
            content: [
                {
                    block: customPopup,
                    content: [
                        {
                            block: customClose
                        },
                        {
                            block: customHeading
                        },
                        {
                            block: colorBlock,
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
                            block: adsBlock,
                            content: [
                                {
                                    block: adsCheckbox
                                },
                                {
                                    block: adsLabel
                                }
                            ]
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
            insertAfter(customTrigger, topVkMenu);
        },
        initVirtualDom: function(tree){
            var queue = [tree.root];
            while(queue.length) {
                var node = queue.shift();
                if (node.content){
                    for(var i = 0; i < node.content.length; i++) {
                        queue.push(node.content[i]);
                        appending(node.block, node.content[i].block);
                        //console.log(i,node.block, node.content[i], queue[i].block);
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
                if (model.customNames.indexOf(select.value) != -1){
                    html.removeAttribute('class');
                    html.className += 'custom ' + select.value.toLowerCase();
                }
                localStorage.setItem('colorScheme', select.value);
            },false);
            select.value = model.user_data.colorScheme() || model.customNames[0];
        },
        removeAds: function(){
            function showOrHide(bool){
                bool ? localStorage.setItem('adsOff','true') : localStorage.removeItem('adsOff');
                model.user_data.ads() == 'true' ? vkAds.className += "customHide" : vkAds.removeAttribute('class');
            }
            adsCheckbox.addEventListener('change',function(){
                adsCheckbox.checked ? showOrHide(true) : showOrHide(false);
            });
        },

        start: function(){
            if (model.user_data.colorScheme() !== '') {
                html.className += 'custom ' + localStorage.getItem('colorScheme').toLowerCase();
            }
            if (model.user_data.ads()){
                adsCheckbox.checked = true;
                vkAds.className += "customHide";
            }

            var KeyCombination = function(charCode) {
                var self = this;
                self.keys = [];
                document.addEventListener("keydown",function(e){

                    if (self.keys.indexOf(e.which)<0){
                        self.keys.push(e.which);
                    }
                    if (self.keys[0] == 16 && self.keys[1] == charCode){
                        e.preventDefault();
                        console.log('SHIFT & ' + charCode);
                    }
                });
                document.addEventListener("keyup",function(e){
                    self.keys.splice(self.keys.indexOf(e.which),1);
                });
            };

            function showKeyCode(){
                var code = prompt().charCodeAt(0);
                alert(code-32);
            }
            showKeyCode();
            new KeyCombination('w');
        }
    };

    /**
     * VIEW
     * */
    var view = {
        openPopup: function(){
            controller.openPopup(
                customContainer,
                [
                    customTrigger,
                    customClose
                ]
            );
        },
        chooseScheme: function(){
            controller.chooseScheme(colorSelect);
        },
        removeAds: function(){
            controller.removeAds();
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
    function cloneElement(reference, className, text, callback){
        var elem = reference.cloneNode();
        className = className || '';
        elem.className += ' ' + className;
        text = text || null;
        if (text) {
            elem.textContent = text;
        }
        callback && callback(elem);
        return elem;
    }

})();
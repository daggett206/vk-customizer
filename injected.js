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
     * VARIABLES FOR EXTENDING
     * */
    var extendLabel = addElement('label','customLabel'),
        extendBlock = addElement('div', 'customBlock'),
        extendOption = addElement("option", "customOption"),
        extendCheckbox = addElement('input', 'customCheckBox', function(elem){
            elem.setAttribute('type', 'checkbox');
        });

    /**
     * ORIGIN POPUP VARIABLES
     * */
    var customTrigger = addElement('a', 'customTrigger top_profile_mrow', function(elem){
            elem.textContent = "Кастомизация";
            elem.setAttribute("accesskey", "q");
        }),
        customClose = addElement('a', 'customClose'),
        customContainer = addElement('div','customContainer'),
        customPopup = addElement('div','customPopup'),
        customHeading = addElement('h3', 'customHeading', function(elem){
            elem.textContent = "Кастомизация";
        });

    /**
     * COLOR SCHEME BLOCK
     * */
    var colorBlock = cloneElement(extendBlock, 'customColorBlock'),
        colorLabel = cloneElement(extendLabel, 'customColorLabel', 'Цветовая схема',function(elem){
            elem.setAttribute('for', 'customColorSelect');
        }),
        colorSelect = addElement("select", "customColorSelect", function(elem){
            var optionNames = model.customNames;
            var options = function(){
                var arr = [];
                for (var i=0,j=optionNames.length;i<j;i++){
                    arr.push(cloneElement(extendOption, "customColorOption"));
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
        adsCheckbox = cloneElement(extendCheckbox, 'customAdsCheckBox');

    /**
     * VIRTUAL DOM
     * */
    var virtualDOM = {
        root: {
            block: {
                tag: 'div',
                className: 'customContainer'
            },
            content: [
                {
                    block: {
                        tag: 'div',
                        className: 'customPopup'
                    },
                    content: [
                        {
                            block: {
                                tag: 'a',
                                className: 'customClose'
                            }
                        },
                        {
                            block: {
                                tag: 'h3',
                                className: 'customHeading',
                                text: 'Кастомизация'
                            }
                        },
                        {
                            block: {
                                tag: 'div',
                                className: 'customBlock customColorBlock'
                            },
                            content: [
                                {
                                    block: {
                                        tag: 'label',
                                        className: 'customBlock customColorBlock',
                                        text: 'Цветовая схема',
                                        attr: {
                                            for: 'customColorSelect'
                                        }
                                    }
                                },
                                {
                                    block: {
                                        tag: 'select',
                                        className: 'customSelect customColorSelect',
                                        attr: {
                                            id: 'customColorSelect'
                                        }
                                    },
                                    content: [
                                        {
                                            block:{
                                                repeat: model.customNames,
                                                tag: 'option',
                                                className: 'customOption customColorOption'
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            block: {
                                tag: 'div',
                                className:'customBlock adsBlock'
                            },
                            content: [
                                {
                                    block: {
                                        tag: 'input',
                                        className: 'customAdsCheckBox',
                                        attr: {
                                            id: 'customAdsCheckBox',
                                            type: 'checkbox'
                                        }
                                    }
                                },
                                {
                                    block: {
                                        tag: 'label',
                                        className: 'customLabel customAdsLabel',
                                        attr: {
                                            for : 'customColorCheckBox'
                                        }
                                    }
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
        parseDom: function(obj){
            if (obj.block){
                var _block = obj.block;
                function getNode(bool) {
                    var node = doc.createElement(_block.tag);
                    node.className += _block.className || '';
                    if (_block.attr){
                        for(var key in _block.attr){
                            node.setAttribute(key, _block.attr[key]);
                        }
                    }
                    node.textContent = _block.text || null;
                    if(bool){
                        var _clones = [];
                        _block.repeat.map(function(el,i){
                            var __clone = node.cloneNode();
                            if(i == 0){
                                __clone.setAttribute("disabled", "disabled");
                                __clone.setAttribute("selected", "true");
                            }
                            __clone.textContent = el[i] || null;
                            _clones.push(__clone);
                        });
                        return _clones;
                    }else{
                        return node;
                    }
                }
                if (_block.repeat){
                    getNode(true);
                } else {
                    getNode();
                }
            }
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
    function addElement(tag, className, callback){
        var elem = document.createElement(tag);
        elem.setAttribute("class", className);
        if (callback){
            callback(elem);
        }
        return elem;
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
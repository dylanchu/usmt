/* jshint esversion: 6 */
document.title = 'story map';
const cardWidth = 170;
variables = new Vue({
    el: '#variables',
    data: {
        prjName: '',
    },
    watch: {
        prjName: (newValue) => {  // 设置title
            document.title = newValue + ' story map';
        }
    },
});
Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
            // here I check that click was outside the el and his childrens
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.clickOutsideEvent);
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.clickOutsideEvent);
    }
});
vm1 = new Vue({
    el: '#app1',
    data: {
        // 若要在methods中访问，不可以_开头？
        layouts: [
           // don't put any code here
           // use addCard() if you want to add your layout
        ],
        statesMenu:["Todo", "Ready", "Doing", "Done"],
        unique_id: 0,  // 不要随意手动设置它
        colNum: screen.width/cardWidth,
        widthData: screen.width,
        cardHeight: 105,
        cardMarginBasic: [10, 4],  // default is 10
        denoteTextHeightRelease: 12,
        activityDividers: [],
        temp_cards_state_list_opened: [],
    },
    watch: {
        colNum: function(newValue){  // 保证卡片宽度视觉上不变
            this.widthData = cardWidth*newValue;
        },
    },
    computed:{
        cardMarginRelease() {
            return [this.cardMarginBasic[0], this.denoteTextHeightRelease*2];
        },  // y: 2*(height of denote text)
        layoutDenoteHeightBasic() {return 0;},
        layoutDenoteHeightRelease() {return this.cardMarginBasic[1];},
        layoutHeightBasic() {return this.cardHeight;},
        layoutHeightRelease() {
            return this.cardHeight+this.layoutDenoteHeightRelease-this.cardMarginRelease[1];
        },
        displayDenote(){
            return function(value){
                let index=Number(value)-Number(1);
                return value>1 ? "- Release"+index:"";
            };
        },
        displayCardState(){
            return function(value){
                if(Number(value)>1){
                   return "Todo";
                }
            };
        }
    },
    methods: {
        // 需要引用this的时候不要用lambda函数，否则this会是调用者window！！
        addCard: function(layout_index, card) {  // pass in: co.i, card
            // console.log(card);
            _item = {};
            // 强制设置卡片宽高为1,1;并分配unique_id:
                // 成员"i"是item的唯一标识，相同值会导致拖拽有bug.
            if (layout_index>1 && !(card.state)) {
                Object.assign(_item, card, {"w":1,"h":1,"state":"Todo","i":this.unique_id++});
            } else {
                Object.assign(_item, card, {"w":1,"h":1,"i":this.unique_id++});
            }
            while (this.layouts.length < Number(layout_index) + 1) {
                // console.log(this.layouts.length, Number(layout_index) + 1)
                this.layouts.push([]);
            }
            this.layouts[layout_index].push(_item);
            if (this.colNum < _item.x) {
                this.colNum = _item.x + 1;
            }
            setTimeout(this.validatePositions, 300);
        },
        compactColumns: function() {
            /** method1, the best way **/
            let maxX = 0;
            let toRemove = new Array(Math.floor(this.colNum)).fill(true);
            for (let l of this.layouts) {
                for (let c of l) {
                    toRemove[c.x] = false;
                    if (c.x>maxX) {maxX=c.x;}
                }
            }
            // console.log("toRemove:"+toRemove);
            for (let i=0; i<toRemove.length; i++) {
                while (toRemove[i] != true && i<toRemove.length) {i++;}
                if (i>=toRemove.length) {break;}
                // console.log('i = '+i);
                let j = i+1;
                while (toRemove[j] != false && j<toRemove.length) {j++;}
                if (j<toRemove.length) {
                    this.shiftCardsOnRight(i, i-j);
                }
                // console.log('j = '+j);
                toRemove.splice(i, j-i);
                // console.log('shift cards right of '+i);
                // console.log('shift distance '+ (i-j));
            }
            maxX = toRemove.length;  // 剩余不用移除的列数
            let minCol = Math.ceil(screen.width/cardWidth);
            this.colNum = maxX>minCol?maxX:minCol;
            setTimeout(this.updateDividers, 300);
        },
        coordinates: (card) => {
            /* card为原生dom对象，返回卡片的: i(layouts index), x, y, 均从0开始 */
            let cardLevel = card.className.match(/.*card-level(\d+)/)[1];
            let x_y = card.getElementsByClassName('x_y')[0].textContent.split('_');
            return {"i": parseInt(cardLevel)-1, "x": parseInt(x_y[0]), "y": parseInt(x_y[1])};
        },
        hasCard: function(i, x, y) {
            if (i < this.layouts.length) {
                for (let c of this.layouts[i]) {
                    if (c.x == x && c.y == y) return true;
                }
            }
            return false;
        },
        shiftCardsOnRight: function(x, delta) {
            for (let i in this.layouts) {
                for (let o of this.layouts[i]) {
                    if (o.x > x) {
                        o.x += delta;
                    }
                }
            }
            this.colNum = Math.ceil(this.colNum + delta);
        },
        sortLayoutBy: function(layout, priority) {
            if (!Array.isArray(layout)){
                console.error('layout to sort must be array');
            }
            // console.log('before sort');
            // for (l of layout) {console.log(l.x + ' ' + l.y + ' ' + l.i)};
            if (priority == 'xy') {
                layout.sort((m1, m2) => {return m1.y - m2.y;});
                layout.sort((m1, m2) => {return m1.x - m2.x;});
            } else if (priority == 'yx') {
                layout.sort((m1, m2) => {return m1.x - m2.x;});
                layout.sort((m1, m2) => {return m1.y - m2.y;});
            }
            // console.log('\nafter sort');
            // for (l of layout) {console.log(l.x + ' ' + l.y + ' ' + l.i)};
        },
        loadLayouts: function(yourLayouts) {
            for (let i in yourLayouts) {
                // this.sortLayoutBy(yourLayouts[i], 'yx');
                for (let item of yourLayouts[i]) {
                    // console.log(item);
                    this.addCard(i, item);
                }
            }
        },
        reloadLayouts: function(yourLayouts) {
            this.layouts = [];
            this.loadLayouts(yourLayouts);
        },
        removeCard: function(event) {  // name 'delete' wont work, maybe conflicts
            let card = event.target.parentElement.parentElement;
            let co = this.coordinates(card);
            if (co.i <= 1 && this.layouts[co.i].length === 1) {
                alert('activities和tasks的最后一张卡片不能删除');
                return;
            }
            for (let c of this.layouts[co.i]) {
                if (c.x == co.x && c.y == co.y) {
                    this.layouts[co.i].splice(this.layouts[co.i].indexOf(c), 1);  // grid库渲染可能有bug，不能直接这样操作
                                                                            // 暂时如此，后面尝试先序列化然后reload数据
                    break;
                }
            }
            this.compactColumns();
            setTimeout(this.validatePositions, 300);
            if (this.layouts[co.i].length === 0) {
                this.layouts.splice(co.i, 1);
            }
        },
        addCardRight: function(event) {
            let card = event.target.parentElement.parentElement;
            let co = this.coordinates(card);
            let item = "";
            if (co.i === 1) {
                this.shiftCardsOnRight(co.x, 1);
            }
            let allX = [];
            for (let c of this.layouts[co.i]) {
                if (c.y===co.y) {
                    allX.push(c.x);
                }
            }
            let aimX = 0;
            for (let k=co.x+1; k<=this.colNum; k++) {
                if (allX.indexOf(k)===-1) {
                    aimX = k;
                    break;
                }
            }
            if (aimX) {
                item = {"x":aimX,"y":co.y,"text":""};
                this.addCard(co.i, item);
                this.cardMoved();
            }
            // console.log(item.x, item.y);
        },
        addCardBottom: function(event) {
            let card = event.target.parentElement.parentElement;
            let co = this.coordinates(card);
            let target = co.i;
            let item = {"x":co.x,"y":co.y+1,"text":""};
            if (co.i == 0) {  // 点击了第1层卡片
                // console.log('第二层有卡片? ' + this.hasCard(co.i+1,co.x,co.y));
                item.y = 0;  // 添加到第1行
                if (this.hasCard(1, co.x, co.y)) {  // 添加到层3
                    target = 2;
                } else {  // 添加到2层
                    target = 1;
                }
            }
            if (co.i == 1) {  // 点击了第2层卡片，直接添加到层3行1
                target = 2;
                item.y = 0;
            }
            this.addCard(target, item);
        },
        editText: function(event) {
            let card = event.target.parentElement.parentElement;
            let co = this.coordinates(card);
            layer.prompt({
                formType: 2,
                shadeClose: true,  // 点击遮罩关闭层
                title: '请输入内容',
                value: $(card).find('.text')[0].textContent,  // 文本默认值
                area: ['500px', '220px'],  // 弹出层大小
                btn: ['保存', '取消'],
                btn1: function(index, elem){
                    layer.close(index);
                },
                btnAlign: 'c',
                }, (value, index) => {
                    if (value) {
                        for (let c of this.layouts[co.i]) {
                            if (c.x===co.x&&c.y===co.y) {
                                c.text = value;
                                break;
                            }
                        }
                    }
                    layer.close(index);
            });
        },
        addReleases:function(event){
            let item = {"x":0,"y":0,"text":""};
            this.addCard(this.layouts.length, item);
            this.cardMoved();
        },
        dividerHeight: function(level) {
            let a=document.getElementsByClassName('layout-level'+(level))[0];
            // console.log(a);
            if (a) {
                // console.log(a.clientHeight);
                return a.clientHeight;
            } else {
                return 0;
            }
        },
        updateDividers: function() {
            // console.log('gonna update the lines');
            dividers = [];
            let cards=document.getElementsByClassName('card-level1');
            for (let c of cards) {
                let x = c.style.transform.match(/translate3d\(([0-9]+)px,/)[1];
                dividers.push({"x":Math.ceil(x-this.cardMarginBasic[0]/2),"y":0});
            }
            this.activityDividers = dividers;
        },
        validatePositions: function() {
            let illegal = 'card-illegal';  // illegal class name
            cards = document.getElementsByClassName('card');
            let fathers = [];  // dont ask me why not called mothers
            for (let c of cards) {
                let co = this.coordinates(c);
                if (co.i<2) {
                    if (co.y > 0) {c.classList.add(illegal);}
                    else if (c.classList.contains(illegal)) {
                        c.classList.remove(illegal);
                    }
                    if (co.i === 1) {fathers.push(co.x);}
                } else {
                    if (fathers.indexOf(co.x) === -1) {
                        c.classList.add(illegal);
                    } else {
                        c.classList.remove(illegal);
                    }
                }
                // console.log(c.className);
            }
        },
        cardMoved: function() {
            // setTimeout(this.updateDividers, 100);  //延时等待页面渲染完成
            setTimeout(this.compactColumns, 100);
            setTimeout(this.validatePositions, 300);
        },
        toggleCardStatesMenu:function(event) {
            let card = event.target.parentElement.parentElement;
            let el=card.getElementsByClassName('state-basic')[0];
            let dropdown=card.getElementsByClassName('state-selection-menu')[0];
            if (dropdown.style.display != "block") {
                dropdown.style.display="block";
                let liarr=dropdown.getElementsByTagName("li");
                for(let i=0;i<liarr.length;i++){
                    let selected = 'state-text-current';
                    if(liarr[i].innerText==el.innerText){
                        liarr[i].classList.add(selected);
                    } else if (liarr[i].classList.contains(selected)) {
                        liarr[i].classList.remove(selected);
                    }
                }
                this.temp_cards_state_list_opened.push(card);
            } else {
                dropdown.style.display="none";
                this.temp_cards_state_list_opened.splice(this.temp_cards_state_list_opened.indexOf(card),1);
            }
        },
        selectCardState:function(event){  // event.target is li
            let stateSelectedEl=event.target;
            let cardControls = event.target.parentElement.parentElement;
            let co = this.coordinates(cardControls.parentElement);
            for (let c of this.layouts[co.i]) {
                if (c.x===co.x&&c.y===co.y) {
                    c.state = stateSelectedEl.innerText;
                    let stateEl=cardControls.getElementsByClassName('state-basic')[0];
                    // console.log(stateEl.className);
                    stateEl.className='state-basic state-'+c.state;
                    // console.log(stateEl.className);
                    this.toggleCardStatesMenu(event);
                    break;
                }
            }
        },
        closeCardStatesMenu:function(event){
            // console.log(this.temp_cards_state_list_opened);  // 点击一次有多次输出？
            while (this.temp_cards_state_list_opened.length) {
                let card = this.temp_cards_state_list_opened.pop();
                let dropdown=card.getElementsByClassName('state-selection-menu')[0];
                if (dropdown) {
                    dropdown.style.display='none';
                }
            }
        }
    }
});

title_app = new Vue({
    el: '#title',
    data: {
        mapName:  "story map",
        mylayouts: [
            [
                {"x":0,"y":0,"state":"","text":"组织邮件"},  // 去掉w,h,i,moved
                {"x":4,"y":0,"state":"","text":"管理联系人"},
                {"x":2,"y":0,"text":"管理邮件"}
            ],
            [
                {"x":0,"y":0,"state":"","text":"搜索"},
                {"x":1,"y":0,"state":"","text":"归档"},
                {"x":4,"y":0,"state":"","text":"创建"},
                {"x":5,"y":0,"state":"","text":"更新\n"},
                {"x":6,"y":0,"text":"删除"},
                {"x":2,"y":0,"text":"编辑并发送"},
                {"x":3,"y":0,"text":""}
            ],
            [
                {"x":0,"y":0,"state":"Done","text":"按关键词搜索"},
                {"x":1,"y":1,"state":"Doing","text":"创建子文件夹"},
                {"x":1,"y":0,"state":"Todo","text":"移动"},
                {"x":4,"y":0,"text":"基础创建功能","state":"Todo"},
                {"x":5,"y":0,"text":"","state":"Todo"},
                {"x":2,"y":0,"text":"文本邮件","state":"Todo"}
            ],
            [
                {"x":0,"y":0,"text":"按单字段搜索","state":"Todo"},
                {"x":0,"y":1,"text":"按多字段搜索","state":"Todo"},
                {"x":4,"y":0,"text":"杂七杂八的创建功能\n杂七杂八的创建功能\n杂七杂八的创建功能\n杂七杂八的创建功能","state":"Todo"},
                {"x":2,"y":0,"text":"HTML邮件","state":"Todo"}
            ]
        ],
        isRotating: "",
    },
    methods: {
        reload: function() {
            this.isRotating = " fa-spin";
            smId = getQueryString('sm');
            console.log('map id:', smId);
            if (smId != null) {
                data = loadMap(smId);
            } else {
                alert('无效请求');
                window.location.replace('/');
            }
            vm1.updateDividers();
            setTimeout(()=>{this.isRotating = "";}, 300);
        },
        saveCurrentLayout: function() {
            smId = getQueryString('sm');
            saveMap(smId, vm1.layouts);
        }
    }
});

function parseDom(arg) {
    let objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
}

function getQueryString(name) {  // 获取url参数
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function loadMap(id) {
    $.ajax({
        // url: 'jsondata.ashx',
        url : "/api/get-map?sm="+id,
        type: 'GET',
        dataType: 'json',
        timeout: 5000,
        cache: false,
        success : function(data){
            // console.log(typeof(data));  //already converted to object
            if (data.code == 0){
                map_data = data.sm.data;
                document.title = data.sm.name;  // 设置标题
                title_app.mapName = data.sm.name;  // 设置标题
                vm1.reloadLayouts(map_data);
            } else {
                alert(data.msg);
                if (data.code == 1) {
                    window.location.replace('/auth/login');
                } else {
                    window.location.replace('/');
                }
            }
        },
        error:function(data){
            alert(data);
        }
    });
}

function saveMap(id, mapLayout) {
    let mapData = [];
    for (let layer of mapLayout) {
        let temp_layer = []
        for (let c of layer) {
            temp_layer.push({"x":c.x, "y":c.y, "state":c.state, "text":c.text});
        }
        mapData.push(temp_layer);
    }
    $.ajax({
        url: "/api/save-map?sm="+id,
        type: 'POST',
        data: "mapLayout="+JSON.stringify(mapData),
        dataType: 'json',
        timeout: 5000,
        cache: false,
        success : function(data){
            // console.log(typeof(data));  //already converted to object
            if (data.code == 0){
                console.log("map saved.");
                alert("保存成功");
            } else {
                alert("保存失败："+data.msg);
            }
        },
        error:function(data){
            alert(data);
        }
    });
}

window.onload = () => {
    smId = getQueryString('sm');
    console.log('map id:', smId);
    if (smId != null) {
        data = loadMap(smId);
    } else {
        alert('无效请求');
        window.location.replace('/');
    }
    vm1.updateDividers();
    setTimeout(vm1.validatePositions, 500);
};

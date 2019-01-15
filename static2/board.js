/* jshint esversion: 6 */
document.title = 'story map';
const cardWidth = 200;
variables = new Vue({
    el: '#variables',
    data: {
        prjName: '',
        cardMargin: [22, 22],  // default is 10
        layoutHeight: 140,
    },
    watch: {
        prjName: (newValue) => {  // 设置title
            document.title = newValue + ' story map';
        }
    },
});

vm1 = new Vue({
    el: '#app1',
    data: {
        // 若要在methods中访问，不可以_开头？
        layouts: [
           // don't put any code here
           // use addCard() if you want to add your layout
        ],
        unique_id: 0,  // 不要随意手动设置它
        colNum: screen.width/cardWidth,
        widthData: screen.width + 'px',
        activityDividers: [
            // {"x":224, "y":0},
        ],
    },
    watch: {
        colNum: function(newValue){  // 保证卡片宽度视觉上不变
            this.widthData = cardWidth*newValue + 'px';
        },
    },
    computed:{
        displayDenote(){
            return function(value){
                let index=Number(value)-Number(1);
                return value>1 ? "-Release"+index:"";
            }
        },
        displayCardState(){
            return function(value){
                if(Number(value)>1){
                   return "Todo";
                }
            }
        }
    },
    methods: {
        // 需要引用this的时候不要用lambda函数，否则this会是调用者window！！
        addCard: function(layout_index, card) {  // pass in: co.i, card
            // console.log(card);
            _item = {};
            // 强制设置卡片宽高为1,1;并分配unique_id:
                // 成员"i"是item的唯一标识，相同值会导致拖拽有bug.
            Object.assign(_item, card, {"w":1,"h":1,"i":this.unique_id++});
            while (this.layouts.length < Number(layout_index) + 1) {
                // console.log(this.layouts.length, Number(layout_index) + 1)
                this.layouts.push([]);
            }
            this.layouts[layout_index].push(_item);
            if (this.colNum < _item.x) {
                this.colNum = _item.x + 1;
            }
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
            console.log("toRemoce:"+toRemove);
            for (let i=0; i<toRemove.length; i++) {
                while (toRemove[i] != true && i<toRemove.length) {i++;}
                if (i>=toRemove.length) {break;}
                // console.log('i = '+i);
                let j = i+1;
                while (toRemove[j] != false && j<toRemove.length) {j++;}
                if (j>=toRemove.length) {break;}
                // console.log('j = '+j);
                this.shiftCardsOnRight(i, i-j);
                toRemove.splice(i, j-i);
                // console.log('shift cards right of '+i);
                // console.log('shift distance '+ (i-j));
            }
            maxX -= toRemove.length;
            let minCol = Math.ceil(screen.width/cardWidth);
            this.colNum = maxX>minCol?maxX:minCol;
            this.cardMoved();

            /** method2 **/
            // let maxX = 0;
            // colsToRemove = [];
            // for (let i=0; i<toRemove.length; i++) {
            //     if (toRemove[i]) {
            //         colsToRemove.push(i);
            //     }
            // }
            // colsToRemove.reverse();
            // for (let i of colsToRemove) {  // shift
            //     for (let l of this.layouts) {
            //         for (let c of l) {
            //             if (c.x > i) {c.x--;}
            //         }
            //     }
            // }
            // maxX -= colsToRemove.length;
            // let minCol = Math.ceil(screen.width/cardWidth);
            // this.colNum = maxX>minCol?maxX:minCol;

            /** method3 **/
            // let maxX = 0;
            // let minCol = Math.ceil(screen.width/cardWidth);
            // for (let i=0; i<this.colNum; i++){
            //     let remove = true;
            //     for (let l of this.layouts) {
            //         for (let c of l) {
            //             if (c.x == i) {remove=false;}
            //         }
            //     }
            //     if (remove === true) {
            //         for (let l of this.layouts) {
            //             for (let c of l) {
            //                 if (c.x > i) {c.x--;}
            //             }
            //         }
            //         this.colNum--;
            //         i--;  // keep i unchanged in next round
            //     }
            // }
            // if (this.colNum<minCol) {this.colNum=minCol;}
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
            // console.log('x,y,i');
            // for (l of layout) {console.log(l.x + ' ' + l.y + ' ' + l.i)};
            if (priority == 'xy') {
                layout.sort((m1, m2) => {return m1.y - m2.y;});
                layout.sort((m1, m2) => {return m1.x - m2.x;});
            } else if (priority == 'yx') {
                layout.sort((m1, m2) => {return m1.x - m2.x;});
                layout.sort((m1, m2) => {return m1.y - m2.y;});
            }
            // console.log('\nafter sort');
            // console.log('x,y,i');
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
            for (let c of this.layouts[co.i]) {
                if (c.x == co.x && c.y == co.y) {
                    this.layouts[co.i].splice(this.layouts[co.i].indexOf(c), 1);  // grid库渲染可能有bug，不能直接这样操作
                                                                            // 暂时如此，后面尝试先序列化然后reload数据
                    break;
                }
            }
            this.compactColumns();
        },
        addCardRight: function(event) {
            let card = event.target.parentElement.parentElement;
            let co = this.coordinates(card);
            this.shiftCardsOnRight(co.x, 1);
            let item = {"x":co.x+1,"y":co.y,"text":""};
            this.addCard(co.i, item);
            this.cardMoved();
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
        editText: (event) => {
            let card = event.target.parentElement.parentElement;
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
                        $(card).find('.text')[0].textContent = value;
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
                dividers.push({"x":Math.ceil(x-variables.cardMargin[0]/2),"y":0});
            }
            this.activityDividers = dividers;
        },
        cardMoved: function() {
            setTimeout(this.updateDividers, 100);  //延时等待页面渲染完成
        }
    }
});

title_app = new Vue({
    el: '#title',
    data: {
        mylayouts: [
            [
                {"x":0,"y":0, "text": "你好"},
                {"x":2,"y":0, "text": "我很抱歉我的朋友"},
            ],
            [
                {"x":0,"y":0},
                {"x":1,"y":0},
                {"x":3,"y":0},
                {"x":9,"y":0},
            ],
            [
                {"x":0,"y":0},
            ],
        ],
        isRotating: "",
    },
    methods: {
        reload: function() {
            this.isRotating = " fa-spin";
            vm1.reloadLayouts(this.mylayouts);
            setTimeout(()=>{this.isRotating = "";}, 300);
        },
    }
});

function parseDom(arg) {
    let objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
}

vm1.loadLayouts(title_app.mylayouts);

window.onload = () => {
    vm1.updateDividers();
};

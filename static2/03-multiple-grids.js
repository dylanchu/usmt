/* jshint esversion: 6 */
document.title = 'story map';
const cardWidth = 200;
variables = new Vue({
    el: '#variables',
    data: {
        prjName: '',
        cardMargin: [6, 6],  // default is 10
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
    },
    watch: {
        colNum: function(newValue){  // 保证卡片宽度视觉上不变
            this.widthData = cardWidth*newValue + 'px';
        },
    },
    methods: {
        // 需要引用this的时候不要用lambda函数，否则this会是调用者window！！
        addCard: function(layout_index, card) {  // pass in: co.i, card
            // console.log(card)
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
        coordinates: (card) => {
            /* card为原生dom对象，返回卡片的: i(layouts index), x, y, 均从0开始 */
            let cardLevel = card.className.match(/.*level(\d+)/)[1];
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
            this.colNum = Math.floor(this.colNum + delta);
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
        remove: function(event) {  // name 'delete' wont work, maybe conflicts
            alert('Delete');
            // this.layout.splice(this.layout.indexOf(item), 1);
        },
        addRight: function(event) {
            let card = event.target.parentElement.parentElement;
            let co = this.coordinates(card);
            this.shiftCardsOnRight(co.x, 1);
            let item = {"x":co.x+1,"y":co.y,"text":""};
            this.addCard(co.i, item);
        },
        addBottom: function(event) {
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
            // alert('Edit');
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
        }
    }
});

title_app = new Vue({
    el: '#title',
    data: {
        mylayouts: [
            [
                {"x":0,"y":0,"w":1,"h":1, "text": "你好"},
                {"x":1,"y":0,"w":1,"h":1, "text": "我很抱歉我的朋友"},
            ],
            [
                {"x":0,"y":0,"w":2,"h":2},
                {"x":2,"y":0,"w":2,"h":2},
                {"x":3,"y":0,"w":1,"h":1},
                {"x":9,"y":0,"w":1,"h":1},
            ],
            [
                {"x":0,"y":0,"w":1,"h":1},
            ],
        ],
    },
    methods: {
        reload: function() {
            vm1.reloadLayouts(this.mylayouts);
        },
    }
});

function parseDom(arg) {
    let objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
}

vm1.loadLayouts(title_app.mylayouts);

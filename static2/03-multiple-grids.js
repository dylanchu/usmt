document.title = 'story map';
const cardWidth = 200;
variables = new Vue({
    el: '#variables',
    data: {
        prjName: '',
        colNum: screen.width/cardWidth,
        widthData: screen.width + 'px',
        cardMargin: [6, 6],  // default is 10
        layoutHeight: 140,
    },
    watch: {
        colNum: function(newValue){  // 保证卡片宽度视觉上不变
            this.widthData = cardWidth*newValue + 'px';
        },
        prjName: (newValue) => {  // 设置title
            document.title = newValue + ' story map';
        }
    },
})

vm1 = new Vue({
    el: '#app1',
    data: {
        layouts: [
            [
                {"x":0,"y":0,"w":1,"h":1,"i":"0"},
                {"x":1,"y":0,"w":1,"h":1,"i":"得劲不老哥"},
            ],
            [
                {"x":0,"y":0,"w":1,"h":1,"i":"0"},
                {"x":2,"y":0,"w":1,"h":1,"i":"1"},
                {"x":3,"y":0,"w":1,"h":1,"i":"2"},
            ],
            [
                {"x":0,"y":0,"w":1,"h":1,"i":"0"},
            ],
        ],
        index: 0,
    },

    methods: {
        sortLayoutByXY: (layout) => {
            if (!Array.isArray(layout)){
                console.error('layout to sort must be array');
            }
            console.log('before sort')
            console.log('x,y,i')
            for (l of layout) {console.log(l.x + ' ' + l.y + ' ' + l.i)}
            layout.sort((m1, m2) => {return m1.y - m2.y})
            layout.sort((m1, m2) => {return m1.x - m2.x})
            console.log('\nafter sort')
            console.log('x,y,i')
            for (l of layout) {console.log(l.x + ' ' + l.y + ' ' + l.i)}
        },
        coordinates: (card) => {
            /* card为原生dom对象，返回卡片的: layout_i, x, y, 均从0开始 */
            let cardLevel = card.className.match(/.*level(\d+)/)[1];
            let x_y = card.getElementsByClassName('x_y')[0].textContent.split('_');
            return {"layout_i": parseInt(cardLevel)-1, "x": parseInt(x_y[0]), "y": parseInt(x_y[1])};
        },
        remove: function(event) {  // 'delete' wont work, maybe conflicts
            alert('Delete');
            // this.layout.splice(this.layout.indexOf(item), 1);
        },
        addRight: function(event) {
            alert('Add Right');
            // var item = {"x":2,"y":0,"w":1,"h":1,"i":"wow"};
            // this.layout.push(item);
        },
        addBottom: function(event) {  // 移动时有bug..
            let card = event.target.parentElement.parentElement;
            coor = this.coordinates(card);
            // alert(coor.level + ' ' + coor.x + ' ' + coor.y)
            // var item = {"x":coor.x,"y":coor.y+1,"w":1,"h":1,"i":"ww"};
            // for (let c of this.layouts[coor.layout_i]) {
            //     if (c.x === item.x){
            //         if (c.y >= item.y) { c.y++ }
            //     }
            // }
            this.layouts[coor.layout_i].push({"x":coor.x,"y":coor.y+1,"w":1,"h":1,"i":""});
            // this.layouts[coor.layout_i].push({"x":1,"y":1,"w":1,"h":1,"i":""});
        },
        addItem: function() {
            var self = this;
            //console.log("### LENGTH: " + this.layout.length);
            var item = {"x":0,"y":0,"w":1,"h":1,"i":this.index+"", whatever: "bbb"};
            this.index++;
            this.layouts[1].push(item);
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
                }, (value, index, elem) => {
                    if (value) {
                        $(card).find('.text')[0].textContent = value;
                    }
                    layer.close(index);
            });
        }
    }
});

function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
};

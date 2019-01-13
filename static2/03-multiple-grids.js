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
        ]
    },

    methods: {
        coordinates: (event) => {
            /* 返回被点击卡片的：level, x, y */
            /* level:从1开始; x,y:从0开始 */
            let card = event.target.parentElement.parentElement;
            let cardLevel = card.className.match(/.*level(\d+)/)[1];
            let x_y = card.getElementsByClassName('x_y')[0].textContent.split('_');
            return {level: cardLevel, x: x_y[0], y:x_y[1]};
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
        addBottom: function(event) {
            coor = this.coordinates(event);
            alert(coor.level + ' ' + coor.x + ' ' + coor.y)
            // var item = {"x":2,"y":0,"w":1,"h":1,"i":"wow"};
            // this.layout.push(item);
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

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
        removeItem: function(item) {
            this.layout.splice(this.layout.indexOf(item), 1);
        },
        addItem: function(item) {
            var item = {"x":2,"y":0,"w":1,"h":1,"i":"wow"};
            this.layout.push(item);
        }
    }
});

function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
};

function card_html(bg, text='') {
    return '<li style="background:' + bg + '"><div>' + card_innerEl(text) + '</div></li>';
};
function setCardControls(x) {
    x.style.background = '#ccc';
    s = '<i class="card-delete fa fa-window-close fa-lg pull-right"></i>' +
    '<i class="card-add-right fa fa-chevron-circle-right fa-lg"></i>' +
    '<i class="card-add-bottom fa fa-chevron-circle-down fa-lg"></i>' +
    '<i class="card-edit fa fa-pencil-square-o fa-2x"></i>';
    x.innerHTML = s;
};
function setAllCardsControls() {
    let a = document.getElementsByName('card-controls');
    a.forEach(function(x){
        setCardControls(x);
    })
};

setAllCardsControls();

for (x of document.getElementsByClassName('card-delete')) {
    x.onclick = function(){alert('Delete');};
}
for (x of document.getElementsByClassName('card-add-right')) {
    x.onclick = function(){alert('Add Right');};
}
for (x of document.getElementsByClassName('card-add-bottom')) {
    let card = x.parentElement.parentElement;
    x.onclick = function(){
        alert('Add Bottom');
    };
}
for (x of document.getElementsByClassName('card-edit')) {
    let card = x.parentElement.parentElement;  // x >> card-controls >> card
    x.onclick = function(){
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
        }, function(value, index, elem){
            if (value) {
                $(card).find('.text')[0].textContent = value;
            }
            layer.close(index);
        });
    };
}
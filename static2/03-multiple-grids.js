let initial_colNum = Math.floor(screen.width/200)
variables = new Vue({
    el: '#variables',
    data: {
        colNum: 6,
        widthData: 200*initial_colNum + 'px',
        cardColors: {'app1': '#aed9e9', 'app2':'#f4e459', 'app3':'#f0f0f0'},
    },
    watch: {
        colNum: function(newValue){
            this.widthData = 200*newValue + 'px'
        }
    },
})

vm1 = new Vue({
    el: '#app1',
    data: {
        layout: [
            {"x":0,"y":0,"w":1,"h":1,"i":"0"},
            {"x":1,"y":0,"w":1,"h":1,"i":"得劲不老哥"},
        ],
        index: 0,
    },

    mounted: function () {
        this.index = this.layout.length;
    },
    methods: {
        increaseWidth: function(item) {
            var width = document.getElementById("content").offsetWidth;
            width += 20;
            document.getElementById("content").style.width = width+"px";
        },
        decreaseWidth: function(item) {

            var width = document.getElementById("content").offsetWidth;
            width -= 20;
            document.getElementById("content").style.width = width+"px";
        },
        removeItem: function(item) {
            //console.log("### REMOVE " + item.i);
            this.layout.splice(this.layout.indexOf(item), 1);
        },
        addItem: function() {
            var self = this;
            //console.log("### LENGTH: " + this.layout.length);
            var item = {"x":2,"y":0,"w":2,"h":2,"i":this.index+"", whatever: "bbb"};
            this.index++;
            this.layout.push(item);
        }
    }
});

vm2 = new Vue({
    el: '#app2',
    data: {
        layout: [
            {"x":0,"y":0,"w":1,"h":1,"i":"0"},
            {"x":2,"y":0,"w":1,"h":1,"i":"1"},
            {"x":3,"y":0,"w":1,"h":1,"i":"2"},
        ],
        index: 0,
    }
});

vm3 = new Vue({
    el: '#app3',
    data: {
        layout: [
            {"x":0,"y":0,"w":1,"h":1,"i":"0"},
        ],
        index: 0,
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
    x.onclick = function(){alert('Add Bottom');};
}
for (x of document.getElementsByClassName('card-edit')) {
    let pencil = x;
    x.onclick = function(){
        layer.prompt({
        formType: 2,
        shadeClose: true, //点击遮罩关闭层
        title: '请输入内容',
        value:'',    // 文本默认值
        area: ['500px', '220px'],     // 设置弹出层大小
        btn: ['保存', '取消'],    // 自定义设置多个按钮
        btn1: function(index, elem){
            layer.close(index);
        },
        btnAlign: 'c',
        }, function(value, index, elem){
            if (value) {
                // pencil >> card-controls >> card
                $(pencil.parentElement.parentElement).find('.text')[0].textContent = value;
            }
            layer.close(index);
        });
    };
}
#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-1-1

from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/cards')
def db_data_stub():
    data = {
        "target": "使用百度搜索新闻",
        "cards": {
            "打开网页": {"打开浏览器": ['找到浏览器图标', '双击浏览器图标'], "输入百度网址": ['点击网址栏', '输出网址'], "按回车键": ''},
            "搜索内容": ['click on input bar', "input key words", '点击"百度一下"']
        }
    }
    return jsonify(data)


if __name__ == '__main__':
    app.run()

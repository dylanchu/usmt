#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-2

from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, widgets
from wtforms.validators import DataRequired


class NewMapForm(FlaskForm):
    name = StringField(label='新建故事地图',
                       validators=[DataRequired(message='名称不能为空')],
                       widget=widgets.TextInput(),
                       render_kw={
                           'class': 'form-control',
                           'placeholder': '请输入新故事地图名称',
                           'required': ''
                       })
    submit = SubmitField('创建新地图')

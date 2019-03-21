#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired,Email,EqualTo


class RegisterForm(FlaskForm):
    #加入表单数据的验证
    email = StringField('邮箱', validators=[DataRequired(),Email('邮箱格式不正确')])
    password = PasswordField('密码', validators=[DataRequired()])
    repeatpassword=PasswordField('确认密码', validators=[DataRequired(),EqualTo('password',message="两次密码输入不一致")])
    name = StringField('用户名', validators=[DataRequired()])
    submit = SubmitField('提交')


class LoginForm(FlaskForm):
    email = StringField('邮箱', validators=[DataRequired(),Email('邮箱格式不正确')])
    password = PasswordField('密码', validators=[DataRequired()])
    remember = BooleanField('记住我')
    submit = SubmitField('提交')

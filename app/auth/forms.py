#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired,Email


class RegisterForm(FlaskForm):
    email = StringField('邮箱', validators=[DataRequired(),Length(1,64),Email()])
    password = PasswordField('密码', validators=[DataRequired()])
    name = StringField('姓名', validators=[DataRequired()])
    submit = SubmitField('提交')


class LoginForm(FlaskForm):
    email = StringField('邮箱', validators=[DataRequired()])
    password = PasswordField('密码', validators=[DataRequired()])
    remember = BooleanField('记住我')
    submit = SubmitField('提交')

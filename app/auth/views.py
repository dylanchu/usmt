#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-14

from flask import request, render_template, abort, redirect, url_for, current_app, session, jsonify
from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired

from . import auth


class LoginForm(FlaskForm):
    name = StringField('Username', validators=[DataRequired()])


@auth.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if request.method == 'POST':
        session['name'] = form.name.data
        return redirect(url_for('auth.login'))
    return current_app.send_static_file('login.html')
    # return render_template('login.html')


@auth.route('/test', methods=['GET', 'POST'])
def test():
    form = LoginForm()
    if form.validate_on_submit():  # 用postman提交总为false(csrf问题，需要关闭wtf的csrf保护)
        session['name'] = form.name.data
        return redirect(url_for('auth.test'))
    return jsonify({'name': session.get('name')})

#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-14

from flask import render_template, redirect, url_for, current_app, jsonify, flash
from flask_login import login_user, logout_user, login_required, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField
from wtforms.validators import DataRequired
from app.models import User

from . import auth


class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.index'))
    form = LoginForm()
    if form.validate_on_submit():
        check_user = User.objects(email=form.email.data).first()
        if check_user:
            current_app.md5.update((form.password.data + current_app.config['MD5_SALT']).encode())
            if check_user['password'] == current_app.md5.hexdigest():
                login_user(check_user)
                return redirect(url_for('auth.dashboard'))
            flash('登录失败：用户名或密码不正确')
            return redirect(url_for('auth.login'))
        flash('登录失败：用户不存在')
        return redirect(url_for('auth.login'))
    return render_template('login.html', form=form, url_login=url_for('auth.login'))
    # return current_app.send_static_file('login.html')


@auth.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', name=current_user.name, email=current_user.email)


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('auth.dashboard'))

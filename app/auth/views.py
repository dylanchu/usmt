#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-24

from flask import render_template, redirect, url_for, current_app, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from ..models import User, Role
from ..utils import is_local_url

from . import auth
from .forms import RegisterForm, LoginForm


@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        existing_user = User.objects(email=form.email.data).first()
        if existing_user is None:
            user = User()
            user.email = form.email.data
            user.password = current_app.md5_hash(form.password.data)
            user.name = form.name.data
            default_role = Role.objects(name='default').first()
            user.role = default_role
            user.save()
            login_user(user)
            return redirect(url_for('main.dashboard'))
        else:
            flash('注册失败：用户已存在')
            return redirect(url_for('auth.login'))
    return render_template('register.html', form=form, url_register=url_for('auth.register'))


@auth.route('/login', methods=['GET', 'POST'])
def login():
    if current_user.is_authenticated:
        return redirect(url_for('main.dashboard'))
    form = LoginForm()
    if form.validate_on_submit():
        check_user = User.objects(email=form.email.data).first()
        if check_user:
            if check_user['password'] == current_app.md5_hash(form.password.data):
                login_user(check_user, remember=form.remember.data)
                if is_local_url(request.args.get('next')):
                    return redirect(request.args.get('next'))
                else:
                    return redirect(url_for('main.dashboard'))
            flash('登录失败：用户名或密码不正确')
            return redirect(url_for('auth.login', next=request.args.get('next')))
        flash('登录失败：用户不存在')
        return redirect(url_for('auth.login', next=request.args.get('next')))
    return render_template('login.html', form=form, url_login=url_for('auth.login', next=request.args.get('next')))
    # return current_app.send_static_file('login.html')


@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.index'))

#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-1-1

from flask import jsonify, render_template
from flask_login import login_required, current_user
from ..models import StoryMap

from . import main


@main.route('/')
@main.route('/index')
def index():
    return render_template('index.html')


@main.route('/cards')
def db_data_stub():
    data = StoryMap.objects.filter(name='邮箱应用开发故事地图').first()
    return jsonify(data)


@main.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', name=current_user.name, email=current_user.email, maps=current_user.maps,
                           recycle_bin=current_user.recycle_bin)

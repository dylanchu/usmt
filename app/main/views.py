#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-1-1

from flask import jsonify, render_template, request, flash, redirect, url_for
from flask_login import login_required, current_user
from ..models import StoryMap

from . import main
from .forms import NewMapForm


@main.route('/')
@main.route('/index')
def index():
    return render_template('index.html')


@main.route('/cards')
def db_data_stub():
    data = StoryMap.objects.filter(name='邮箱应用开发故事地图').first()
    return jsonify(data)


@main.route('/dashboard', methods=['GET', 'POST'])
@login_required
def dashboard():
    form = NewMapForm()
    if form.validate_on_submit():
        existing_map = StoryMap.objects.filter(name=form.name.data).first()
        if existing_map:
            flash('已存在同名地图!')
            return redirect(url_for('main.dashboard'))
        else:
            sm = StoryMap()
            sm.name = form.name.data
            sm.save()
            current_user.maps[sm.name] = sm.id
            current_user.save()
    return render_template('dashboard.html', name=current_user.name, email=current_user.email, maps=current_user.maps,
                           recycle_bin=current_user.recycle_bin, form=form)


@main.route('/edit')
def edit_map():
    name = request.args.get('name')
    flash('你点击了 查看/编辑故事地图 %s' % name)
    return redirect(url_for('main.dashboard'))


@main.route('/trash')
def trash_map():
    name = request.args.get('name')
    map_id = current_user.maps.get(name)
    if map_id:
        current_user.maps.pop(name)
        current_user.recycle_bin[name] = map_id
        current_user.save()
    else:
        flash('请求失败')
    return redirect(url_for('main.dashboard'))


@main.route('/restore')
def restore_map():
    name = request.args.get('name')
    map_id = current_user.recycle_bin.get(name)
    if map_id:
        current_user.maps[name] = map_id
        current_user.recycle_bin.pop(name)
        current_user.save()
    else:
        flash('请求失败')
    return redirect(url_for('main.dashboard'))


@main.route('/delete')
def delete_map():
    name = request.args.get('name')
    flash('你点击了 彻底删除故事地图 %s' % name)
    return redirect(url_for('main.dashboard'))

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
        sm = StoryMap()
        sm.name = form.name.data
        sm.save()
        current_user.maps[str(sm.id)] = sm.name
        current_user.save()
        return redirect(url_for('main.dashboard'))
    return render_template('dashboard.html', name=current_user.name, email=current_user.email, maps=current_user.maps,
                           recycle_bin=current_user.recycle_bin, form=form)


@main.route('/edit')
def edit_map():
    map_id = request.args.get('sm')
    return redirect(url_for('static', filename='board.html', sm=map_id))


@main.route('/trash')
def trash_map():
    map_id = request.args.get('sm')
    try:
        map_name = current_user.maps.pop(map_id)
        current_user.recycle_bin[map_id] = map_name
        current_user.save()
    except KeyError or TypeError:
        flash('请求失败')
    return redirect(url_for('main.dashboard'))


@main.route('/restore')
def restore_map():
    map_id = request.args.get('sm')
    try:
        map_name = current_user.recycle_bin.pop(map_id)
        current_user.maps[map_id] = map_name
        current_user.save()
    except KeyError or TypeError:
        flash('请求失败')
    return redirect(url_for('main.dashboard'))


@main.route('/delete')
def delete_map():
    map_id = request.args.get('sm')
    try:
        map_name = current_user.recycle_bin.pop(map_id)
        current_user.save()
        the_map = StoryMap.objects.filter(id=map_id).first()
        the_map.delete()
    except KeyError or TypeError:  # TypeError:map_id为None,KeyError:map_id无效
        flash('请求失败')
    except AttributeError:
        flash('所请求地图已不存在')
    else:
        flash('已彻底删除： %s' % map_name)
    return redirect(url_for('main.dashboard'))

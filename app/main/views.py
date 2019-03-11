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
@login_required
def edit_map():
    map_id = request.args.get('sm')
    return redirect(url_for('static', filename='board.html', sm=map_id))

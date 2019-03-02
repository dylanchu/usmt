#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from datetime import datetime
from flask import request, jsonify, json
from flask_login import current_user

from app.models import StoryMap
from . import api, errors


@api.route('get-map')
def get_map():
    if current_user.is_authenticated:
        map_id = request.args.get('sm')
        map_name = current_user.maps.get(map_id)
        if map_id and map_name:
            the_map = StoryMap.objects.filter(id=map_id).first()  # 可以直接用字符串过滤,会自动转为ObjectId(map_id)
            if the_map:
                return jsonify(errors.success({'sm': the_map}))
        return jsonify(errors.bad_request)
    return jsonify(errors.login_required)


@api.route('save-map', methods=['POST'])
def save_map():
    if current_user.is_authenticated:
        map_id = request.args.get('sm')
        map_name = current_user.maps.get(map_id)
        if map_id and map_name:
            the_map = StoryMap.objects.filter(id=map_id).first()  # 可以直接用字符串过滤,会自动转为ObjectId(map_id)
            if the_map:
                the_map.data = json.loads(request.get_data())
                the_map.last_edit = datetime.utcnow()  # 有效否?
                the_map.save()
                return jsonify(errors.success())
        return jsonify(errors.bad_request)
    return jsonify(errors.login_required)


@api.route('/rename', methods=['POST'])
def rename_map():
    if current_user.is_authenticated:
        map_id = request.form.get('sm')
        new_name = request.form.get('nn')
        try:
            current_user.maps[map_id] = new_name
            current_user.save()
            the_map = StoryMap.objects.filter(id=map_id).first()
            the_map.name = new_name
            the_map.save()
        except KeyError or TypeError or AttributeError:
            return jsonify(errors.bad_request)
        return jsonify(errors.success())
    return jsonify(errors.login_required)

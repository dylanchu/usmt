#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from datetime import datetime
from flask import request, jsonify, json
from flask_login import current_user

from app.models import StoryMap
from . import api


@api.route('get-map')
def get_map():
    map_id = request.args.get('sm')
    map_name = current_user.maps.get(map_id)
    if map_id and map_name:
        the_map = StoryMap.objects.filter(id=map_id).first()  # 可以直接用字符串过滤,会自动转为ObjectId(map_id)
        if the_map:
            return jsonify(the_map)
    return 'bad request', 400


@api.route('save-map', methods=['POST'])
def save_map():
    map_id = request.args.get('sm')
    map_name = current_user.maps.get(map_id)
    if map_id and map_name:
        the_map = StoryMap.objects.filter(id=map_id).first()  # 可以直接用字符串过滤,会自动转为ObjectId(map_id)
        if the_map:
            the_map.data = json.loads(request.get_data())
            the_map.last_edit = datetime.utcnow()  # 有效否?
            the_map.save()
            return jsonify({'code': 0, 'msg': 'successfully saved'})
    return 'bad request', 400

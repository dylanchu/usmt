#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from flask import request, jsonify
from flask_login import current_user

from app.models import StoryMap
from . import api


@api.route('get-map-by-name')
def get_map_by_name():
    map_id = request.args.get('sm')
    map_name = current_user.maps.get(map_id)
    if map_id and map_name:
        the_map = StoryMap.objects.filter(id=map_id).first()  # 可以直接用字符串过滤,会自动转为ObjectId(map_id)
        if the_map:
            return jsonify(the_map)
    return 'bad request', 400

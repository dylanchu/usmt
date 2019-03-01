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
    name = request.args.get('name')
    if name:
        map_id = current_user.maps.get(name)
        the_map = StoryMap.objects.filter(id=map_id).first()
        if the_map:
            return jsonify(the_map)
    return 'bad request', 400

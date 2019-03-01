#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from . import api
from flask import request, url_for


@api.route('/edit')
def edit_map():
    name = request.args.get('name')
    return 'api edit map %s' % name


@api.route('/delete')
def delete_map():
    name = request.args.get('name')
    return 'api delete map %s' % name

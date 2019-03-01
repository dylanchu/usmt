#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from . import api


@api.route('/edit/<id>')
def edit_map(id):
    return 'api edit map %s' % id


@api.route('/delete/<id>')
def delete_map(id):
    return 'api delete map %s' % id

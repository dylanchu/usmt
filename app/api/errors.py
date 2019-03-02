#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-2


def success(data=None):
    d = {'code': 0, 'msg': 'success'}
    if isinstance(data, dict):
        d.update(data)
    return d


bad_request = {'code': 4, 'msg': 'bad request'}
login_required = {'code': 1, 'msg': 'login required'}

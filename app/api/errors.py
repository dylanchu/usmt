#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-2


def success(data=None):
    """
    :type data: dict or None
    :return: dict
    """
    d = {'code': 0, 'msg': 'success'}
    if isinstance(data, dict):
        d.update(data)
    return d


def exception(data=None):
    """
    :type data: dict or None
    :return: dict
    """
    d = {'code': 2, 'msg': 'exception'}
    if isinstance(data, dict):
        d.update(data)
    return d


Bad_request = {'code': 4000, 'msg': 'bad request'}
Login_required = {'code': 4100, 'msg': 'login required'}

#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-3-1

from flask import Blueprint

api = Blueprint('api', __name__)

from . import views

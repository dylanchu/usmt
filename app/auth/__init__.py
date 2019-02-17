#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-15

from flask import Blueprint
from flask_login import LoginManager

auth = Blueprint('auth', __name__)

login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'login'
login_manager.login_message = '请登录'


@auth.record_once
def on_load(state):
    login_manager.init_app(state.app)


from . import views

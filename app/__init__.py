#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-15

from config import DevelopmentConfig
from flask import Flask
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from flask_session import Session

db = MongoEngine()
login_manager = LoginManager()
login_manager.session_protection = 'strong'
login_manager.login_view = 'auth.login'


def create_app():
    app = Flask(__name__, static_url_path='/static')  # 要映射静态文件到根目录下用static_url_path=''

    app.config.from_object(DevelopmentConfig)
    app.logger.setLevel(app.config['LOG_LEVEL'])

    Session(app)
    db.init_app(app)
    login_manager.init_app(app)

    from .main import main as main_blueprint
    app.register_blueprint(main_blueprint, static_folder='static')
    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/auth')

    app.md5 = app.config['MD5_TOOL']

    return app

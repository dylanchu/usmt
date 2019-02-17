#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-15

from redis import Redis


class BaseConfig(object):
    LOG_LEVEL = 'DEBUG'  # DEBUG, INFO, WARNING, ERROR, CRITICAL. 可使用app.logger.exception(msg)，但level没有EXCEPTION
    SECRET_KEY = '8p25Nd19xi54h23BX90S932R'
    # SECRET_KEY = os.urandom(24)  # 设为24位的随机字符,每次运行服务器都不同,重启则上次的session清除
    WTF_CSRF_ENABLED = False  # 是否开启flask-wtf的csrf保护，默认是True

    # session
    SESSION_TYPE = 'redis'
    SESSION_KEY_PREFIX = 'flask'
    SESSION_USE_SIGNER = True  # 是否强制加盐混淆session
    SESSION_PERMANENT = True  # 是否长期有效，false则关闭浏览器失效
    PERMANENT_SESSION_LIFETIME = 3600  # session长期有效则设定session生命周期


class DevelopmentConfig(BaseConfig):
    SESSION_USE_SIGNER = False
    SESSION_REDIS = Redis(host='127.0.0.1', port=6379, db=0, password=None)

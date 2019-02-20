#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-20

from app import db
import datetime


class Role(db.Document):
    name = db.StringField(maxlength=32, unique=True)
    r_permission = db.BooleanField(default=False)
    w_permission = db.BooleanField(default=False)
    annotation = db.StringField(maxlength=256)

    meta = {'collection': 'roles', 'strict': False}

    def __repr__(self):
        return "{id:%s, name:%s, read_permission:%s, write_permission:%s}" % (
            self.id, self.name, self.r_permission, self.w_permission)


class User(db.Document):
    email = db.EmailField(max_length=128, required=True, unique=True)
    password = db.StringField(max_length=128, required=True)
    name = db.StringField(max_length=32, required=True)
    role = db.ReferenceField(Role, required=True)
    register_time = db.DateTimeField(default=lambda: datetime.datetime.utcnow())
    last_login_time = db.DateTimeField(default=lambda: datetime.datetime.utcnow())
    # birthday = db.DateTimeField()
    # gender = StringField(max_length=8)
    # wx_id = StringField(max_length=64)

    meta = {'collection': 'users', 'strict': False}

    def __repr__(self):
        return "{id:%s, email:%s, name:%s, role:%s}" % (self.id, self.email, self.name, self.role)

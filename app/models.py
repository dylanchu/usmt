#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-20

from . import login_manager, db
from flask_login import UserMixin
import datetime


@login_manager.user_loader
def load_user(user_id):
    return User.objects(pk=user_id).first()


class Role(db.Document):
    name = db.StringField(maxlength=32, unique=True)
    r_permission = db.BooleanField(default=False)
    w_permission = db.BooleanField(default=False)
    annotation = db.StringField(maxlength=256)

    meta = {'collection': 'roles', 'strict': False}

    def __repr__(self):
        return "{id:%s, name:%s, read_permission:%s, write_permission:%s}" % (
            self.id, self.name, self.r_permission, self.w_permission)


class User(UserMixin, db.Document):
    email = db.EmailField(max_length=128, required=True, unique=True)
    password = db.StringField(max_length=128, required=True)
    name = db.StringField(max_length=32, required=True)
    role = db.ReferenceField(Role, required=True)
    register_time = db.DateTimeField(default=lambda: datetime.datetime.utcnow())
    last_login_time = db.DateTimeField(default=lambda: datetime.datetime.utcnow())
    maps = db.DictField(default={})
    recycle_bin = db.DictField(default={})
    # birthday = db.DateTimeField()
    # gender = StringField(max_length=8)
    # wx_id = StringField(max_length=64)

    meta = {'collection': 'users', 'strict': False}

    def __repr__(self):
        return "{id:%s, email:%s, name:%s, role:%s}" % (self.id, self.email, self.name, self.role)


class StoryMap(db.Document):
    name = db.StringField(max_length=128, required=True)
    visibility = db.StringField(default='default')
    create_at = db.DateTimeField(default=lambda: datetime.datetime.utcnow())
    last_edit = db.DateTimeField(default=lambda: datetime.datetime.utcnow())
    data = db.ListField(default=[
        [{"x": 0, "y": 0, "state": "", "text": ""}]
    ])

    meta = {'collection': 'maps'}

    def __repr__(self):
        return "<StoryMap %s, id:%s}" % (self.name, self.id)

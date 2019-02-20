#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-20

from app import create_app
from app.models import User, Role
import hashlib


if __name__ == '__main__':
    app = create_app()

    # # 创建管理员角色
    # admin_role = Role(name='admin', r_permission=True)
    # admin_role.w_permission = True
    # admin_role.save()
    # # 创建普通用户角色
    # ordinary_role = Role(name='default', r_permission=True)
    # ordinary_role.w_permission = True
    # ordinary_role.save()

    # # 创建管理员用户
    # admin_role = Role.objects(name='admin').first()
    # user1 = User()
    # user1.role = admin_role
    # user1.email = 'aaa@abc.com'
    # user1.name = '张三'
    # temp_pwd = 'pwd123'
    # salt = 'a random string'
    # md5 = hashlib.md5()
    # md5.update((temp_pwd + salt).encode())
    # user1.password = md5.hexdigest()
    # user1.save()
    # # 创建普通用户
    ordinary_role = Role.objects(name='default').first()
    # user2 = User()
    # user2.role = ordinary_role
    # user2.email = 'bbb@abc.com'
    # user2.name = '李四'
    # temp_pwd = 'pwd123'
    # salt = 'a random string'
    # md5 = hashlib.md5()
    # md5.update((temp_pwd + salt).encode())
    # user2.password = md5.hexdigest()
    # user2.save()

    # # query:
    user = User.objects(role=ordinary_role).first()
    print(user.__repr__())
    print(user.role.__repr__())

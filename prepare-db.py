#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-25

"""
为数据库创建示例数据
先创建roles和maps，然后再创建users
"""

from app.models import Role, User, StoryMap
from run_app import app

admin_role = Role()
admin_role.name = 'admin'
admin_role.save()

default_role = Role()
default_role.name = 'default'
default_role.save()

map1 = StoryMap()
map1.name = '邮箱应用开发故事地图'
map1.data = [
                     [
                         {"x": 0, "y": 0, "state": "", "text": "组织邮件"},
                         {"x": 4, "y": 0, "state": "", "text": "管理联系人"},
                         {"x": 2, "y": 0, "text": "管理邮件"}
                     ],
                     [
                         {"x": 0, "y": 0, "state": "", "text": "搜索"},
                         {"x": 1, "y": 0, "state": "", "text": "归档"},
                         {"x": 4, "y": 0, "state": "", "text": "创建"},
                         {"x": 5, "y": 0, "state": "", "text": "更新\n"},
                         {"x": 6, "y": 0, "text": "删除"},
                         {"x": 2, "y": 0, "text": "编辑并发送"},
                         {"x": 3, "y": 0, "text": ""}
                     ],
                     [
                         {"x": 0, "y": 0, "state": "Done", "text": "按关键词搜索"},
                         {"x": 1, "y": 1, "state": "Doing", "text": "创建子文件夹"},
                         {"x": 1, "y": 0, "state": "Todo", "text": "移动"},
                         {"x": 4, "y": 0, "text": "基础创建功能", "state": "Todo"},
                         {"x": 5, "y": 0, "text": "", "state": "Todo"},
                         {"x": 2, "y": 0, "text": "文本邮件", "state": "Todo"}
                     ],
                     [
                         {"x": 0, "y": 0, "text": "按单字段搜索", "state": "Todo"},
                         {"x": 0, "y": 1, "text": "按多字段搜索", "state": "Todo"},
                         {"x": 4, "y": 0, "text": "杂七杂八的创建功能\n杂七杂八的创建功能\n杂七杂八的创建功能\n杂七杂八的创建功能", "state": "Todo"},
                         {"x": 2, "y": 0, "text": "HTML邮件", "state": "Todo"}
                     ]
                 ]
map1.save()

map2 = StoryMap()
map2.name = '随便测试的另一个故事地图'
map2.data = [
    [
        {"x": 0, "y": 0, "state": "", "text": "啥都没有"},
        {"x": 4, "y": 0, "state": "", "text": "空的"},
        {"x": 2, "y": 0, "text": ""}
    ]
]
map2.save()

admin = User()
admin.email = 'admin@site.com'
admin.password = app.md5_hash('1234')
admin.name = '管理员1'
admin.role = admin_role
admin.save()

user1 = User()
user1.email = 'aaa@site.com'
user1.password = app.md5_hash('1234')
user1.name = '张三'
user1.role = default_role
user1.maps[str(map1.id)] = map1.name
user1.maps[str(map2.id)] = map2.name
user1.save()

user2 = User()
user2.email = 'bbb@site.com'
user2.password = app.md5_hash('1234')
user2.name = '李四'
user2.role = default_role
user2.save()

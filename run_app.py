#!/usr/bin/env python3
# coding: utf-8
#
# Created by dylanchu on 19-2-15

from app import create_app

app = create_app()

if __name__ == '__main__':
    app.debug = True
    # handler = logging.FileHandler('flask.log')
    # app.logger.addHandler(handler)
    app.run()
    # app.run(debug=app.debug, host='0.0.0.0', port=5001)  # 无效?要在命令行传入参数: flask run -p 5001

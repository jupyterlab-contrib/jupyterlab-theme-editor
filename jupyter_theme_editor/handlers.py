import json
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /jupyter-theme-editor/get_example endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()
        input_data_dumped = json.dumps(input_data, indent=2);
       #with open("../style/theme.css", "w") as outfile:
            #outfile.write(input_data_dumped) '''

        self.log.info(input_data_dumped)

        data = {"Message received": "Yes!"}
        self.finish(json.dumps(data))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(
        base_url, 'jupyter-theme-editor', "get_example")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

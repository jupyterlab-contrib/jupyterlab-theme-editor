import json
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from jinja2 import Environment, PackageLoader
from pathlib import Path

class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    def initialize(self, env: Environment, path: str):
        self._env = env
        self._path = path

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()
        new_input_data = {}
        for key, value in input_data.items():
            value = str(input_data[key])
            new_value = value.strip()
            new_key = key.replace('--jp-', '').replace('-', '_')
            new_input_data[new_key] = new_value


        j2_template = self._env.get_template(self._path)
        output_data = j2_template.render(new_input_data)
        self.set_header("content-type", "text/css")
        self.set_header("cache-control", "no-cache")
        self.set_header("content-disposition",
                        "attachment; filename=variables.css")
        self.set_header("content-length", len(output_data.encode()))
        self.finish(output_data)


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(
        base_url, 'jupyter-theme-editor', "send_cssProperties")
    handlers = [(route_pattern, RouteHandler, {"env":Environment(loader=PackageLoader(
            "jupyter_theme_editor", "templates")), "path": "template.css" })]
    web_app.add_handlers(host_pattern, handlers)

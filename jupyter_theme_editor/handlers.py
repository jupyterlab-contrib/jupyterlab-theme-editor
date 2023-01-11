import json
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
from jinja2 import Template


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

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


      template = Path('style/template.css').read_text()
            self.log.info('template is:', template)

        j2_template = Template(template)
Path("styles/variables.css").write_text(j2_template.render(new_input_data))


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(
        base_url, 'jupyter-theme-editor', "send_cssProperties")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

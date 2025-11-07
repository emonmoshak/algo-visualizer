from flask import Flask, render_template

# Configure application
app = Flask(__name__)

# Ensure templates are auto-reloaded
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/")
def index():
    """Show the visualizer page"""
    return render_template("index.html")

# This part is needed to run with 'python app.py' if 'flask run' doesn't work
if __name__ == "__main__":
    app.run(debug=True)

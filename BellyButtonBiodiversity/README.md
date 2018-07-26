# Interactive_Visualizations_and_Dashboards
## Step 1 (Data Extraction) <br>
For the first step the data needed to be extracted from the sqlite database.<br>
There are 3 tables in the belly_button_diversity database <br>
a. otu <br>
b. samples <br>
c. samples_metadata <br>
The first step is to create routes and write SQL queries. The results are returned in a JSON format.<br> 
FLASK web server has been used to render the data to the browser.<br>
Initial coding was done in Jupyter notebook, and each route was tested to verify that the data was being rendered correctly.<br>
The following routes were created
a. @app.route("/") : Renders the home page <br>
b. @app.route("/names") : Generates sample names <br>
c. @app.route("/otu") : Generates OTU descriptions <br>
d. @app.route("/otu_descriptions") : Genarates OTU IDs and descriptions <br>
e. @app.route("/metadata/<sample>") : Generates sample Meta Data <br>
f. @app.route('/wfreq/<sample>') : Genarates Wash Frequency <br>
g. @app.route('/samples/<sample>')  : Generates OTU IDs and Sample Values <br>


## Step 2(Data Visualization)
Data has been visualized using JavaScript and Plotly. The following data is diplayed:<br>
a. List of Samples <br>
b. Name value pair of each sample data <br>
c. Pie Chart of Sample <br>
d. Bubble Char of Sample <br>

#### Each of these charts re draw themselves when a Different sample is selected from the Sample dropdown list.

## Steps to execute the program <br>
1. Open and run the flask in Jupyter Notebook.
Ensure that the following directory structures are set up a) Datasets for the database b) templates for index.html c) static for the Javascript file (app.js). <br>
2. Data rendering can be individually verified by going to each route separately e.g. <br>
#### http://127.0.0.1/5000/samples/BB_940 <br>
3. To view the plots run URL http://127.0.0.1/5000/. The homepage shows a dropdown of otu_ids, pie and bubble charts, key/value pair from metadata JSON object. <br>
4. When another sample is choosen from the dropdown list, the plots will update.

This is an image from the final results:
![Final_Output_with_Dropdown](finaloutputwithdropdown.png)
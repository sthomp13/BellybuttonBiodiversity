
# coding: utf-8

# In[1]:


# Import SQL Alchemy `automap`, Flask, custom function and other dependencies. 
from sqlalchemy import create_engine, MetaData, desc
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from flask import Flask, jsonify, render_template

# Import and establish Base for which classes will be constructed 
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

# Import modules to declare columns and column data types
from sqlalchemy import Column, Integer, String, Float, inspect

import numpy as np

#import custom functions
from bbd import return_sample_names


# In[2]:


app = Flask(__name__)

# Create a connection to a SQLite database
engine = create_engine('sqlite:///DataSets/belly_button_biodiversity.sqlite', echo=False)


# In[3]:


# Create a connection to the engine called `conn`
conn = engine.connect()


# In[4]:


# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)


# In[5]:


# Otu = Base.classes.otu
# Samples = Base.classes.samples
# Samples_metadata = Base.classes.samples_metadata

# Save references to the table
# Samples_Metadata = Base.classes.samples_metadata
# Otu = Base.classes.otu
# Samples = Base.classes.samples

Otu = Base.classes.otu
Samples = Base.classes.samples
Samples_metadata = Base.classes.samples_metadata


# In[6]:


#create session (link) from Python to the DB
session = Session(engine)


# In[7]:


@app.route("/")
def home():
    return render_template("index.html")
#     return(
#     f"Available Routes:<br/>"
#     f"/names<br/>"
#     f"/otu<br/>"
#     f"/otu_descriptions<br/>"
#     f"/metadata/<sample>"
#     )


# In[8]:


@app.route("/names")
def names():
    sample_names = Samples.__table__.columns
    sample_names_ls = [name.key for name in sample_names]
    sample_names_ls.remove("otu_id")
    return jsonify(sample_names_ls)


# In[9]:


@app.route("/otu")
def otu():
    otu_descriptions = session.query(Otu.lowest_taxonomic_unit_found).all()
    otu_descriptions_list = [x for (x), in otu_descriptions]
    return jsonify(otu_descriptions_list)


# In[10]:


@app.route("/otu_descriptions")
def otu_disc():
    otu_descriptions = session.query(Otu.otu_id, Otu.lowest_taxonomic_unit_found).all()
    otu_dict = {}
    for row in otu_descriptions:
        otu_dict[row[0]] = row[1]
    return jsonify(otu_dict)


# In[11]:


@app.route("/metadata/<sample>")
def sample_query(sample):
    sample_name = sample.replace("BB_", "")
    result = session.query(Samples_metadata.AGE, Samples_metadata.BBTYPE, Samples_metadata.ETHNICITY, Samples_metadata.GENDER, Samples_metadata.LOCATION, Samples_metadata.SAMPLEID).filter_by(SAMPLEID = sample_name).all()
    record = result[0]
    record_dict = {
        "AGE": record[0],
        "BBTYPE": record[1],
        "ETHNICITY": record[2],
        "GENDER": record[3],
        "LOCATION": record[4],
        "SAMPLEID": record[5]
    }
    return jsonify(record_dict)


# In[12]:


@app.route('/wfreq/<sample>')
def wash_freq(sample):
    sample_name = sample.replace("BB_", "")
    result = session.query(Samples_metadata.WFREQ).filter_by(SAMPLEID = sample_name).all()
    wash_freq = result[0][0]
    return jsonify(wash_freq)


# In[13]:


@app.route('/samples/<sample>')
def get_sample_value(sample):
    otu_ids =[]
    sample_values = []
    samples_result = {}
    
    my_query = "Samples." + sample  #eg. 'Samples.BB_940'
    query_result = session.query(Samples.otu_id, my_query).order_by(desc(my_query))
    
    for result in query_result:
        otu_ids.append(result[0])
        sample_values.append(result[1])
        
    # Add the above lists to the dictionary
    samples_result = {
        "otu_ids": otu_ids,
        "sample_values": sample_values
    }
    return jsonify(samples_result)


# In[14]:


if __name__ == '__main__':
    app.run(debug=True)
    #changed from True to False to work in Jupyter Notebook


#


# app = QApplication(sys.argv)
# app.aboutToQuit.connect(app.deleteLater)


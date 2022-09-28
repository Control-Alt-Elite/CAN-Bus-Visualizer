const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
var bodyParser = require('body-parser')
/*
app.get     /document       gets all the documents
app.post    /document       creates a new document
app.get     /document/:id   gets a single document
app.delete  /document/:id   deletes a single document
app.patch   /documents/:id  updates a single document

*/
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect('mongodb://127.0.0.1:27017/canbusdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true 

})  .then(() => console.log("Connected to the database"))
    .catch(console.error);

//Models
const Project = require('./models/model');
const Session = require('./models/model')

app.get('/projects', async (req, res) => {
	const projects = await Project.find();

	res.json(projects);
});

app.post('/project/new', (req, res) => {
	// const project = new Project({
    //     projectName: req.body.projectName,
    //     storedLocation: req.body.storedLocation
	// })
	const session = new Project({
        analystInitials: req.body.analystInitials,
        projectDate: req.body.projectDate,
		vehicleID: req.body.vehicleID,
		baudRate: req.body.baudRate,
		canConnectorID: req.body.canConnectorID,
		blacklistFileName: req.body.blacklistFileName,
		dbc_file_name: req.body.dbc_file_name
	})

	// project.save();
	session.save()

	// res.json(project);
	res.json(session)
});

app.delete('/project/delete/:id', async (req, res) => {
	const result = await Project.findByIdAndDelete(req.params.id);

	res.json({result});
});


app.listen(3001);
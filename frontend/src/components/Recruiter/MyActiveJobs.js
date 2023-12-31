import React, {Component} from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from "react-router-dom";



class MyActiveJobs extends Component {
    
    constructor(props) {
        super(props);
        this.setState = {
            userdetails: [],
            users: [],
            applications: [],
            jobs: [],
            sortedJobs: [], 
            sortName:true, 
            showform: false,
            posmax: -1,
            appmax: -1,
            deadline: new Date(),
            editing: ""
        };
        this.deljob = this.deljob.bind(this);
        this.editJob = this.editJob.bind(this);
        this.editJobSubmit = this.editJobSubmit.bind(this);
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    onChange = e => {
        this.setsetState({ [e.target.id]: e.target.value });
    };

    componentDidMount() {
        const { user } = this.props.auth;
        axios.get('http://localhost:4000/user/'+ user.id)
                .then(response => {
                    this.setsetState({userdetails: response.data});
                })
                .catch(function(error) {
                    console.log(error);
                })
        axios.get('http://localhost:4000/job/get_jobs')
            .then(response => {
                this.setsetState({jobs: response.data, sortedJobs:response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/user/')
            .then(response => {
                this.setsetState({users: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
        axios.get('http://localhost:4000/application/get_applications')
            .then(response => {
                this.setsetState({applications: response.data});
            })
            .catch(function(error) {
                console.log(error);
            })
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setsetState({
            errors: nextProps.errors
            });
        }
    }

    deljob(id) {
        let applicationsArray = this.setState.applications;
        let usersArray = this.setState.users;
        axios
            .delete('http://localhost:4000/job/del_job/' + id)
            .then(response => {
                alert("Job deleted successfully.");
            })
            .catch(function(error) {
                console.log(error);
            })

        applicationsArray.filter(item => item.jobId === id && item.status === "Accepted").forEach(
            function(appli) 
            {
                const editEmployee = {
                    working: false
                }
                axios
                    .put('http://localhost:4000/user/edit_profile/' + appli.applicantId, editEmployee)
                    .then(response => {
                        console.log(editEmployee);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            })
    
        applicationsArray.filter(item => item.jobId === id).forEach(
            function(appli) 
            {
                let applicant = usersArray.filter(item => item._id === appli.applicantId)[0];
                let nnumapp = +applicant.numapp;

                if(applicant.working === false)
                {
                    nnumapp = +nnumapp - 1;
                    if(nnumapp < 0) nnumapp = 0;
                }

                const editApplicant = {
                    numapp: nnumapp
                };

                axios
                    .put('http://localhost:4000/user/edit_profile/' + appli.applicantId, editApplicant)
                    .then(response => {
                        console.log(editApplicant);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })

                const editAppli = {
                    status: "Deleted"
                }

                axios
                    .put('http://localhost:4000/application/edit_application/' + appli._id, editAppli)
                    .then(response => {
                        console.log(editAppli);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
            })

        
        // to refresh
        this.props.history.push('/viewMyActiveJobs');
        this.props.history.push('/viewMyActiveJobs');
        this.props.history.goBack();
        window.location.reload();
        
    }

    editJob(job) {
        let show = !this.setState.showform;
        this.setsetState({ showform: show});
        this.setsetState({ editing: job._id });
        console.log(this.setState.showform);
        this.setsetState({ appmax: job.appmax });
        this.setsetState({ posmax: job.posmax });
        if(job.deadline)
        {
            job.deadline = job.deadline.toString();
            job.deadline = job.deadline.substring(0,10);
            this.setsetState({ deadline: job.deadline });
        }
        // to refresh
        // this.props.history.push('/viewMyActiveJobs');
    }

    onBack() {
        let show = !this.setState.showform;
        this.setsetState({ showform: show});
        this.setsetState({ editing: "" });
        
        // to refresh
        this.props.history.push('/viewMyActiveJobs');
    }

    editJobSubmit(job) {
        const idToChange = job._id;
        const ind = this.setsetState.jobs.findIndex(x => x._id === idToChange)
        
        if(this.setsetState.deadline)
            this.setsetState.jobs[ind].deadline = this.setState.deadline;
        if(this.setsetState.appmax < this.setState.posmax)
        {
            alert("Max. no. of applications cannot be less than the max. no. of positions.");
        }
        else
        {
            if(this.setsetState.appmax)
                this.setsetState.jobs[ind].appmax = this.setState.appmax;
            if(this.setsetState.posmax)
                this.setsetState.jobs[ind].posmax = this.setState.posmax;
            axios
                .put('http://localhost:4000/job/edit_job/' + idToChange, this.setsetState.jobs[ind])
                .then(response => {
                    console.log(this.setState.jobs[ind]);
                    this.setsetState({ editing: "" });
                })
                .catch(function(error) {
                    alert("Job couldn't be updated!");
                    console.log(error);
                })
        }
        // to refresh
        
        let show = !this.setState.showform;
        this.setsetState({ showform: show});
        // window.location.reload();
    }


    render() 
    {
        const userRole = this.setState.userdetails.role;
        const userid = this.setState.userdetails._id;
        let MyActiveJobs;
        if(userRole === "recruiter") {
            MyActiveJobs =
            <div>
                <Grid>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3>My Jobs Listing </h3>
                            <Tooltip title="Add Job" aria-label="added">
                            <Link style={{ color: '#009900', weight: 'bold' }} to="/addJob"><i className="material-icons"><h2> add</h2></i></Link>
                            </Tooltip>
                        </ListItem>
                    </List>
                </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Date of posting</TableCell>
                                            <TableCell>Number of Applicants</TableCell>
                                            <TableCell>Remaining Number of Positions</TableCell>
                                            <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.setState.jobs.filter(item => item.recruiter === userid && item.numpos < item.posmax).map((job,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{job.title}</TableCell>
                                            <TableCell>{job.dateOfPost.substring(0,10)}</TableCell>
                                            <TableCell>{job.numapp}</TableCell>
                                            <TableCell>{job.posmax - job.numpos}</TableCell>
                                            
                                                <Link
                                                    to={{
                                                        pathname: "/appList",
                                                        setState: job._id // data array of objects
                                                    }}
                                                    >View applications</Link>
                                                
                                            <TableCell>
                                                <Dropdown>
                                                    <Dropdown.Toggle variant="secondary"/>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item>
                                                            <Tooltip title="Delete Job" aria-label="delete">
                                                                <button
                                                                    className="btn waves-effect waves-light hoverable blue accent-3" 
                                                                    onClick={() => this.deljob(job._id)}>
                                                                    <i 
                                                                    style={{
                                                                        color: "#FF0000",
                                                                        }}
                                                                        className="material-icons">delete</i> Delete
                                                                </button> 
                                                            </Tooltip>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Tooltip title="Edit Job" aria-label="edit">
                                                                <button
                                                                    className="btn waves-effect waves-light hoverable blue accent-3" 
                                                                    onClick={() => this.editJob(job)}>
                                                                    <i 
                                                                    style={{
                                                                        color: "#0000FF",
                                                                        }}
                                                                        className="material-icons">edit</i>Edit
                                                                </button>
                                                            </Tooltip>
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                 
                                            </TableCell>
                                            <TableCell>                   
                                            <div>
                                            { !this.setState.showform || this.setState.editing !== job._id? 
                                                <div></div>
                                            : 
                                                <div>
                                                    <br></br>
                                                    <form noValidate onSubmit={this.onSubmit}>
                                                        <div className="input-field col s12">
                                                            <label htmlFor="appmax">Maximum number of applications allowed</label><br></br>
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.setState.appmax}
                                                                id="appmax"
                                                                type="number"
                                                                min="0"
                                                            />
                                                        </div>
                                                        <div className="input-field col s12">
                                                            <label htmlFor="posmax">Maximum number of positions available</label><br></br>
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.setState.posmax}
                                                                id="posmax"
                                                                type="number"
                                                                min="0"
                                                            />
                                                        </div>
                                                        <div className="input-field col s12">
                                                            <label htmlFor="deadline">Deadline for application</label><br></br>
                                                            <input
                                                                onChange={this.onChange}
                                                                value={this.setState.deadline}
                                                                id="deadline"
                                                                type="date"
                                                            />
                                                        </div>
                                                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                                        <button
                                                        style={{
                                                            color: "#0000FF",
                                                            }}
                                                            className="btn btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                            onClick={() => this.onBack()}>
                                                            <b>Back</b>
                                                        </button>
                                                        <button
                                                        style={{
                                                            color: "#009900",
                                                            }}
                                                            className="btn btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                            onClick={() => this.editJobSubmit(job)}>
                                                            <b>Save</b>
                                                        </button>
                                                        </div>
                                                    </form>
                                                </div>  
                                            }
                                            </div>
                                            </TableCell>
                                        </TableRow> 
                                ))}
                                </TableBody>
                            </Table>
                        </Paper>               
                    </Grid>    
                </Grid>            
            </div>
        }
        return (
            <div style={{ height: "75vh" }} className="valign-wrapper">
                <div className="row">
                    <div className="col s12 center-align">
                        <Card style={{ width: '100%' }}>
                            <Card.Body>
                                <Card.Text>
                                    {MyActiveJobs}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

MyActiveJobs.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapsetStateToProps = setState => ({
    auth: setState.auth,
    errors: setState.errors
});
export default connect(
    mapsetStateToProps,
)(MyActiveJobs);
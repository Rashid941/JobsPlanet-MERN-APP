import React, {Component} from 'react';
import axios from 'axios';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";


class AppList extends Component {
    
    constructor(props) {
        super(props);
        this.setState = {
            userdetails: [],
            users: [],
            jobs: [],
            applications: [],
            rating: 0,
            sortbyname:true,
            sortbydateofapply:true,
            sortbyrating:true
        };
        this.renderNameIcon = this.renderNameIcon.bind(this);
        this.renderDateOfApplyIcon = this.renderDateOfApplyIcon.bind(this);
        this.renderRatingIcon = this.renderRatingIcon.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.sortByDateOfApply = this.sortByDateOfApply.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
        this.accept = this.accept.bind(this);
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
                this.setsetState({jobs: response.data});
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

    getjob(jobId)
    {
        let job = this.setState.jobs.filter(item => item._id === jobId)[0];
        return job;
    }

    getapplicant(applicantId)
    {
        let applicant = this.setState.users.filter(item => item._id === applicantId)[0];
        return applicant;
    }

    sortByName(){
        var array = this.setState.applications;
        var flag = this.setState.sortbyname;
        let uusers = this.setState.users;
        function getapplicant(applicantId)
        {
            let applicant = uusers.filter(item => item._id === applicantId)[0];
            return applicant;
        }
        array.sort(function(a, b) {
            console.log(a.applicantId);
            let aapp = getapplicant(a.applicantId);
            let bapp = getapplicant(b.applicantId);
            if(aapp.name !== undefined && bapp.name !== undefined){
                return (1 - +flag*2) * aapp.name.localeCompare(bapp.name);
            }
            else{
                return 1;
            }
          });
        this.setsetState({
            applications:array,
            sortbyname:!this.setState.sortbyname,
        })
    }

    sortByDateOfApply(){
        var array = this.setState.applications;
        var flag = this.setState.sortbydateofapply;
        array.sort(function(a, b) {
            if(a.dateOfApply !== undefined && b.dateOfApply !== undefined){
                return (1 - +flag*2) * (new Date(a.dateOfApply) - new Date(b.dateOfApply));
            }
            else{
                return 1;
            }
          });
        this.setsetState({
            applications:array,
            sortbydateofapply:!this.setState.sortbydateofapply,
        })
    }

    sortByRating(){
        var array = this.setState.applications;
        var flag = this.setState.sortbyrating;
        let uusers = this.setState.users;
        function getapplicant(applicantId)
        {
            let applicant = uusers.filter(item => item._id === applicantId)[0];
            return applicant;
        }
        array.sort(function(a, b) {
            let aapp = getapplicant(a.applicantId);
            let bapp = getapplicant(b.applicantId);
            if(aapp.rating !== undefined && bapp.rating !== undefined){
                return (1 - +flag*2) * (+aapp.rating - +bapp.rating);
            }
            else{
                return 1;
            }
          });
        this.setsetState({
            applications:array,
            sortbyrating:!this.setState.sortbyrating,
        })
    }

    renderNameIcon(){
        if(this.setState.sortbyname){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    renderDateOfApplyIcon(){
        if(this.setState.sortbydateofapply){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    renderRatingIcon(){
        if(this.setState.sortbyrating){
            return(
                <ArrowDownwardIcon/>
            )
        }
        else{
            return(
                <ArrowUpwardIcon/>
            )            
        }
    }

    shortlist(application) {
        const editApplication = {
            status: "Shortlisted"
        };

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })
            window.location.reload();
    }

    accept(application) {
        let job = this.getjob(application.jobId);
        if(job.numpos === job.posmax)
        {
            alert("All positions are filled!");
            return;
        }
        else if(job.numpos === job.posmax - 1)
        {
            this.setState.applications.filter(item => item.applicantId !== application.applicantId && item.jobId === application.jobId && item.status !== "Deleted" && item.status !== "Accepted").forEach(
                function(appli)
                {
                    // let temp = job;
                    const tempAppli = {
                        status: "Rejected"
                    }
                    // let newNumApp = +temp.numapp - 1;
                    // if(newNumApp < 0) newNumApp = 0;
                    // const tempJob = {
                    //     numapp: newNumApp
                    // }
                    axios
                        .put('http://localhost:4000/application/edit_application/' + appli._id, tempAppli)
                        .then(response => {
                            console.log(tempAppli);
                        })
                        .catch(function(error) {
                            console.log(error);
                        })
                    // axios
                    //     .put('http://localhost:4000/job/edit_job/' + temp._id, tempJob)
                    //     .then(response => {
                    //         console.log(tempJob);
                    //     })
                    //     .catch(function(error) {
                    //         console.log(error);
                    //     })
                })
        }
        let nnumpos = +job.numpos + 1;

        const editApplicant = {
            working: true,
            numapp: 0
        };

        const editJob = {
            numpos: nnumpos
        };

        const editApplication = {
            status: "Accepted",
            doj: new Date()
        };

        axios
            .put('http://localhost:4000/job/edit_job/' + job._id, editJob)
            .then(response => {
                console.log(editJob);
            })
            .catch(function(error) {
                console.log(error);
            })

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })
        
        axios
            .put('http://localhost:4000/user/edit_profile/' + application.applicantId, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })
        let alljobs = this.setState.jobs;
        this.setState.applications.filter(item => item.applicantId === application.applicantId && item._id !== application._id && item.status !== "Deleted").forEach(
            function(appli)
            {
                // let appliJob = alljobs.filter(item => item._id === appli.jobId)[0];
                const editAppli = {
                    status: "Rejected"
                }
                // let napp = +appliJob.numapp - 1;
                // if(napp < 0) napp = 0;
                // const editAppliJob = {
                //     numapp: napp
                // }
                axios
                    .put('http://localhost:4000/application/edit_application/' + appli._id, editAppli)
                    .then(response => {
                        console.log(editAppli);
                    })
                    .catch(function(error) {
                        console.log(error);
                    })
                // axios
                //     .put('http://localhost:4000/job/edit_job/' + appliJob._id, editAppliJob)
                //     .then(response => {
                //         console.log(editAppliJob);
                //     })
                //     .catch(function(error) {
                //         console.log(error);
                //     })
            })

        this.props.history.push('/appList');
        this.props.history.push('/');
        this.props.history.goBack();
    }

    reject(application) {
        // const { user } = this.props.auth;
        // let job = this.getjob(application.jobId);
        let applicant = this.getapplicant(application.applicantId);
        // let job = this.getjob(application.jobId);
        let nnumapp = +applicant.numapp - 1;
        // let jnumapp = +job.numapp - 1;

        if(nnumapp < 0) nnumapp = 0;
        // if(jnumapp < 0) jnumapp = 0;

        const editApplicant = {
            numapp: nnumapp
        };

        const editApplication = {
            status: "Rejected"
        };

        // const editJob = {
        //     numapp: jnumapp
        // };

        axios
            .put('http://localhost:4000/application/edit_application/' + application._id, editApplication)
            .then(response => {
                console.log(editApplication);
            })
            .catch(function(error) {
                console.log(error);
            })

        // axios
        //     .put('http://localhost:4000/job/edit_job/' + job._id, editJob)
        //     .then(response => {
        //         console.log(editJob);
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        //     })
        
        axios
            .put('http://localhost:4000/user/edit_profile/' + application.applicantId, editApplicant)
            .then(response => {
                console.log(editApplicant);
            })
            .catch(function(error) {
                console.log(error);
            })

        this.props.history.push('/appList');
        this.props.history.push('/appList');
        this.props.history.goBack();;
    }

    render() 
    {
        const { user } = this.props.auth;
        const userRole = this.setState.userdetails.role;
        let Applications;
        if(userRole === "recruiter") {
            Applications =
            <div>
                <Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3>Applications</h3>
                        </ListItem>
                    </List>
                </Grid>
                </Grid>
                <Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        {/* <Paper> */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Applicant <Button onClick={this.sortByName}>{this.renderNameIcon()}</Button></TableCell>
                                            <TableCell>Appl. Rating <Button onClick={this.sortByRating}>{this.renderRatingIcon()}</Button></TableCell>
                                            <TableCell>Appl. Skills</TableCell>
                                            <TableCell><ul><li>Education</li></ul></TableCell>
                                            <TableCell>SOP</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Date of Application <Button onClick={this.sortByDateOfApply}>{this.renderDateOfApplyIcon()}</Button></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.setState.applications.filter(item => item.status !== "Rejected" && item.recruiterId === user.id && item.jobId === this.props.location.setState).map((application,ind) => (
                                        <TableRow key={ind}>
                                            <TableCell>{application.title}</TableCell>
                                            {this.setState.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.name}</TableCell>
                                            ))}
                                            {this.setState.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.rating ? applicant.rating.toFixed(1): ""}<i className="material-icons"><h6> star</h6></i></TableCell>
                                            ))}
                                            {this.setState.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.skills.join(", ")}</TableCell>
                                            ))}
                                            {this.setState.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>
                                                    {
                                                        applicant.education.map(ed => (
                                                            <ul>
                                                                <li>School: {ed.school}</li>
                                                                <li>Degree: {ed.degree}</li>
                                                                <li>Start date: {ed.startdate ? ed.startdate.toString().substring(0, 10): "NA"}</li>
                                                                <li>End date: {ed.enddate ? ed.enddate.toString().substring(0, 10):"NA"}</li>
                                                            </ul>
                                                        ))
                                                    }
                                                </TableCell>
                                            ))}
                                            <TableCell>{application.sop}</TableCell>
                                            <TableCell>{application.status}</TableCell>
                                            <TableCell>{application.dateOfApplication.substring(0, 10)}</TableCell>
                                           
                                            {application.status === "Applied"?
                                            
                                            <TableCell>
                                                <Tooltip title="Shortlist Candidate" aria-label="apply">
                                                    <button
                                                        className="btn btn-primary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.shortlist(application)}>
                                                        Shortlist
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <div></div>

                                            }
                                            {application.status === "Shortlisted"?
                                            
                                            <TableCell>
                                                <Tooltip title="Accept Candidate" aria-label="apply">
                                                    <button
                                                        className="btn btn-success btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.accept(application)}>
                                                        Accept
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <div></div>

                                            }
                                            {application.status === "Accepted"?
                                            
                                            <TableCell>
                                                <Tooltip title="Reject Candidate" aria-label="apply">
                                                    <button
                                                        className="btn btn-secondary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        >
                                                        Accepted
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <TableCell>
                                                <Tooltip title="Rate this job" aria-label="apply">
                                                    <button
                                                        className="btn btn-danger btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.reject(application)}>
                                                        Reject
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            }
                                            
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        {/* </Paper>                */}
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
                                {Applications}
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

AppList.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapsetStateToProps = setState => ({
    auth: setState.auth,
    errors: setState.errors
});
export default connect(
    mapsetStateToProps,
)(AppList);
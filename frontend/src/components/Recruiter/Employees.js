import React, {Component} from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import Button from '@material-ui/core/Button';
import Rating from '@material-ui/lab/Rating';
import List from '@material-ui/core/List';
import Tooltip from '@material-ui/core/Tooltip';
import ListItem from '@material-ui/core/ListItem';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import PropTypes from "prop-types";
import Card from "react-bootstrap/Card";
import { connect } from "react-redux";

class Employees extends Component {
    
    constructor(props) {
        super(props);
        this.setState = {
            userdetails: [],
            users: [],
            jobs: [],
            applications: [],
            rating: 0,
            sortbyname:true,
            sortbytitle:true,
            sortbyrating:true,
            sortbydateofjoin: true
        };
        this.giveRating = this.giveRating.bind(this);
        this.renderNameIcon = this.renderNameIcon.bind(this);
        this.sortByName = this.sortByName.bind(this);
        this.renderTitleIcon = this.renderTitleIcon.bind(this);
        this.sortByTitle = this.sortByTitle.bind(this);
        this.renderRatingIcon = this.renderRatingIcon.bind(this);
        this.sortByRating = this.sortByRating.bind(this);
        this.sortByDateOfJoin = this.sortByDateOfJoin.bind(this);
        this.renderDateOfJoinIcon = this.renderDateOfJoinIcon.bind(this);
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
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

    onChange = e => {
        this.setsetState({ [e.target.id]: e.target.value });
    };

    rated(application) {
        if(application.applicantRating !== -1) return true;
        return false;
    }

    giveRating(e) {
        console.log(e.target.value);
        this.setsetState({rating: e.target.value});
    }

    getjob(jobId)
    {
        let job = this.setState.jobs.filter(item => item._id === jobId)[0];
        return job;
    }

    getapplicant(applicantId)
    {
        let applicant = this.setState.users.filter(item => item._id === applicantId)[0];
        console.log(applicant);
        return applicant;
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
            if(aapp !== undefined && bapp !== undefined && aapp.name !== undefined && bapp.name !== undefined){
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

    sortByTitle(){
        var array = this.setState.applications;
        var flag = this.setState.sortbytitle;
        let jjobs = this.setState.jobs;
        function getjob(jobId)
        {
            let job = jjobs.filter(item => item._id === jobId)[0];
            return job;
        }
        array.sort(function(a, b) {
            let aapp = getjob(a.jobId);
            let bapp = getjob(b.jobId);
            if(aapp.title !== undefined && bapp.title !== undefined){
                return (1 - +flag*2) * aapp.title.localeCompare(bapp.title);
            }
            else{
                return 1;
            }
          });
        this.setsetState({
            applications:array,
            sortbytitle:!this.setState.sortbytitle,
        })
    }

    renderTitleIcon(){
        if(this.setState.sortbytitle){
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

    sortByDateOfJoin(){
        var array = this.setState.applications;
        var flag = this.setState.sortbydateofjoin;
        array.sort(function(a, b) {
            if(a.dateOfJoin !== undefined && b.dateOfJoin !== undefined){
                return (1 - +flag*2) * (new Date(a.dateOfJoin) - new Date(b.dateOfJoin));
            }
            else{
                return 1;
            }
          });
        this.setsetState({
            applications:array,
            sortbydateofjoin:!this.setState.sortbydateofjoin,
        })
    }

    renderDateOfJoinIcon(){
        if(this.setState.sortbydateofjoin){
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

    rate(application)
    {
        let applicant = this.getapplicant(application.applicantId);
        console.log(applicant._id);
        let nrate = applicant.numrate;
        nrate = nrate + 1;
        let nrating = 0;
        if(applicant.rating === -1)
        {
            nrating = +this.setState.rating;
        }
        else
        {
            nrating = ((+applicant.rating * (+nrate-1)) + +this.setState.rating) / (+nrate);
        }

        const editApplicant = {
            rating: nrating,
            numrate: nrate
        };

        const editApplication = {
            applicantRating: nrating
        };

        axios
            .put('http://localhost:4000/user/edit_profile/' + applicant._id, editApplicant)
            .then(response => {
                console.log(editApplicant);
                alert("Applicant rated successfully!");
            })
            .catch(function(error) {
                console.log(error);
                alert("Applicant could not be rated.");
            })

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

    render() 
    {
        const { user } = this.props.auth;
        const userRole = this.setState.userdetails.role;
        let Myemployees;
        if(userRole === "recruiter") {
            Myemployees =
            <div>
                <Grid container>
                <Grid item xs={12} md={3} lg={3}>
                    <List component="nav" aria-label="mailbox folders">
                        <ListItem text>
                            <h3>Employees</h3>
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
                                        <TableCell>Name <Button onClick={this.sortByName}>{this.renderNameIcon()}</Button></TableCell>
                                        <TableCell>Employee Rating <Button onClick={this.sortByRating}>{this.renderRatingIcon()}</Button></TableCell>
                                        <TableCell>Job Title <Button onClick={this.sortByTitle}>{this.renderTitleIcon()}</Button></TableCell>
                                        <TableCell>Job Type</TableCell>
                                        <TableCell>DOJ <Button onClick={this.sortByDateOfJoin}>{this.renderDateOfJoinIcon()}</Button></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {this.setState.applications.filter(item => item.status === "Accepted" && item.recruiterId === user.id).map((application,ind) => (
                                        <TableRow key={ind}>
                                            
                                            {this.setState.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.name}</TableCell>
                                            ))}

                                            {this.setState.users.filter(item => item._id === application.applicantId).map((applicant,innd) => (
                                                <TableCell key={innd}>{applicant.rating ? applicant.rating.toFixed(1): ""}<i className="material-icons"><h6> star</h6></i></TableCell>
                                            ))}
                                            
                                            {this.setState.jobs.filter(item => item._id === application.jobId).map((job,innnd) => (
                                                <TableCell key={innnd}>
                                                    {job.title}
                                                </TableCell>
                                            ))}

                                            {this.setState.jobs.filter(item => item._id === application.jobId).map((job,innnd) => (
                                                <TableCell key={innnd}>
                                                    {job.type}
                                                </TableCell>
                                            ))}
                                            <TableCell>{application.doj?application.doj.substring(0, 10):""}</TableCell>
                                            {!this.rated(application)?
                                            
                                            <TableCell>
                                                <Rating
                                                    value={this.setState.rating}
                                                    onChange={this.giveRating}
                                                />
                                                <Tooltip title="Rate this employee" aria-label="rate">
                                                    <button
                                                        className="btn btn-primary btn-sm waves-effect waves-light hoverable blue accent-3" 
                                                        onClick={() => this.rate(application)}>
                                                        Rate Employee
                                                    </button> 
                                                </Tooltip>                                            
                                            </TableCell>

                                            :

                                            <TableCell>
                                                <div>Rated</div>                                           
                                            </TableCell>

                                            }
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
                                    {Myemployees}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }
}

Employees.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapsetStateToProps = setState => ({
    auth: setState.auth,
    errors: setState.errors
});
export default connect(
    mapsetStateToProps,
)(Employees);
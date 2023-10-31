import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

class Register extends Component {
    constructor() {
        super();
        this.setState = {
            name: "",
            email: "",
            password: "",
            password2: "",
            role: "",
            phone_number: NaN,
            skills: [],
            errors: {}
        };
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setsetState({role: event.target.value});
    }
    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
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
    onSubmit = e => {
        e.preventDefault();
        console.log(this.setState.skills);
        if(this.setState.role === "applicant" && this.setState.skills !== "" && this.setState.skills.length !== 0)
            this.setState.skills = this.setState.skills.split(',');
        const newUser = {
            name: this.setState.name,
            email: this.setState.email,
            password: this.setState.password,
            password2: this.setState.password2,
            role: this.setState.role,
            phone_number: this.setState.phone_number,
            skills: this.setState.skills
        };
        this.props.registerUser(newUser, this.props.history);
        console.log(newUser);
    };
    render() {
        const { errors } = this.setState;
        const userRole = this.setState.role;
        let RoleForm;
        if(userRole === 'applicant') {
            RoleForm = 
            <div>
                <label htmlFor="skills">Skills (comma-separated):</label><br></br>
                <input
                    onChange={this.onChange}
                    value={this.setState.skills}
                    placeholder="Enter skills"
                    id="skills"
                    type="text"
                />
            </div>
        }
        else if(userRole === 'recruiter') {
            RoleForm = 
            <div>
                <label htmlFor="phone_number">Phone no.</label><br></br>
                <input
                    onChange={this.onChange}
                    value={this.setState.phone_number}
                    id="phone_number"
                    type="number"
                />
            </div>
        }
        return (
            <div className="container">
                <div className="row">
                    <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                        <i className="material-icons left"><b>keyboard_backspace</b></i>
                    </Link>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <h4>
                        <b>Register</b>
                        </h4>
                        <p className="grey-text text-darken-1">
                        Already have an account? <Link to="/login">Log in</Link>
                        </p>
                    </div>
                        <form noValidate onSubmit={this.onSubmit}>
                            <div className="input-field col s12">
                                <label htmlFor="name">Role</label><br></br>
                                <select 
                                    value={this.setState.role} 
                                    onChange={this.handleChange}
                                    error={errors.role}
                                    id="role"
                                    className={classnames("", {
                                        invalid: errors.role
                                        })}
                                >
                                    <option value="">Select role</option>
                                    <option value="applicant">Applicant</option>
                                    <option value="recruiter">Recruiter</option>
                                </select>
                                <span className="red-text">{errors.role}</span>
                            </div> 
                            <div className="input-field col s12">
                                <label htmlFor="name">Name</label><br></br>
                                <input
                                    onChange={this.onChange}
                                    value={this.setState.name}
                                    error={errors.name}
                                    id="name"
                                    type="text"
                                    className={classnames("", {
                                        invalid: errors.name
                                        })}
                                />
                                <span className="red-text">{errors.name}</span>
                            </div>
                            <div className="input-field col s12">
                                <label htmlFor="email">Email</label><br></br>
                                <input
                                    onChange={this.onChange}
                                    value={this.setState.email}
                                    error={errors.email}
                                    id="email"
                                    type="email"
                                    className={classnames("", {
                                        invalid: errors.email
                                    })}
                                />
                                <span className="red-text">{errors.email}</span>
                            </div>
                            <div className="input-field col s12">
                                <label htmlFor="password">Password</label><br></br>
                                <input
                                    onChange={this.onChange}
                                    value={this.setState.password}
                                    error={errors.password}
                                    id="password"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password
                                    })}
                                />
                                <span className="red-text">{errors.password}</span>
                            </div>
                            <div className="input-field col s12">
                                <label htmlFor="password2">Confirm Password</label><br></br>
                                <input
                                    onChange={this.onChange}
                                    value={this.setState.password2}
                                    error={errors.password2}
                                    id="password2"
                                    type="password"
                                    className={classnames("", {
                                        invalid: errors.password2
                                    })}
                                />
                                <span className="red-text">{errors.password2}</span>
                            </div>
                            <hr></hr>
                            <div className="input-field col s12">
                                {RoleForm}
                            </div>
                            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                                <button
                                    style={{
                                    width: "150px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                    marginTop: "1rem"
                                    }}
                                    type="submit"
                                    className="btn btn-primary btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                    Sign up
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapsetStateToProps = setState => ({
    auth: setState.auth,
    errors: setState.errors
});

export default connect(
    mapsetStateToProps,
    { registerUser }
)(withRouter(Register));
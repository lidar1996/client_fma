import React, { Component } from 'react';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import axios from "../axios";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SearchResults from './SearchResults';
import CircularProgress from '@mui/material/CircularProgress';
import { saveItem } from "../Action/SaveItem";
import { saveUser } from "../Action/SaveUser";
import { connect } from "react-redux";
import Button from '@mui/material/Button';
import CalculateResults from './CalculateResults';
import Autocomplete from '@mui/material/Autocomplete';
import Fade from '@mui/material/Fade';

class CalculateSearchForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
          square_meter: 0,
          num_of_rooms: 0,
          city: '',
          street: '', 
          show_modal: false,
          error: '',
          calculate_result_from_server: null,
          error_search: false,
          msg_error_search: 'Sorry, we do not have data to your search yet....',
          streets_by_city: []
      };
      this.props.saveUser({
        user: this.props.user.user,
      });
      this.props.saveItem({
        item: this.props.item.item,
      });
      console.log(this.props.user.user.email)
    }
    
    handleChangeNumOfRooms = (event) => {
        this.setState({ num_of_rooms: Number(event.target.value) });
      };
    
    handleChangeSquareMeter = (event) => {
        this.setState({ square_meter: Number(event.target.value) });
      };

    handleChangeCity = (event) => {
        this.setState({ city: event.target.value });
      };

    handleChangeStreet = (event) => {
        this.setState({ street: event.target.value });
      };

    handleSubmitForm = (e) => {
        e.preventDefault();
        
        //check_inputs
        let error_msg = this.checkInputs()
        if (error_msg != '') {
            this.setState({ error: error_msg });
            return;
        }
        
        //save_search
        this.postOperation()
        
        //open_modal
        this.setState({ show_modal: true });
    }

    handleCloseModal = () => {
        this.setState({ show_modal: false, calculate_result_from_server: null, error_search: false });
    }

    postOperation = () => {
        const operation = JSON.stringify({
            _id: 'operation_id',
            type: "calculate_increase_in_value",
            invoked_by: this.props.user.user.email, //this.props.user.email
            created_timestamp: '',
            operation_attributes: {
                asset_room_numebers: this.state.num_of_rooms,
                asset_size_in_meters: this.state.square_meter,
                location: {
                    city: this.state.city,
                    street: this.state.street
                }
            }
        });
        axios.post("operations", operation, {headers:{"Content-Type" : "application/json"}})
        .then((response) => {
            console.log(response.data)
            this.setState({calculate_result_from_server: response.data}) 
            if (Object.keys(response.data).length == 0) {
                this.setState({error_search: true})
            }   
        })
        .catch((error) => {
            this.setState({error_search: true})
            console.log(error.response.data)
        });
    }

    get_streets_by_city_data = (city) => {
        const operation = JSON.stringify({
            _id: 'operation_id',
            type: "streets_by_city_apartments_data",
            invoked_by: this.props.user.user.email, //this.props.user.email
            created_timestamp: '',
            operation_attributes: {
                city: city
            }
        });
        axios.post("operations", operation, {headers:{"Content-Type" : "application/json"}})
        .then((response) => {
            let tmp_streets = [ ... new Set(response.data['0'].filter(element => {
                return element !== null;
              }).map((val => (val.split(/[\d\.]+/)[0].trim()))))].map((val=> ({label: val})))
              console.log(tmp_streets)
            this.setState({streets_by_city: tmp_streets }) 
               
        })
        .catch((error) => {
            console.log(error.response.data)
        });
    }

    uniq = (arr) => {
        arr.filter((val, id) => {
            return arr.indexOf(val) == id;  
        });
        return arr;
    }

    checkDigits = (field) => {
        return /^[0-9]+$/.test(field);
    }

    checkInputs = () => {
        if (!this.checkDigits(this.state.square_meter)) {
            return 'Square Meter should be a number';
        }
        if (!this.checkDigits(this.state.num_of_rooms)) {
            return 'Number Of Rooms should be a number';
        }
        return ''
    }

    render() {
        const modal_style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
          };
        let error = null;
        if (this.state.error != '') {
            error = (
            <Alert severity="error">{this.state.error}.</Alert>
            );
        }
        let calculate_data_view = <CircularProgress />;
        if (this.state.calculate_result_from_server && (Object.keys(this.state.calculate_result_from_server).length > 0)) {
            calculate_data_view = <CalculateResults data={this.state.calculate_result_from_server} square_meter={this.state.square_meter}></CalculateResults>
        }
        else if(this.state.error_search){
            calculate_data_view = <Alert severity="info">{this.state.msg_error_search}.</Alert>
        }
        return (
            <div style={{alignContent:'center', backgroundColor: 'aliceblue', width: '100%', maxWidth: '500px', display: 'block', margin: '0 auto', marginTop: '100px', borderRadius: '30px'}}>
                 <Modal
                        open={this.state.show_modal}
                        onClose={this.handleCloseModal}
                        aria-labelledby="parent-modal-title"
                        aria-describedby="parent-modal-description">
                        <Box sx={{ ...modal_style, width: 800, maxHeight: 700, overflowY: 'auto' }}>
                        {calculate_data_view}
                        </Box>
                </Modal>
                <form onSubmit={this.handleSubmitForm}>
                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 2, width: '25ch' }
                    }}
                    noValidate
                    autoComplete="on"
                >
                    <div>
                    <TextField
                        required
                        label="Square Meter"
                        type= "number"
                        onChange={this.handleChangeSquareMeter}
                    />
                    <TextField
                        required
                        label="Number Of Rooms"
                        type= "number"
                        onChange={this.handleChangeNumOfRooms}
                    />
                    </div>
                    <div style={{display: 'inline-block'}}>
                    <Autocomplete
                                id="filled-adornment-amount"
                                getOptionLabel={ (option) => option.label }
                                onChange={(event, newVal)=> {
                                    if(newVal == null){ this.setState({ city: '', streets_by_city: ''}) }
                                    else {
                                        this.get_streets_by_city_data(newVal.label) 
                                        this.setState({ city: newVal.label }) }
                                }}
                                options={[{label: 'קרית שמונה'}, {label: 'בית שאן'}]}
                                renderInput={(params) => <TextField required {...params} label="City" />}
                    />
                    <Fade in={this.state.city != '' && (Object.keys(this.state.streets_by_city).length > 0)}>
                            <Autocomplete
                                id="filled-adornment-amount"
                                clearOnEscape
                                getOptionLabel={ (option) => option.label }
                                options={this.state.streets_by_city}
                                onChange={(event, newVal)=> {
                                    if(newVal == null){ this.setState({ street: '' }) }
                                    else { this.setState({ street: newVal.label}) }
                                }}
                                renderInput={(params) => <TextField {...params} label="Street" />}
                                />
                    </Fade>
                    </div>
                    <div>
                        <Button type='submit' style={{  width: "150px", height: '50px', marginBottom: '10px' }} variant="contained" size = 'large'>
                            Calculate
                        </Button>
                    </div>
                </Box>
                </form>
            </div>
        )
    }    
}
const mapStateToProps = (state) => {
    return {
      item: state.item,
      user: state.user
    };
  };
  function mapDispatchToProps(dispatch) {
    return {
      saveItem: (item) => dispatch(saveItem(item)),
      saveUser: (user) => dispatch(saveUser(user)),
    };
  }
const Calculate = connect(mapStateToProps, mapDispatchToProps)(CalculateSearchForm);
export default Calculate;
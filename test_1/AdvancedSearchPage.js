'use strict';
import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    Button,
    View,ScrollView,
} from 'react-native';


import { Form,
    Separator,InputField, LinkField,
    SwitchField, PickerField,DatePickerField,TimePickerField
} from 'react-native-form-generator';

export default class AdvancedSearchPage extends Component{
    constructor(props){
        super(props);
        this.state = {
            formData:{}
        }
    }
    handleFormChange(formData){
        /*
        formData will contain all the values of the form,
        in this example.

        formData = {
        first_name:"",
        last_name:"",
        gender: '',
        birthday: Date,
        has_accepted_conditions: bool
        }
        */

        this.setState({formData:formData})
        this.props.onFormChange && this.props.onFormChange(formData);
    }
    handleFormFocus(e, component){
        //console.log(e, component);
    }
    openTermsAndConditionsURL(){

    }

    _search(){
        console.log(JSON.stringify(this.state.formData));
    }

    render(){
        return (<ScrollView keyboardShouldPersistTaps="always" style={{paddingLeft:10,paddingRight:10, height:200}}>
            <Form
                ref='registrationForm'
                onFocus={this.handleFormFocus.bind(this)}
                onChange={this.handleFormChange.bind(this)}
                label="Personal Information">
                <Separator />
                <PickerField ref='SearchType'
                             label='Achat ou location ?'
                             options={{
                                 "": '',
                                 acheter: 'Acheter',
                                 louer: 'Louer'
                             }}/>
                <PickerField ref='housingType'
                             label='Quel type de bien cherchez vous ?'
                             options={{
                                 "": '',
                                 house: 'Maison',
                                 apartment: 'Appartement',
                                 land: 'Terrain',
                                 garage: 'Garage'
                             }}/>
                <InputField ref='localisation'
                            placeholder='Code postal, ville, ...'
                            label='Localisation'
                />
                <Separator
                label="Habitation" // optional: if present it will show the text
                />
                <InputField ref='min_home_size'
                            placeholder='Superficie Minimum'
                            /*validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches != null) {
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}*/


                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    alert('Chiffres uniquement')
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
                <InputField ref='max_home_size'
                            placeholder='Superficie Maximum'
                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
                <Separator
                    label="Terrain" // optional: if present it will show the text
                />
                <InputField ref='min_land_size'
                            placeholder='Superficie Minimum'
                            validationFunction={[(value)=>{

                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
                <InputField ref='max_land_size'
                            placeholder='Superficie Maximum'
                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />

                <Separator
                    label="Prix" // optional: if present it will show the text
                />
                <InputField ref='min_price'
                            placeholder='Prix Minimum'
                            validationFunction={[(value)=>{

                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
                <InputField ref='max_price'
                            placeholder='Prix Maximum'
                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />

                <Separator
                    label="Pour affiner votre recherche" // optional: if present it will show the text
                />

                <InputField ref='room_nb'
                            placeholder='Nombre de pièces'
                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
                <InputField ref='bedroom_nb'
                            placeholder='Nombre de chambres'
                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
                <InputField ref='floor'
                            placeholder='Étage'
                            validationFunction={[(value)=>{


                                if(value == '') return "Required";
                                //Initial state is null/undefined
                                if(!value) return true;
                                // Check if First Name Contains Numbers
                                var matches = value.match(/\d+/g);
                                if (matches == null) {
                                    console.log('Pas de chiffres');
                                    return "First Name can't contain numbers";
                                }

                                return true;
                            }, (value)=>{
                                ///Initial state is null/undefined
                                if(!value) return true;
                                if(value.indexOf('4')!=-1){
                                    return "I can't stand number 4";
                                }
                                return true;
                            }]}
                />
            </Form>
            <Button
                onPress={this._search.bind(this)}
                color='#48BBEC'
                title='Go'
            />
            <Text>{JSON.stringify(this.state.formData)}</Text>

        </ScrollView>);
    }
}
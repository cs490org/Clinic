package com.cs490.group4.demo.dao;

import jakarta.persistence.*;


/*
Represnents a table in the data base
each instance of Doctor corresponsds to a row 
use JPA annotations for special colunm properties
*/
@Entity
public class Doctor {
    @Id
    private Integer id; //primary key


    // TODO: other infor about doctors..
}

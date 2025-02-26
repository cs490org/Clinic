package com.cs490.group4.demo.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;


/*
interacts with database
CRUD operations inherited from JpaRepository

automaticlaly creates SQL queroies
*/
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {


}
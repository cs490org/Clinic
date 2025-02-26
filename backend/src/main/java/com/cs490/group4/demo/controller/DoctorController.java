
/*
handle HTTP requests
calls DoctorService to retrieve and proces sdata

returns JSON from HTTP requsts.

flow:
client makes request
Controler handles request
Service processes the request
Repo fetches data from database
Service returns data to Controller
    Why do we need Service?
    same reason why we use geters and setters - sepeartoin of concerns
Contrller sends response to client

Controller -> Service -> Repository (Query database) -> Service -> Controller
*/
package com.cs490.group4.demo.controller;public class DoctorController {
}

//package com.group3.basic.netcracker.backend.coursetable.courseservice.serviceimpl;
//
//import com.group3.basic.netcracker.backend.coursetable.courseservice.CourseService;
//import com.group3.basic.netcracker.backend.coursetable.dao.CourseDAO;
//import com.group3.basic.netcracker.backend.coursetable.entity.Course;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDate;
//import java.util.List;
//
//@Service
//public class CourseServiceImpl implements CourseService{
//    private final CourseDAO courseDAO;
//
//    @Autowired
//    public CourseServiceImpl(CourseDAO courseDAO) {
//        this.courseDAO = courseDAO;
//    }
//
//    @Override
//    public void createCourse(String name, LocalDate start_date, LocalDate end_date, String info, String skill_level, String learn_direction, int user_id, int qty_per_week) {
//        courseDAO.createCourse(name, start_date, end_date, info, skill_level, learn_direction, user_id, qty_per_week);
//    }
//
//    @Override
//    public Course getCourseById(int id) {
//        return courseDAO.getCourseById(id);
//    }
//
//    @Override
//    public List listCourses() {
//        return courseDAO.listCourses();
//    }
//
//    @Override
//    public void removeCourse(int id) {
//        courseDAO.removeCourse(id);
//    }
//
//    @Override
//    public void updateCourse(int id, String name, LocalDate start_date, LocalDate end_date, String info, String skill_level, String learn_direction, int user_id, int qty_per_week) {
//        courseDAO.updateCourse(id, name, start_date, end_date, info, skill_level, learn_direction, user_id, qty_per_week);
//    }
//}

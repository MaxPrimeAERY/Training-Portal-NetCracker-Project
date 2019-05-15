package com.group3.basic.netcracker.backend.dao.impl;

import java.util.List;

import com.group3.basic.netcracker.backend.dao.ScheduleDao;
import com.group3.basic.netcracker.backend.entity.Schedule;
import com.group3.basic.netcracker.backend.util.rowmapper.ScheduleRowMapper;
import com.group3.basic.netcracker.backend.util.rowmapper.ScheduleWithInfoRowMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.sql.DataSource;

@Transactional
@Repository
public class ScheduleDaoImpl implements ScheduleDao {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    private DataSource dataSource;

    @Autowired
    public ScheduleDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Schedule getScheduleById(int id) {
        String SQL = "SELECT * FROM \"Schedule\" WHERE id = ?";
        Schedule shedule = (Schedule) jdbcTemplate.queryForObject(SQL, new Object[]{id}, new ScheduleRowMapper());
        return shedule;
    }


    @Override
    public List listSchedule() {
        String SQL = "SELECT id, user_id, time_slot_id, is_choosen FROM \"Schedule\"";
        List shedule = jdbcTemplate.query(SQL, new ScheduleRowMapper());
        return shedule;
    }

    @Override
    public List listScheduleWithCourseAndTimeSlotAndUser(){
        String SQL = "select C2.id, C2.name, s.is_choosen, replace(cast(replace(cast(replace(cast(string_agg(U.fname || ' '\n" +
                "|| U.lname, ', ') as varchar),'{' ,'')as text), '}','') as varchar),'\"', '')\n" +
                "as \"Students\", TS.start_time, TS.end_time, TS.week_day from \"Schedule\" s\n" +
                "join \"User\" U on s.user_id = U.id\n" +
                "join \"TimeSlot\" TS on s.time_slot_id = TS.id\n" +
                "join \"Course\" C2 on TS.course_id = C2.id\n" +
                "group by C2.id, C2.name,TS.start_time, TS.end_time, TS.week_day, s.is_choosen\n" +
                "order by C2.name, TS.week_day, TS.start_time";
        List schedule = jdbcTemplate.query(SQL, new ScheduleWithInfoRowMapper());
        return schedule;
    }

    @Override
    public void removeSchedule(int id) {
        String SQL = "DELETE FROM \"Schedule\" WHERE id = ?";
        jdbcTemplate.update(SQL, id);
        System.out.println("Schedule removed");
    }

    @Override
    public void updateSchedule(int userId, int timeSlotId, boolean isChoosen, int id) {
        String SQL = "UPDATE \"Schedule\" SET user_id = ?, time_slot_id = ?, is_choosen = ? WHERE id = ?";
        jdbcTemplate.update(SQL, userId, timeSlotId, isChoosen);
        System.out.println("Schedule updated.");
    }

    @Override
    public void createSchedule(int userId, int timeSlotId, boolean isChoosen) {
        String SQL = "INSERT INTO \"Schedule\" (user_id, time_slot_id, is_choosen) VALUES (?,?,?)";
        jdbcTemplate.update(SQL,  userId, timeSlotId, isChoosen);
        System.out.println("Schedule created.");
    }

    @Override
    public void generateSchedule(int course) {
        SimpleJdbcCall call = new SimpleJdbcCall(jdbcTemplate)
                .withFunctionName("schedule_setter");

        SqlParameterSource paramMap = new MapSqlParameterSource()
                .addValue("course", course);

        Integer result = call.executeFunction(Integer.class, paramMap);
        System.out.println(result);
    }

}



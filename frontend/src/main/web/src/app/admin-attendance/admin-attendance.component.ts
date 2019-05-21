import { Component, OnInit } from '@angular/core';
import { AdminAttService } from "../services/admin-att.service";
import { UserAtt } from "../interface/user-att";
import { LessonAtt } from "../interface/lesson-att";
import { CourseAtt } from "../interface/course-att";
import { TrainerSelector } from "../interface/trainer-selector";
import { ToasterService } from "../services/toaster.service";

@Component({
  selector: 'app-admin-attendance',
  templateUrl: './admin-attendance.component.html',
  styleUrls: ['./admin-attendance.component.css']
})
export class AdminAttendanceComponent implements OnInit {
  panelOpenState = false;

  courseList: CourseAtt[];
  courseListByTrainer: CourseAtt[];
  courseListByUser: CourseAtt[];
  courseListByLevel: CourseAtt[];
  lessonList: LessonAtt[];
  userList: UserAtt[];

  choosenOneCourse: number = -1;
  choosenOneLesson: number = -1;

  isChooseCoursesSelected: boolean;
  isSelectAllSelected: boolean;

  trainerSelector: TrainerSelector[];
  trainerSelected: number;

  levelSelector: string[];
  levelSelected: number;

  userValue: string;

  selectedCourseArray: Array<{ id: any, isSelected: any }> = [];
  selectedCoursesForReport: Array<number> = [];

  isLoading: boolean = true;
  isLoadingTrainer: boolean = false;
  isLoadingUser: boolean = false;
  isLoadingLevel: boolean = false;

  constructor(private adminService: AdminAttService,
    private toasterService: ToasterService) { }

  ngOnInit() {

    this.isChooseCoursesSelected = false;
    this.isSelectAllSelected = true;

    this.adminService.getCourses()
      .subscribe(data => { this.courseList = data; this.isLoading = false });
    this.levelSelector = [
      "Beginner", "Junior", "Middle", "Master"
    ]
    this.adminService.getAllTrainer()
      .subscribe(data => this.trainerSelector = data);

    this.trainerSelected = -1;
    this.levelSelected = -1;
  }


  setChoosenCourse(id: number) {
    if (this.choosenOneCourse === id) {
      this.choosenOneCourse = -1;
    } else {
      this.choosenOneCourse = id;
      this.getLessons(id);
    }
  }

  setChoosenLesson(id: number) {
    if (this.choosenOneLesson === id) {
      this.choosenOneLesson = -1;
    } else {
      this.choosenOneLesson = id;
      this.getUsers(id);
    }
  }

  getLessons(id: number) {
    this.lessonList = [];
    this.adminService.getLessons(id)
      .subscribe(data => this.lessonList = data);
  }

  getUsers(id: number) {
    this.userList = [];
    this.adminService.getStudents(id)
      .subscribe(data => this.userList = data);
  }

  setSelectedCoursesArray() {
    this.selectedCourseArray = [];
    this.courseList.forEach(course => {
      this.selectedCourseArray.push({ id: course.courseId, isSelected: true });
    });
  }


  filterByUser(username: string) {
    this.isLoadingUser = true;
    console.log(username);
    this.choosenOneCourse = -1;
    this.choosenOneLesson = -1;
    this.adminService.filterByUser(username)
      .subscribe(data => { this.courseListByUser = data; this.isLoadingUser = false });
  }

  filterByTrainer(id: number) {
    this.adminService.filterByTrainer(id)
      .subscribe(data => { this.courseListByTrainer = data; this.isLoadingTrainer = false });
  }

  filterBySkillLevel(level: string) {
    this.adminService.filterBySkillLevel(level)
      .subscribe(data => { this.courseListByLevel = data; this.isLoadingLevel = false });
  }

  onTrainerSelected(val: any) {
    this.isLoadingTrainer = true;
    this.choosenOneCourse = -1;
    this.choosenOneLesson = -1;
    this.filterByTrainer(val);
    console.log(val)
  }

  onLevelSelected(val: any) {
    this.isLoadingLevel = true;
    this.choosenOneCourse = -1;
    this.choosenOneLesson = -1;
    this.filterBySkillLevel(val);
    console.log(val);
  }

  setSelectAll(selected: boolean) {
    this.isSelectAllSelected = selected;
    this.selectedCourseArray.forEach(course => {
      course.isSelected = selected;
    });
  }

  setChooseCousesMode() {
    this.isChooseCoursesSelected = true;
    this.setSelectedCoursesArray();
    console.log(this.selectedCourseArray)
  }

  createReportByCourse() {
    this.selectedCoursesForReport = [];
    this.selectedCourseArray.forEach(course => {
      if (course.isSelected)
        this.selectedCoursesForReport.push(course.id);
    });
    console.log(this.selectedCoursesForReport);
    this.adminService.createReportByCourse(this.selectedCoursesForReport)
      .subscribe(
        data => {
          console.log(data);

          if (data.body)
            this.toasterService.Success("Success", "Report download successfully");
        },
        error => {
          console.log(error);

          this.toasterService.Error("Error!", "Http failure response");
        });
  }

  createReportByTrainer() {
    this.adminService.createReportByTrainer(this.trainerSelected)
      .subscribe(
        data => console.log(data),
        error => console.log(error))
  }

  createReportByStudent() {
    this.adminService.createReportByStudent(this.userValue)
      .subscribe(
        data => {
          console.log(data);

          if (data.body)
            this.toasterService.Success("Success", "Report download successfully");
        },
        error => {
          console.log(error);

          this.toasterService.Error("Error!", "Http failure response");
        });
  }

  createReportByLevel() {
    this.adminService.createReportByLevel(this.levelSelected.toString())
      .subscribe(
        data => {
          console.log(data);

          if (data.body)
            this.toasterService.Success("Success", "Report download successfully");
        },
        error => {
          console.log(error);

          this.toasterService.Error("Error!", "Http failure response");
        });
  }
}

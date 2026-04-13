import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apollo = inject(Apollo);
  private http = inject(HttpClient);

  getEmployees() {
    console.log('Calling getEmployees query');

    return this.apollo.watchQuery({
      query: gql`
        query GetEmployees {
          employees {
            _id
            first_name
            last_name
            email
            department
            designation
            salary
            gender
            date_of_joining
            employee_photo
          }
        }
      `,
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  // _id: ID!
  //   first_name: String!
  //   last_name: String!
  //   email: String!
  //   gender: String!
  //   designation: String!
  //   salary: Float!
  //   date_of_joining: String!
  //   department: String!
  //   employee_photo: String
  //   created_at: String
  //   updated_at: String

  getEmployeeById(employeeId: string) {
    console.log('Calling getEmployeeById query');

    return this.apollo.watchQuery<{
      employee: {
        _id: string;
        first_name: string;
        last_name: string;
        email: string;
        department: string;
        designation: string;
        gender: string;
        salary: number;
        date_of_joining: string;
        employee_photo: string;
      } | null;
    }>({
      query: gql`
        query GetEmployeeById($employeeId: ID!) {
          employee(id: $employeeId) {
            _id
            first_name
            last_name
            email
            department
            designation
            salary
            gender
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { employeeId },
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }

  addEmployee(employeeData: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation createEmployee(
          $first_name: String!
          $last_name: String!
          $email: String!
          $gender: String!
          $designation: String!
          $salary: Float!
          $department: String!
          $employee_photo: String
        ) {
          createEmployee(
            first_name: $first_name
            last_name: $last_name
            email: $email
            gender: $gender
            designation: $designation
            salary: $salary
            department: $department
            employee_photo: $employee_photo
          ) {
            _id
            first_name
            last_name
          }
        }
      `,
      variables: employeeData,
    });
  }

  updateEmployee(id: string, employeeData: any) {
    return this.apollo.mutate<{
      updateEmployee: {
        _id: string;
        first_name: string;
        last_name: string;
        email: string;
        department: string;
        designation: string;
        gender: string;
        salary: number;
        employee_photo?: string;
        date_of_joining: string;
      };
    }>({
      mutation: gql`
        mutation UpdateEmployee(
          $id: ID!
          $first_name: String
          $last_name: String
          $email: String
          $gender: String
          $designation: String
          $salary: Float
          $department: String
          $employee_photo: String
          $date_of_joining: String
        ) {
          updateEmployee(
            id: $id
            first_name: $first_name
            last_name: $last_name
            email: $email
            gender: $gender
            designation: $designation
            salary: $salary
            department: $department
            employee_photo: $employee_photo
            date_of_joining: $date_of_joining
          ) {
            _id
            first_name
            last_name
            email
            department
            designation
            gender
            salary
            employee_photo
            date_of_joining
          }
        }
      `,
      variables: {
        id,
        ...employeeData,
      },
    });
  }

  deleteEmployee(id: string) {
    return this.apollo.mutate<{
      deleteEmployee: {
        _id: string;
        first_name: string;
        last_name: string;
      } | null;
    }>({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id) {
            _id
            first_name
            last_name
          }
        }
      `,
      variables: { id },
    });
  }
  uploadEmployeePhoto(employeeId: string, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{
      message: string;
      employee: any;
    }>(`${environment.apiBaseUrl}/api/employees/${employeeId}/photo`, formData);
  }

  searchEmployees(search: string) {
    return this.apollo.watchQuery<{
      findEmployeesByDesignationOrDepartment: {
        _id: string;
        first_name: string;
        last_name: string;
        email: string;
        department: string;
        designation: string;
        gender: string;
        salary: number;
        date_of_joining: string;
        employee_photo?: string;
      }[];
    }>({
      query: gql`
        query SearchEmployees($search: String) {
          findEmployeesByDesignationOrDepartment(search: $search) {
            _id
            first_name
            last_name
            email
            department
            designation
            gender
            salary
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { search },
      fetchPolicy: 'no-cache',
    }).valueChanges;
  }
}

import { Injectable, inject } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private apollo = inject(Apollo);

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
}

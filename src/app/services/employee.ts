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
}

import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-brand-forms',
  templateUrl: './brand-forms.component.html',
  styleUrls: ['./brand-forms.component.css']
})
export class BrandFormsComponent implements OnInit {
  formData: any;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {

    const payload = {
      client_id: 'CO-40',
      device: '1',
      device_id: 'browser',
      app_version: '1',
      user_id: '115',
      admin_id: '115',
      brand_id: '108',
      is_panel: '1'
    };

    const headers = new HttpHeaders()
      .set('Authorization', 'IrAuCxwLhBO49H7iqAxLpJ6ZRfK47C0Ia2DHFFZn')
      .set('Content-Type', 'application/json').set('Access-Control-Allow-Origin', 'http://localhost:4200');

    this.http.post('https://benepik.in/yorker/api/brandForm', payload, { headers }).subscribe((data) => {
      const formElement = document.createElement('form');
      formElement.setAttribute('class', 'my-form');

      // Create an object to store the form data
      const formData: any = {};

      // Loop over the field definitions and create the corresponding HTML elements
      (data as any)['data'].forEach((field: any) => {
        // Create a container div for the field
        const fieldContainer = document.createElement('div');
        fieldContainer.style.marginBottom = '10px';

        // Create an input element for the field
        const inputElement = document.createElement('input');

        // Set the input element's attributes based on the data
        inputElement.type = field.field_type;
        inputElement.name = field.table_column;
        inputElement.id = `auto_id_${field.auto_id}`;
        inputElement.placeholder = field.placeholder;
        inputElement.required = field.is_mandatory === "1";
        inputElement.maxLength = field.field_type_value;
        inputElement.textContent = field.error_message;

        // Add a label element for the field
        const labelElement = document.createElement('label');
        labelElement.htmlFor = `auto_id_${field.auto_id}`;
        labelElement.textContent = field.field_name;
        labelElement.style.marginRight = '10px';
        labelElement.style.marginBottom = '20px';

        // Append the input and label elements to the container div
        fieldContainer.appendChild(labelElement);
        fieldContainer.appendChild(inputElement);

        // Append the container div to the form
        formElement.appendChild(fieldContainer);


        // Add the input element to the formData object
        formData[field.table_column] = inputElement;
      });

      // Create a submit button element for the form
      const submitButton = document.createElement('button');
      submitButton.setAttribute('type', 'submit');
      submitButton.setAttribute('class', 'submit-button');
      submitButton.textContent = 'Submit';
      formElement.style.padding = '20px';
      formElement.style.backgroundColor = '#f5f5f5';
      formElement.style.borderRadius = '5px';

      // Append the submit button to the form
      formElement.appendChild(submitButton);
      document.body.appendChild(formElement);

      // Add an event listener to the form's submit button
      submitButton.addEventListener('click', (event) => {
        event.preventDefault();

        // Check that all mandatory fields have been filled in
        let hasError = false;
        Object.entries(formData).forEach(([key, inputElement]) => {
          console.log(key, inputElement);
          if ((inputElement as any).required && (inputElement as any).value.trim() === '') {
            const fieldContainer = (inputElement as any).parentNode;
            const errorMessageElement = document.createElement('p');
            errorMessageElement.style.color = 'red';
            errorMessageElement.textContent = `${(inputElement as any).textContent}`;
            fieldContainer.appendChild(errorMessageElement);
            hasError = true;
          }
        });

        // If there is an error, do not submit the form
        if (hasError) {
          return;
        }

        // If all mandatory fields have been filled in, submit the form
        const payload = { ...formData };
        console.log(payload); // Replace with your submission logic
      });



    });
  }
}

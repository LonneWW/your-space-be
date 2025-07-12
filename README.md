# your-space-be

This is the backend of the final project of the master in full stack development at start2impact universty.

## Features

- **Patient Management**

  - Create a patient account
  - Link with a therapist
  - Unlink with a therapist

- **Therapist Management**
  
  - Create a therapist account
  - Link with a patient
  - Unlink with a patient

- **Notes Management**
  
  - Create notes
  - Get notes, from both accounts, with different filters based on the occasion
  - Update notes
  - Modify notes
  - Delete notes

- **Notifications Management**
  
  Part of the notification management is done via back-end. It is not possible to create or modify them directly.
  
  - Create a notification (indirectly)
  - Delete a notification


## Installation and configurations

1. **Clone the repository**
   ```
   git clone https://github.com/LonneWW/your-space-be.git
   ```
2. **Navigate to the project directory**
   ```
   cd your-space-be
   ```
3. **Install dependencies**
   ```
   npm install
   ```
4. **Configure the database**
   - Config the `.env` file.
   - Clone the database with the `migration.sql` file (apparenly on Linux there could be errors caused by camel case sensitivity. it can be fixed by capitalize the names of the tables like in the queries).

To test the API you can use tools like Postman.

##Flaws

<ol>
  <li>
    Writing this readme I noticed that I did not give the user the opportunity to delete their account.
  </li>
  <li>
    I learned a lot developing this project. A side effect of this is that the code can be unorganized and unoptimized.For example, many of the endpoints are not used when using the application.
  </li>
</ol>

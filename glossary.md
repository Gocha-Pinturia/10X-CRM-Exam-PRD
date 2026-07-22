# Technical Glossary

This glossary contains key technical terms used in the 10X CRM project, along with their English definitions and Georgian explanations.

## 1. Authentication
**English**: The process of verifying a user's identity before granting them access to the protected parts of the application.  
**ქართული**: ავთენტიკაცია არის პროცესი, რომლის დროსაც სისტემა ამოწმებს მომხმარებლის ვინაობას (მაგალითად, ელ. ფოსტისა და პაროლის შემოწმებით), სანამ მას დაცულ გვერდებზე წვდომის უფლებას მისცემს.

## 2. Session
**English**: A period of interaction between a user and the application, typically tracked by storing a session object in `localStorage` to keep the user logged in across page reloads.  
**ქართული**: სესია არის მომხმარებლისა და აპლიკაციის ურთიერთქმედების პერიოდი. ჩვენს პროექტში ის ინახება `localStorage`-ში (`crm_session`), რათა გვერდის გადატვირთვისას მომხმარებელს ხელახლა შესვლა არ მოუწიოს.

## 3. Validation
**English**: The process of checking if user input meets specific rules and constraints before processing or saving the data to prevent errors and ensure data integrity.  
**ქართული**: ვალიდაცია არის შეყვანილი მონაცემების შემოწმება დადგენილი წესების მიხედვით (მაგალითად, პაროლის სიგრძე ან email-ის ფორმატი) მათი შენახვამდე, რათა თავიდან ავიცილოთ შეცდომები და არასწორი მონაცემები.

## 4. Fetch
**English**: A built-in JavaScript API used to make asynchronous network requests to retrieve or send data from/to a server using Promises and `async/await`.  
**ქართული**: `fetch` არის JavaScript-ის ჩაშენებული ინსტრუმენტი (API), რომელიც გამოიყენება სერვერთან ასინქრონული კომუნიკაციისთვის (მონაცემების წამოსაღებად ან გასაგზავნად) `async/await` სინტაქსის გამოყენებით.

## 5. Endpoint
**English**: A specific URL where an API receives requests and returns responses, representing a particular resource or action (e.g., `/users` or `/users/add`).  
**ქართული**: Endpoint (ბოლო წერტილი) არის კონკრეტული URL მისამართი, სადაც API იღებს ჩვენს მოთხოვნას და აბრუნებს პასუხს. მაგალითად, DummyJSON-ში `https://dummyjson.com/users` არის endpoint მომხმარებლების მისაღებად.

## 6. Request Method
**English**: An HTTP verb (such as GET, POST, PUT, or DELETE) that indicates the desired action to be performed on a specific resource on the server.  
**ქართული**: მოთხოვნის მეთოდი (HTTP Method) არის ბრძანება, რომელიც ეუბნება სერვერს, რა ტიპის ოპერაცია უნდა შეასრულოს: GET (მონაცემის წამოღება), POST (ახლის დამატება), PUT (არსებულის განახლება) თუ DELETE (წაშლა).

## 7. JSON
**English**: JavaScript Object Notation, a lightweight, text-based data-interchange format that is easy for humans to read and for machines to parse and generate.  
**ქართული**: JSON არის მონაცემთა გადაცემის სტანდარტული, ტექსტური ფორმატი. ის გამოიყურება როგორც JavaScript-ის ობიექტი და გამოიყენება სერვერსა და ბრაუზერს შორის მონაცემების გადასაცემად (მაგალითად, `JSON.stringify()` და `JSON.parse()`).

## 8. State
**English**: The current condition or data of the application at any given moment, which determines what is rendered on the screen (e.g., the `crm_clients` array).  
**ქართული**: State (მდგომარეობა) არის აპლიკაციის მიმდინარე მონაცემები კონკრეტულ მომენტში. მაგალითად, კლიენტების მასივი არის ჩვენი აპლიკაციის "state", რომლის ცვლილებაც იწვევს ეკრანზე ინფორმაციის განახლებას.

## 9. Event Listener
**English**: A JavaScript function that waits for a specific event (like a click, input, or submit) to occur on a DOM element and then executes a callback function in response.  
**ქართული**: Event Listener (მოვლენის მოსმენი) არის ფუნქცია, რომელიც "უსმენს" კონკრეტულ მოქმედებას ელემენტზე (მაგალითად, ღილაკზე დაწკაპუნებას ან ფორმაში ტექსტის შეყვანას) და ამ მოქმედების მოხდენისას ასრულებს წინასწარ განსაზღვრულ კოდს.

## 10. Deployment
**English**: The process of publishing the application's code to a live hosting server (like Vercel or Netlify) so it can be accessed by users via the internet.  
**ქართული**: Deployment (განთავსება/დეპლოი) არის პროექტის ინტერნეტში ცოცხლად (live) ატვირთვის პროცესი ისეთ პლატფორმაზე, როგორიცაა Vercel ან Netlify, რათა ნებისმიერმა ადამიანმა შეძლოს მისი ნახვა ბმულის მეშვეობით.
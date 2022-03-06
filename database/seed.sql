
USE employeetracker_db;

INSERT INTO department (name)
VALUES("Front-End"),
("Back-End"),
("API-Team"),
("Debug"),
("Boss");

INSERT INTO role (title, salary, department_id)
VALUES ("API Lead", 100000, 3),
("CSS Lead", 200000, 4),
("Front End Lead", 150000, 1),
("Back End Lead", 150000, 2),
("Back End Developer", 180000, 2),
("API Developer", 150000, 3),
("Front End Developer", 200000, 1),
("CSS Devloper", 150000, 4),
("Manager", 300000, 5);
        
INSERT INTO employee (first_name, last_name, role_id, manager_id)
	VALUES ("Joseph", "Lee", 3, NULL),
("Robert", "Tan", 1, NULL),
("Frank", "Nelson", 7, 3),
("Sam", "Collura", 4, NULL),
("Ian", "Wilkerson", 6, 1),
("Steve", "Wills", 8, 2),
("Mark", "Henderson", 2, NULL),
("Lee", "Andrews", 5, 4),
("Marley", "Mae", 9, NULL);